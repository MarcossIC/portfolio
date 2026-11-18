import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ATMOS_ATTRIBUTE, AtmosphereService, type Atmos } from '@app/services/atmosphere.service';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';
import {
  PARALLAX_EPSILON_PX,
  PARALLAX_TAU_MS,
  bakeScale,
  buildStars,
  flareBackground,
  isLiteViewport,
  parallaxTarget,
  shouldRebake,
  smoothToward,
} from './cosmic-background.utils';
import { ATMOS_TOKEN_FALLBACK, type AtmosBakeTokens, bakeAtmosphere, readAtmosTokens } from './cosmic-bake';

/** Pad of .parallax-layer (inset: -40px) on each side. */
const LAYER_PAD_PX = 40;
const RESIZE_DEBOUNCE_MS = 250;

type IdleHandle = { cancel: () => void };

/** requestIdleCallback with a deadline; Safari has none → short timeout. */
function whenIdle(cb: () => void, timeout = 1200): IdleHandle {
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(cb, { timeout });
    return { cancel: () => cancelIdleCallback(id) };
  }
  const id = setTimeout(cb, 60);
  return { cancel: () => clearTimeout(id) };
}

@Component({
  standalone: true,
  selector: 'cosmic-background',
  templateUrl: './cosmic-background.component.html',
  styleUrl: './cosmic-background.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-baked]': 'baked()',
    '[class.is-paused]': 'paused()',
  },
})
export class CosmicBackgroundComponent {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly atmosphere = inject(AtmosphereService);
  private readonly reducedMotion = inject(ReducedMotionService);

  protected readonly parallaxLayer = viewChild.required<ElementRef<HTMLDivElement>>('parallaxLayer');
  private readonly nebulaImg = viewChild.required<ElementRef<HTMLImageElement>>('nebulaImg');
  private readonly bakeNebula = viewChild.required<ElementRef<HTMLCanvasElement>>('bakeNebula');
  private readonly bakeEmber = viewChild.required<ElementRef<HTMLCanvasElement>>('bakeEmber');

  /** Seeded → SSR and client agree on every star. */
  protected readonly stars = buildStars();
  protected readonly flareCore = flareBackground(this.stars.filter((s) => !s.extra));
  protected readonly flareExtra = flareBackground(this.stars.filter((s) => s.extra));

  /** Both atmospheres baked → the blended live stack leaves the render tree. */
  protected readonly baked = signal(false);
  /** Tab hidden → infinite CSS animations paused. */
  protected readonly paused = signal(false);

