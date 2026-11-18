import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { AtmosphereService, type Atmos } from '@app/services/atmosphere.service';
import { I18nService } from '@app/services/i18n.service';
import { ATMOSPHERE } from '@constants/appConst';
import { isLiteViewport } from '@atoms/cosmic-background/cosmic-background.utils';

type GsapApi = typeof import('gsap').gsap;
type GsapTimeline = ReturnType<GsapApi['timeline']>;

/** Center + reach of the shockwave, measured once from the button. */
interface Wavefront {
  cx: number;
  cy: number;
  maxD: number;
}

/** Minimal shape of the View Transitions API we rely on. */
interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
}
type StartViewTransition = (cb: () => void) => ViewTransitionLike;

const SHOCK_COLORS: Record<Atmos, string> = {
  ember: 'oklch(0.66 0.24 30)',
  nebula: 'hsla(268, 95%, 78%, 1)',
};

/** Id of the injected <style> that governs the View Transition. */
const VT_STYLE_ID = 'ml-vt-style';
/** Wavefront duration — clip-path (WAAPI) and ring (GSAP) share it. */
const WAVE_S = 1.1;
/** Easing paired across engines: cubic-bezier(0.215,0.61,0.355,1) === power3.out. */
const WAVE_EASING = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
/** Orb-hatch particles emitted on the punch (§7.1). */
const SPARK_COUNT = 8;
/** Shorter wave for small / touch viewports (clip and ring stay in sync). */
const LITE_WAVE_S = 0.8;
/**
 * The ring is authored once per click at 1/RING_OVERSCALE of its final diameter
 * and then ONLY scaled (compositor). A transform also scales the border/glow, so
 * the authored size keeps their apparent thickness close to the old
 * width/borderWidth tween in the visible part of the wave.
 */
const RING_OVERSCALE = 3;
/** Visual diameter the ring is born at (as before). */
const RING_START_PX = 14;
/** Fixed authoring sizes (CSS) of the other FX layers — scaled, never resized. */
const BLOOM_PX = 256;
const PLASMA_PX = 512;
/** GSAP eases as cubic-béziers for WAAPI. */
const EASE_POWER2_OUT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_POWER2_IN = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';

