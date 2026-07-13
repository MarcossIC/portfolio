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
import { ReducedMotionService } from '@app/services/ReducedMotion.service';

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
  private readonly reducedMotion = inject(ReducedMotionService);
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
  private readonly plasma = viewChild.required<ElementRef<HTMLDivElement>>('plasma');
  private readonly bloom = viewChild.required<ElementRef<HTMLDivElement>>('bloom');
  private readonly sparks = viewChild.required<ElementRef<HTMLDivElement>>('sparks');

  protected readonly atmos = this.atmosphere.atmos;
  protected readonly modeName = computed(() =>
    this.atmos() === 'ember' ? 'Ember' : 'Nebula'
  );

  private busy = false;
  private overlaysRelocated = false;

  protected async toggle(event: MouseEvent): Promise<void> {
    if (this.busy) return;

    const next: Atmos = this.atmos() === 'ember' ? 'nebula' : 'ember';

    // Capture the button synchronously: event.currentTarget is nulled out by
    // the browser once the handler yields at the first `await` below.
    const btn = event.currentTarget as HTMLElement | null;

    // Reduced-motion (or no DOM) → instant swap, no wavefront. This guard is the
    // accessibility net: a full-viewport wave is the textbook vestibular trigger.
    if (!this.isBrowser || !btn || this.reducedMotion.prefersReducedMotion()) {
      this.atmosphere.commit(next);
      return;
    }

    let gsap: GsapApi;
    try {
      gsap = (await import('gsap')).gsap;
    } catch {
      this.atmosphere.commit(next);
      return;
    }

    this.busy = true;
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

    const ringDiameter = wf.maxD * 2 * 1.05 * 0.97; // hug the clip edge (clip ×1.05, ring ×0.97)
    const flash = () => {
      // The overlay is pure enhancement — never let it break the swap.
      try {
        this.runOverlayFX(gsap, btn, next, wf, ringDiameter);
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
        this.animateClip(wf);
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
  private animateClip(wf: Wavefront): void {
    try {
      this.document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${wf.cx}px ${wf.cy}px)`,
            `circle(${wf.maxD * 1.05}px at ${wf.cx}px ${wf.cy}px)`,
          ],
        },
        {
          duration: WAVE_S * 1000,
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
    const ringDiameter = wf.maxD * 2 * 1.08; // no clip to hug — just cover the screen
    const tl = this.runOverlayFX(gsap, btn, next, wf, ringDiameter, done);
    // Commit at ~1/3 of the wave so the color snap reads as caused by the shockwave.
    tl.add(() => this.atmosphere.commit(next), 0.34);
  }

  /**
   * Ring + bloom explode from the button and the starfield flares. Shared by both
   * routes; the caller decides the ring's final diameter and (fallback only) when
   * to commit. Returns the timeline so callers can hang extra steps on it.
   */
  private runOverlayFX(
    gsap: GsapApi,
    btn: HTMLElement,
    next: Atmos,
    wf: Wavefront,
    ringDiameter: number,
    onComplete?: () => void
  ): GsapTimeline {
    const ring = this.ring().nativeElement;
    const plasma = this.plasma().nativeElement;
    const bloom = this.bloom().nativeElement;
    const html = this.document.documentElement;
    const color = SHOCK_COLORS[next];
    const bloomSize = wf.maxD * 2 * 1.08;

    gsap.set([ring, plasma, bloom], {
      display: 'block',
      left: wf.cx,
      top: wf.cy,
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(ring, {
      width: 14,
      height: 14,
      opacity: 1,
      borderWidth: 5,
      borderColor: color,
      boxShadow: `0 0 70px 10px ${color}, 0 0 30px 4px #fff`,
    });
    gsap.set(plasma, {
      width: bloomSize,
      height: bloomSize,
      opacity: 0,
      rotation: 0,
      background: `conic-gradient(from 0deg, transparent 0deg, ${color} 60deg, transparent 140deg, ${color} 220deg, transparent 300deg)`,
    });
    gsap.set(bloom, {
      width: bloomSize,
      height: bloomSize,
      opacity: 0,
      background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([ring, plasma, bloom], { display: 'none' });
        this.sparks().nativeElement.replaceChildren(); // safety net if a tween was cut short
        onComplete?.();
      },
    });

    // 1. Button punch + orb hatch riding on it
    tl.to(btn, { scale: 0.8, duration: 0.12, ease: 'power2.in' }, 0)
      .to(btn, { scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.5)' }, 0.12);
    this.orbHatch(gsap, btn, next, tl);

    // 2. Bloom flash
    tl.to(bloom, { opacity: 0.55, duration: 0.18, ease: 'power2.out' }, 0.02)
      .to(bloom, { opacity: 0, duration: 0.75, ease: 'power2.in' }, 0.22);

    // 2b. Plasma trail: faint conic texture that spins across the wave (§7.6)
    tl.to(plasma, { opacity: 0.08, duration: 0.22, ease: 'power2.out' }, 0.04)
      .to(plasma, { rotation: 90, duration: WAVE_S, ease: 'none' }, 0)
      .to(plasma, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.6);

    // 3. Ring: explodes to the wavefront edge, thins out and fades
    tl.to(
      ring,
      { width: ringDiameter, height: ringDiameter, borderWidth: 1, duration: WAVE_S, ease: 'power3.out' },
      0
    ).to(ring, { opacity: 0, duration: 0.42, ease: 'power2.in' }, 0.62);

    // 4. Starfield flare (pulses the CSS var read by cosmic-background)
    tl.fromTo(
      html,
      { '--star-boost': 1 },
      { '--star-boost': 2.1, duration: 0.42, ease: 'power2.out' },
      0.12
    ).to(html, { '--star-boost': 1, duration: 0.6, ease: 'power2.in' }, 0.5);

    return tl;
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