  private pendingIdle: IdleHandle[] = [];
  private bakedSize = { w: 0, h: 0 };
  /** Bumped per bake run: a newer run (resize) aborts an in-flight one. */
  private bakeGen = 0;
  private disposed = false;

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      this.watchVisibility();
      this.setupParallax();
      this.setupBake();
    });

    this.destroyRef.onDestroy(() => {
      this.disposed = true;
      this.pendingIdle.forEach((h) => h.cancel());
    });
  }

  private watchVisibility(): void {
    const doc = this.document;
    const sync = () => this.paused.set(doc.hidden === true);
    sync();
    doc.addEventListener('visibilitychange', sync);
    this.destroyRef.onDestroy(() => doc.removeEventListener('visibilitychange', sync));
  }

  /**
   * Mouse parallax as a rAF loop with dt-based exponential smoothing: frame-rate
   * independent, writes the transform directly (no change detection) and goes
   * idle once converged. Fine pointers only; reduced motion is honored live.
   */
  private setupParallax(): void {
    const win = this.document.defaultView;
    if (!win?.matchMedia || !win.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const layer = this.parallaxLayer().nativeElement;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let last = 0;
    let raf = 0;

    const frame = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      cx = smoothToward(cx, tx, dt, PARALLAX_TAU_MS);
      cy = smoothToward(cy, ty, dt, PARALLAX_TAU_MS);

      if (Math.abs(tx - cx) < PARALLAX_EPSILON_PX && Math.abs(ty - cy) < PARALLAX_EPSILON_PX) {
        cx = tx;
        cy = ty;
        raf = 0;
        last = 0;
      } else {
        raf = win.requestAnimationFrame(frame);
      }
      layer.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      if (this.reducedMotion.prefersReducedMotion()) return;
      const t = parallaxTarget(e.clientX, e.clientY, win.innerWidth, win.innerHeight);
      tx = t.x;
      ty = t.y;
      if (!raf) raf = win.requestAnimationFrame(frame);
    };

    win.addEventListener('mousemove', onMove, { passive: true });
    this.destroyRef.onDestroy(() => {
      win.removeEventListener('mousemove', onMove);
      if (raf) win.cancelAnimationFrame(raf);
    });
  }

  /**
   * Bake the static stack once per atmosphere (current one first, the other in
   * the next idle slot), then drop the live blended layers. Any failure keeps
   * the live CSS stack — identical look, just costlier.
   */
  private setupBake(): void {
    const img = this.nebulaImg().nativeElement;

    const loaded =
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve, reject) => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => reject(new Error('nebula image failed')), { once: true });
          });

    loaded
      .then(() => img.decode?.().catch(() => undefined))
      .then(() => this.bakeBoth())
      .then((ok) => {
        if (!ok) return;
        this.baked.set(true);
        this.watchResize();
      })
      .catch(() => {
        /* keep the live stack */
      });
  }

  /** Bakes both atmospheres in idle slots; false if superseded/destroyed/failed. */
  private async bakeBoth(): Promise<boolean> {
    const gen = ++this.bakeGen;
    const stale = () => this.disposed || gen !== this.bakeGen;
    const first: Atmos = this.atmosphere.atmos();
    const order: Atmos[] = first === 'ember' ? ['ember', 'nebula'] : ['nebula', 'ember'];

    for (const atmos of order) {
      await this.idle();
      if (stale()) return false;
      try {
        await this.bakeOne(atmos, stale);
      } catch {
        return false; // aborted, or canvas unavailable/tainted → stay as is
      }
    }
    return !stale();
  }

  private idle(): Promise<void> {
    return new Promise((resolve) => {
      const handle = whenIdle(() => {
        this.pendingIdle = this.pendingIdle.filter((h) => h !== handle);
        resolve();
      });
      this.pendingIdle.push(handle);
    });
  }

  private async bakeOne(atmos: Atmos, aborted: () => boolean): Promise<void> {
    const win = this.document.defaultView!;
    const layer = this.parallaxLayer().nativeElement;
    const img = this.nebulaImg().nativeElement;
    const layerW = layer.offsetWidth;
    const layerH = layer.offsetHeight;
    if (!layerW || !layerH || !img.naturalWidth) throw new Error('nothing to bake');

    const lite = isLiteViewport(win.innerWidth, !!win.matchMedia?.('(pointer: coarse)').matches);
    const scale = bakeScale({
      dpr: win.devicePixelRatio || 1,
      lite,
      layerW,
      layerH,
      imgW: img.naturalWidth,
      imgH: img.naturalHeight,
    });

    const target = atmos === 'ember' ? this.bakeEmber().nativeElement : this.bakeNebula().nativeElement;
    await bakeAtmosphere(
      target,
      img,
      this.tokensFor(atmos),
      {
        layerW,
        layerH,
        viewW: layerW - LAYER_PAD_PX * 2,
        viewH: layerH - LAYER_PAD_PX * 2,
        pad: LAYER_PAD_PX,
        scale,
      },
      aborted
    );
    this.bakedSize = { w: layerW, h: layerH };
  }

  /**
   * Live token values: `[data-atmos='ember']` matches ANY element, so a probe
   * carrying the attribute resolves Ember exactly. Nebula is the :root default,
   * readable only while <html> is in Nebula; otherwise use the mirror.
   */
  private tokensFor(atmos: Atmos): AtmosBakeTokens {
    const html = this.document.documentElement;
    const fallback = ATMOS_TOKEN_FALLBACK[atmos];
    if (atmos === 'nebula') {
      return html.getAttribute(ATMOS_ATTRIBUTE) === 'ember' ? fallback : readAtmosTokens(html, fallback);
    }
    const probe = this.document.createElement('div');
    probe.setAttribute(ATMOS_ATTRIBUTE, 'ember');
    probe.hidden = true;
    this.hostRef.nativeElement.appendChild(probe);
    try {
      return readAtmosTokens(probe, fallback);
    } finally {
      probe.remove();
    }
  }

  /** Debounced re-bake; on touch only a width change counts (URL bar resizes height). */
  private watchResize(): void {
    const win = this.document.defaultView!;
    const layer = this.parallaxLayer().nativeElement;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const touch = !!win.matchMedia?.('(pointer: coarse)').matches;
        const next = { w: layer.offsetWidth, h: layer.offsetHeight };
        if (shouldRebake(this.bakedSize, next, touch)) void this.bakeBoth();
      }, RESIZE_DEBOUNCE_MS);
    };

    win.addEventListener('resize', onResize, { passive: true });
    this.destroyRef.onDestroy(() => {
      win.removeEventListener('resize', onResize);
      clearTimeout(timer);
    });
  }
}