@Component({
  standalone: true,
  selector: 'atmosphere-toggle',
  templateUrl: './atmosphere-toggle.component.html',
  styleUrl: './atmosphere-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtmosphereToggleComponent {
  public readonly variant = input<'icon' | 'compact'>('icon');

  private readonly atmosphere = inject(AtmosphereService);
  private readonly i18n = inject(I18nService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // Fix 4: warm the GSAP chunk in idle time so the first click doesn't stall
    // waiting on its download/parse before anything (not even the commit) starts.
    if (this.isBrowser) {
      const preload = () => void import('gsap').catch(() => {});
      if ('requestIdleCallback' in window) requestIdleCallback(preload);
      else setTimeout(preload, 2000);
    }
  }

  private readonly ring = viewChild.required<ElementRef<HTMLDivElement>>('ring');
  private readonly punch = viewChild.required<ElementRef<HTMLDivElement>>('punch');
  private readonly plasma = viewChild.required<ElementRef<HTMLDivElement>>('plasma');
  private readonly bloom = viewChild.required<ElementRef<HTMLDivElement>>('bloom');
  private readonly sparks = viewChild.required<ElementRef<HTMLDivElement>>('sparks');

  protected readonly atmos = this.atmosphere.atmos;
  protected readonly TEXT = computed(
    () => this.i18n.getConstant('appConst')?.ATMOSPHERE || ATMOSPHERE
  );
  // Nebula / Ember are proper names of the atmospheres, so they stay untranslated.
  protected readonly modeName = computed(() => this.TEXT().NAMES[this.atmos()]);
  protected readonly switchLabel = computed(
    () => `${this.TEXT().SWITCH_ARIA} ${this.modeName()}`
  );
  protected readonly titleText = computed(
    () => `${this.TEXT().LABEL}: ${this.modeName()}`
  );

  private busy = false;
  private overlaysRelocated = false;
  /** WAAPI animations of the current wave (compositor-driven transform/opacity). */
  private fx: Animation[] = [];

  protected async toggle(event: MouseEvent): Promise<void> {
    if (this.busy) return;

    const next: Atmos = this.atmos() === 'ember' ? 'nebula' : 'ember';

    // Capture the button synchronously: event.currentTarget is nulled out by
    // the browser once the handler yields at the first `await` below.
    const btn = event.currentTarget as HTMLElement | null;

    // No DOM → instant swap, no wavefront.
    if (!this.isBrowser || !btn) {
      this.atmosphere.commit(next);
      return;
    }

    // Lock BEFORE the awaited import: on the first-ever click the GSAP chunk may
    // still be downloading, and a rapid second click during that window would
    // slip past the guard above and start a concurrent transition.
    this.busy = true;

    let gsap: GsapApi;
    try {
      gsap = (await import('gsap')).gsap;
    } catch {
      this.busy = false;
      this.atmosphere.commit(next);
      return;
    }

    // MUST happen before startViewTransition: an element with a view-transition-name
    // (our header) lifts its whole subtree out of ::view-transition(root). If the
    // overlays stayed inside the header they'd animate in the header's group, not
    // ride the root reveal. Relocating them to <body> keeps them in the root snapshot.
    this.ensureOverlaysAtBody();
    const wf = this.wavefront(btn);

    // Preferred route: physical circular reveal via the View Transitions API.
    // Fallback: shockwave with a mid-wave token commit. Either way, a build
    // failure must still commit the theme and release the lock.
    try {
      if (this.supportsViewTransitions()) {
        this.revealTransition(gsap, btn, next, wf);
      } else {
        this.shockwave(gsap, btn, next, wf, () => (this.busy = false));
      }
    } catch {
      this.atmosphere.commit(next);
      this.busy = false;
    }
  }

  /**
   * Move the FX overlays out of the header (a named VT group) and onto <body>,
   * once. They keep their emulated-encapsulation attributes, so the scoped CSS
   * still matches from anywhere; being position:fixed, their on-screen spot is
   * unchanged. Angular no longer owns them under the host → remove on destroy.
   */
  private ensureOverlaysAtBody(): void {
    if (this.overlaysRelocated) return;
    this.overlaysRelocated = true;

    const nodes = [
      this.ring().nativeElement,
      this.punch().nativeElement,
      this.plasma().nativeElement,
      this.bloom().nativeElement,
      this.sparks().nativeElement,
    ];
    nodes.forEach((node) => this.document.body.appendChild(node));
    this.destroyRef.onDestroy(() => nodes.forEach((node) => node.remove()));
  }

  /** Center of the button + distance to the farthest viewport corner. */
  private wavefront(btn: HTMLElement): Wavefront {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxD = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(window.innerWidth - cx, cy),
      Math.hypot(cx, window.innerHeight - cy),
      Math.hypot(window.innerWidth - cx, window.innerHeight - cy)
    );
    return { cx, cy, maxD };
  }

  private supportsViewTransitions(): boolean {
    return (
      typeof (this.document as unknown as { startViewTransition?: unknown })
        .startViewTransition === 'function'
    );
  }

  /**
   * Preferred route. The old theme's pixels freeze on screen; the new theme is
   * revealed inside a circle that grows from the button — a physical wavefront,
   * not a global crossfade. The overlay FX (ring/bloom/flare) ride inside the
   * revealed area because they live at <body> level (see ensureOverlaysAtBody)
   * and so render live in ::view-transition-new(root), clipped by the reveal.
   */
  private revealTransition(
    gsap: GsapApi,
    btn: HTMLElement,
    next: Atmos,
    wf: Wavefront
  ): void {
    this.ensureVtStyle();

    const lite = this.isLite();
    const waveS = lite ? LITE_WAVE_S : WAVE_S;
    const ringDiameter = wf.maxD * 2 * 1.05 * 0.97; // hug the clip edge (clip ×1.05, ring ×0.97)
    const flash = () => {
      // The overlay is pure enhancement — never let it break the swap.
      try {
        this.runOverlayFX(gsap, btn, next, wf, ringDiameter, waveS, lite);
      } catch {
        /* noop */
      }
    };

    const html = this.document.documentElement;
    // Fix 2: the reveal IS the animation. Suppress the atmos elements' own 0.7s CSS
    // transitions during the VT so every pixel inside the circle shows the FINAL
    // theme — otherwise the wave edge shows a half-interpolated, washed-out color.
    html.classList.add('vt-live');

    const start = (
      this.document as unknown as { startViewTransition: StartViewTransition }
    ).startViewTransition;
    // The callback must be synchronous and minimal: commit, then force a sync render
    // (Fix 3) so signal-driven views reflect the new theme BEFORE the new snapshot
    // is captured — same trick Angular's withViewTransitions uses.
    const vt = start.call(this.document, () => {
      this.atmosphere.commit(next);
      this.appRef.tick();
    });

    vt.ready.then(
      () => {
        this.animateClip(wf, waveS);
        flash();
      },
      // Snapshot capture failed: theme already committed in the callback, still flash.
      () => flash()
    );

    vt.finished.finally(() => {
      html.classList.remove('vt-live');
      this.busy = false;
    });
  }

  /** Expanding clip-path over the NEW snapshot — this is what "reveals" the theme. */
  private animateClip(wf: Wavefront, waveS: number): void {
    try {
      this.document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${wf.cx}px ${wf.cy}px)`,
            `circle(${wf.maxD * 1.05}px at ${wf.cx}px ${wf.cy}px)`,
          ],
        },
        {
          duration: waveS * 1000,
          easing: WAVE_EASING,
          pseudoElement: '::view-transition-new(root)',
        }
      );
    } catch {
      // WAAPI/pseudo-element unsupported — the VT still swaps, just without the clip.
    }
  }

  /** Fallback route: no View Transitions, so the token snap is scheduled mid-wave. */
  private shockwave(
    gsap: GsapApi,
    btn: HTMLElement,
    next: Atmos,
    wf: Wavefront,
    done: () => void
  ): void {
    const lite = this.isLite();
    const waveS = lite ? LITE_WAVE_S : WAVE_S;
    const ringDiameter = wf.maxD * 2 * 1.08; // no clip to hug — just cover the screen
    const tl = this.runOverlayFX(gsap, btn, next, wf, ringDiameter, waveS, lite, done);
    // Commit at ~1/3 of the wave so the color snap reads as caused by the shockwave.
    tl.add(() => this.atmosphere.commit(next), 0.34);
  }

  /** Small or touch viewport → lighter FX (no plasma, no blend, shorter wave). */
  private isLite(): boolean {
    const win = this.document.defaultView;
    if (!win) return false;
    return isLiteViewport(win.innerWidth, !!win.matchMedia?.('(pointer: coarse)').matches);
  }

  /**
   * Ring + bloom explode from the button and the starfield flares. Shared by both
   * routes; the caller decides the ring's final diameter and (fallback only) when
   * to commit. Returns the timeline so callers can hang extra steps on it.
   *
   * Perf contract: every layer is authored ONCE per click (one style write) and
   * then only `transform`/`opacity` change, through WAAPI, so the compositor runs
   * the wave even while the main thread recalculates the new theme. GSAP keeps the
   * button punch, the sparks and the overall timing/cleanup.
   */
  private runOverlayFX(
    gsap: GsapApi,
    btn: HTMLElement,
    next: Atmos,
    wf: Wavefront,
    ringDiameter: number,
    waveS: number,
    lite: boolean,
    onComplete?: () => void
  ): GsapTimeline {
    const ring = this.ring().nativeElement;
    const punch = this.punch().nativeElement;
    const plasma = this.plasma().nativeElement;
    const bloom = this.bloom().nativeElement;
    const flare = this.document.querySelector<HTMLElement>('[data-star-flare]');
    const color = SHOCK_COLORS[next];
    const coverScale = (px: number) => (wf.maxD * 2 * 1.08) / px;
    const ringBase = ringDiameter / RING_OVERSCALE;
    const layers = lite ? [ring, punch, bloom] : [ring, punch, plasma, bloom];
    /** Seconds on the reference (desktop) wave → ms on this wave. */
    const ms = (s: number) => (s / WAVE_S) * waveS * 1000;

    this.cancelFx();
    gsap.set(layers, { display: 'block', left: wf.cx, top: wf.cy });
    gsap.set(ring, {
      width: ringBase,
      height: ringBase,
      marginLeft: -ringBase / 2,
      marginTop: -ringBase / 2,
      borderColor: color,
      boxShadow: `0 0 22px 3px ${color}, 0 0 9px 1px #fff`,
    });
    gsap.set(punch, { borderColor: color, boxShadow: `0 0 26px 5px ${color}, 0 0 12px 2px #fff` });
    gsap.set(bloom, {
      transform: `scale(${coverScale(BLOOM_PX)})`,
      background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
      // Desktop keeps ONE blended layer for <1s (bright UI stays bright under the
      // flash); lite composites it normally.
      mixBlendMode: lite ? 'normal' : 'screen',
    });
    if (!lite) {
      gsap.set(plasma, {
        background: `conic-gradient(from 0deg, transparent 0deg, ${color} 60deg, transparent 140deg, ${color} 220deg, transparent 300deg)`,
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        this.cancelFx();
        gsap.set(layers, { display: 'none' });
        this.sparks().nativeElement.replaceChildren(); // safety net if a tween was cut short
        onComplete?.();
      },
    });

    // 1. Button punch + orb hatch riding on it
    tl.to(btn, { scale: 0.8, duration: 0.12, ease: 'power2.in' }, 0)
      .to(btn, { scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.5)' }, 0.12);
    this.orbHatch(gsap, btn, next, tl);
    // Keep the timeline alive for the whole wave (cleanup runs after the WAAPI layers).
    tl.to({}, { duration: waveS }, 0);

    // 2. Main ring: born at 14px, scaled to the wavefront edge, fades late
    this.animate(
      ring,
      [{ transform: `scale(${RING_START_PX / ringBase})` }, { transform: `scale(${RING_OVERSCALE})` }],
      { duration: ms(WAVE_S), easing: WAVE_EASING }
    );
    this.animate(
      ring,
      [{ opacity: 1 }, { opacity: 1, offset: 0.62 / 1.04, easing: EASE_POWER2_IN }, { opacity: 0 }],
      { duration: ms(1.04) }
    );

    // 2b. Punch ring: the thick, bright birth of the wave that the scaled ring
    // can't show while tiny (its border scales down with it).
    this.animate(punch, [{ transform: 'scale(0.22)' }, { transform: 'scale(4.5)' }], {
      duration: ms(0.5),
      easing: WAVE_EASING,
    });
    this.animate(punch, [{ opacity: 1, easing: EASE_POWER2_IN }, { opacity: 0 }], { duration: ms(0.5) });

    // 3. Bloom flash (small gradient texture scaled up: a smooth gradient
    // upscales invisibly, and the old blur(8px) on it was imperceptible)
    const bloomPeak = lite ? 0.4 : 0.55;
    this.animate(
      bloom,
      [
        { opacity: 0, easing: EASE_POWER2_OUT },
        { opacity: bloomPeak, offset: 0.18 / 0.95 },
        { opacity: bloomPeak, offset: 0.2 / 0.95, easing: EASE_POWER2_IN },
        { opacity: 0 },
      ],
      { duration: ms(0.95), delay: ms(0.02) }
    );

    // 3b. Plasma trail: faint conic texture that spins across the wave (§7.6).
    // Desktop only; normal compositing (at 8% over a dark void, screen ≈ normal).
    if (!lite) {
      const s = coverScale(PLASMA_PX);
      this.animate(
        plasma,
        [{ transform: `scale(${s}) rotate(0deg)` }, { transform: `scale(${s}) rotate(90deg)` }],
        { duration: ms(WAVE_S), easing: 'linear' }
      );
      this.animate(
        plasma,
        [
          { opacity: 0 },
          { opacity: 0, offset: 0.04 / 1.1, easing: EASE_POWER2_OUT },
          { opacity: 0.08, offset: 0.26 / 1.1 },
          { opacity: 0.08, offset: 0.6 / 1.1, easing: EASE_POWER2_IN },
          { opacity: 0 },
        ],
        { duration: ms(1.1) }
      );
    }

    // 4. Starfield flare: opacity of a pre-rastered halo layer owned by the
    // cosmic background (replaces tweening --star-boost on <html>).
    this.animate(
      flare,
      [
        { opacity: 0 },
        { opacity: 0, offset: 0.12 / 1.1, easing: EASE_POWER2_OUT },
        { opacity: 1, offset: 0.5 / 1.1, easing: EASE_POWER2_IN },
        { opacity: 0 },
      ],
      { duration: ms(1.1) }
    );

    return tl;
  }

  /** WAAPI with a no-op fallback (old engines / jsdom): the FX is enhancement only. */
  private animate(el: Element | null, keyframes: Keyframe[], options: KeyframeAnimationOptions): void {
    if (!el || typeof el.animate !== 'function') return;
    try {
      this.fx.push(el.animate(keyframes, options));
    } catch {
      /* noop */
    }
  }

  private cancelFx(): void {
    this.fx.forEach((a) => a.cancel());
    this.fx = [];
  }

  /**
   * §7.1 — Orb eclosion. On the punch, fling SPARK_COUNT tiny motes out of the
   * orb in the destination color. Nodes are created inline-styled (encapsulation
   * can't reach runtime nodes), animated on the shared timeline, and each removes
   * itself when its tween ends. Cost: zero outside the click.
   */
  private orbHatch(
    gsap: GsapApi,
    btn: HTMLElement,
    next: Atmos,
    tl: GsapTimeline
  ): void {
    const orb = (btn.querySelector('.atmos-orb') as HTMLElement | null) ?? btn;
    const rect = orb.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const color = SHOCK_COLORS[next];
    const host = this.sparks().nativeElement;

    for (let i = 0; i < SPARK_COUNT; i++) {
      const size = 3 + Math.random(); // 3–4px
      const spark = this.document.createElement('span');
      Object.assign(spark.style, {
        position: 'fixed',
        left: `${cx}px`,
        top: `${cy}px`,
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: `${-size / 2}px`,
        marginTop: `${-size / 2}px`,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px 1px ${color}`,
      });
      host.appendChild(spark);

      const angle = (i / SPARK_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const dist = 18 + Math.random() * 12; // 18–30px
      tl.to(
        spark,
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          opacity: 0,
          duration: 0.5 + Math.random() * 0.2,
          ease: 'power2.out',
          onComplete: () => spark.remove(),
        },
        0.12 // fire with the punch
      );
    }
  }

  /**
   * Inject (once) the stylesheet that governs the View Transition: kill the
   * browser's default 0.25s root crossfade so our clip-path owns the reveal.
   *
   * NOTE: we deliberately DON'T give the header a view-transition-name. Doing so
   * lifts the whole header (logo, nav, toggle, CTA) out of the root snapshot into
   * its own group with its own crossfade — so it would NOT ride the wave (it'd
   * change color on a 0.4s fade desynced from the ring born under it). Only
   * re-introduce it if a real backdrop-filter flicker appears, and then match the
   * group's duration to the wave (1.1s), not 0.4s.
   */
  private ensureVtStyle(): void {
    const doc = this.document;
    if (doc.getElementById(VT_STYLE_ID)) return;

    const style = doc.createElement('style');
    style.id = VT_STYLE_ID;
    style.textContent = `
      ::view-transition-old(root),
      ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
    `;
    doc.head.appendChild(style);
  }
}
