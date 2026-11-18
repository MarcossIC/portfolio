import {
  approach,
  createQualityGovernor,
  createVsyncEstimator,
  frameDelta,
  framingFor,
  glslFloat,
  ignition,
  isFrameDue,
  loopMayStart,
  isShortLandscape,
  needsResize,
  scrollProgress,
  settleWithin,
  smoothstep,
  zoomOutFor,
  vsyncProbeWanted,
  type QualityConfig,
  type QualityGovernor,
} from './galaxy-scene';
import { FRAMING, MOTION, QUALITY } from './galaxy-scene.config';

const MAX_ZOOM_OUT = FRAMING.maxZoomOut;

// The scene itself needs a WebGL context (jsdom has none), so what is unit-tested
// here are the pure decisions the render loop and the observers delegate to.

describe('zoomOutFor (camera framing by aspect)', () => {
  it('keeps the original framing on landscape screens', () => {
    expect(zoomOutFor(16 / 9)).toBe(1);
    expect(zoomOutFor(4 / 3)).toBe(1);
  });

  // FOV is vertical: a narrow viewport crops the spiral down to its core.
  it('backs the camera off on portrait screens', () => {
    expect(zoomOutFor(0.75)).toBeGreaterThan(1);
    expect(zoomOutFor(0.5)).toBeGreaterThan(zoomOutFor(0.75));
  });

  it('caps the zoom-out so the galaxy never shrinks to a dot', () => {
    expect(zoomOutFor(0.2)).toBe(MAX_ZOOM_OUT);
  });
});

// Portrait gets its own framing (closer camera, image lifted, dimmer) blended in
// by aspect; landscape and desktop must keep exactly the framing they had.
describe('framingFor', () => {
  const P = FRAMING.portrait;

  it('keeps the landscape framing untouched', () => {
    for (const aspect of [FRAMING.minAspect, 1.41, 16 / 9, 2.4]) {
      expect(framingFor(aspect)).toEqual({
        zoom: zoomOutFor(aspect),
        magnify: 1,
        lift: 0,
        shift: 0,
        brightness: 1,
        tilt: 0,
      });
    }
  });

  // Landscape phones: the hero is taller than the viewport, so the canvas sits just under minAspect.
  it('barely moves just under the landscape threshold', () => {
    const f = framingFor(1.07);
    expect(Math.abs(f.zoom - zoomOutFor(1.07))).toBeLessThan(0.01);
    expect(f.lift).toBeLessThan(0.01);
    expect(f.magnify).toBeLessThan(1.01);
    expect(f.brightness).toBeGreaterThan(0.99);
    expect(Math.abs(f.tilt)).toBeLessThan(0.01);
  });

  it('applies the full portrait framing on phones', () => {
    for (const aspect of [P.aspect, 768 / 1024, 0.44, 0.3]) {
      expect(framingFor(aspect)).toEqual({
        zoom: P.zoom,
        magnify: P.magnify,
        lift: P.lift,
        shift: 0,
        brightness: P.brightness,
        tilt: P.tilt,
      });
    }
  });

  // Tablets sit in between: no hard breakpoint, no jump while resizing.
  it('blends continuously and monotonically in between', () => {
    let prev = framingFor(FRAMING.minAspect);
    for (let aspect = FRAMING.minAspect; aspect >= P.aspect; aspect -= 0.005) {
      const f = framingFor(aspect);
      expect(f.lift).toBeGreaterThanOrEqual(prev.lift);
      expect(Math.abs(f.zoom - prev.zoom)).toBeLessThan(0.03);
      expect(Math.abs(f.lift - prev.lift)).toBeLessThan(0.01);
      expect(f.magnify).toBeGreaterThanOrEqual(prev.magnify);
      expect(Math.abs(f.tilt - prev.tilt)).toBeLessThan(0.02);
      prev = f;
    }
    const squarish = framingFor(0.9);
    expect(squarish.lift).toBeGreaterThan(0);
    expect(squarish.lift).toBeLessThan(P.lift);
  });

  it('brings the camera closer than the old zoom-out on phones (bigger galaxy)', () => {
    expect(framingFor(0.44).zoom).toBeLessThan(zoomOutFor(0.44));
  });
});

// Landscape phones: the hero copy is centered and the viewport is short, so the
// default framing parks the bright core right on the name and role text.
describe('isShortLandscape', () => {
  const max = FRAMING.shortLandscape.maxHeightPx;

  it('matches landscape phones', () => {
    expect(isShortLandscape({ w: 844, h: 390 })).toBe(true);
    expect(isShortLandscape({ w: 932, h: 430 })).toBe(true);
    expect(isShortLandscape({ w: 667, h: 375 })).toBe(true);
  });

  // Same breakpoint as the hero CSS: `(orientation: landscape) and (max-height: 500px)`.
  it('uses the hero CSS breakpoint, inclusive', () => {
    expect(isShortLandscape({ w: 900, h: max })).toBe(true);
    expect(isShortLandscape({ w: 900, h: max + 1 })).toBe(false);
  });

  it('leaves desktops, tablets and portrait phones alone', () => {
    expect(isShortLandscape({ w: 1440, h: 900 })).toBe(false);
    expect(isShortLandscape({ w: 1280, h: 720 })).toBe(false);
    expect(isShortLandscape({ w: 1024, h: 768 })).toBe(false);
    expect(isShortLandscape({ w: 390, h: 844 })).toBe(false);
    expect(isShortLandscape({ w: 360, h: 740 })).toBe(false);
    // CSS calls a square viewport portrait (height >= width), so does this.
    expect(isShortLandscape({ w: 400, h: 400 })).toBe(false);
  });
});

describe('framingFor (viewport-aware)', () => {
  const L = FRAMING.shortLandscape;
  const P = FRAMING.portrait;

  it('keeps desktop framing bit-identical when given a desktop viewport', () => {
    for (const [w, h] of [[1440, 900], [1280, 800], [1920, 1080], [1280, 720]]) {
      expect(framingFor(w / h, { w, h })).toEqual(framingFor(w / h));
    }
  });

  it('keeps portrait phones bit-identical when given their viewport', () => {
    for (const [w, h] of [[390, 844], [360, 740], [768, 1024]]) {
      expect(framingFor(w / h, { w, h })).toEqual(framingFor(w / h));
    }
  });

  it('shifts the core sideways and dims it on landscape phones', () => {
    const f = framingFor(844 / 390, { w: 844, h: 390 });
    expect(f.shift).toBe(L.shift);
    expect(f.shift).toBeGreaterThan(0);
    expect(f.brightness).toBe(L.brightness);
    expect(f.brightness).toBeLessThan(1);
    expect(f.magnify).toBe(L.magnify);
    expect(f.lift).toBe(L.lift);
    expect(f.zoom).toBe(zoomOutFor(844 / 390));
    // The steeper portrait view is a portrait-only knob: the side framing keeps the desktop disc.
    expect(f.tilt).toBe(0);
  });

  // The hero's height (and so the canvas aspect) depends on how much copy fits:
  // detection is by viewport, so a tall canvas on a short screen still gets it.
  it('detects landscape phones by viewport, whatever the canvas aspect', () => {
    for (const aspect of [2.2, 1.6, 1.07, 0.9]) {
      const f = framingFor(aspect, { w: 844, h: 390 });
      expect(f.shift).toBe(L.shift);
      expect(f.brightness).toBe(L.brightness);
      expect(f.lift).toBe(L.lift);
    }
  });

  it('never applies the portrait lift on a landscape phone', () => {
    expect(framingFor(0.9, { w: 844, h: 390 }).lift).toBe(L.lift);
    expect(L.lift).toBeLessThan(P.lift);
  });
});

describe('frameDelta', () => {
  it('converts the elapsed milliseconds to seconds', () => {
    expect(frameDelta(1016, 1000)).toBeCloseTo(0.016);
  });

  // rAF hands over the frame *start* time, which can precede the performance.now()
  // taken when the loop was (re)started.
  it('never goes negative', () => {
    expect(frameDelta(995, 1000)).toBe(0);
  });

  // A long pause (tab switch, debugger) must not teleport the animation.
  it('clamps long gaps to 50ms', () => {
    expect(frameDelta(5000, 1000)).toBe(0.05);
  });
});

describe('isFrameDue (vsync parity)', () => {
  // Full rate: no vsync is ever skipped, whatever the display refresh rate is.
  it('draws every vsync at full rate', () => {
    for (let i = 0; i < 20; i++) expect(isFrameDue(i, false)).toBe(true);
  });

  // The half-rate fallback is decided by counting vsyncs, not by a ms threshold:
  // every 2nd one, on 60, 144 and 165Hz alike, so the cadence never drifts.
  it('draws exactly every 2nd vsync at half rate', () => {
    const drawn: boolean[] = [];
    for (let i = 0; i < 8; i++) drawn.push(isFrameDue(i, true));
    expect(drawn).toEqual([true, false, true, false, true, false, true, false]);
  });
});

describe('needsResize', () => {
  const slack = 160;

  it('sizes the buffer the first time', () => {
    expect(needsResize({ w: 0, h: 0 }, { w: 390, h: 760 }, slack)).toBe(true);
  });

  it('resizes whenever the width changes', () => {
    expect(needsResize({ w: 390, h: 760 }, { w: 844, h: 760 }, slack)).toBe(true);
  });

  it('grows the buffer when the height grows', () => {
    expect(needsResize({ w: 390, h: 700 }, { w: 390, h: 760 }, slack)).toBe(true);
  });

  // Mobile URL bar showing back up mid-scroll: `dvh` shrinks, the canvas just
  // overflows and gets clipped instead of reallocating and reframing.
  it('ignores a height-only shrink within the slack', () => {
    expect(needsResize({ w: 390, h: 760 }, { w: 390, h: 700 }, slack)).toBe(false);
  });

  it('resizes when the height shrinks past the slack', () => {
    expect(needsResize({ w: 390, h: 760 }, { w: 390, h: 500 }, slack)).toBe(true);
  });

  it('tracks the exact height when there is no slack (desktop)', () => {
    expect(needsResize({ w: 1440, h: 900 }, { w: 1440, h: 899 }, 0)).toBe(true);
    expect(needsResize({ w: 1440, h: 900 }, { w: 1440, h: 900 }, 0)).toBe(false);
  });
});

// Shader constants are injected as #defines. GLSL has no implicit int → float
// conversion, so a bare `27` inside a float expression fails to compile.
describe('glslFloat', () => {
  it('adds a decimal point to integers', () => {
    expect(glslFloat(27)).toBe('27.0');
    expect(glslFloat(0)).toBe('0.0');
    expect(glslFloat(-3)).toBe('-3.0');
  });

  it('keeps fractional values as they are', () => {
    expect(glslFloat(0.35)).toBe('0.35');
    expect(glslFloat(-0.18)).toBe('-0.18');
  });
});

// Palette blend toward the atmosphere target. It must land exactly on the target,
// otherwise the per-frame tint of the glow sprites could never be skipped.
describe('approach', () => {
  it('moves part of the way toward the target, scaled by dt', () => {
    expect(approach(0, 1, 5, 0.016, 0.001)).toBeCloseTo(0.08);
  });

  it('never overshoots on a long frame', () => {
    expect(approach(0, 1, 5, 1, 0.001)).toBe(1);
  });

  it('snaps onto the target once within the epsilon', () => {
    expect(approach(0.9995, 1, 5, 0.016, 0.001)).toBe(1);
    expect(approach(0.0004, 0, 5, 0.016, 0.001)).toBe(0);
  });

  it('stays put when already on the target', () => {
    expect(approach(1, 1, 5, 0.016, 0.001)).toBe(1);
  });
});

describe('smoothstep', () => {
  it('lands exactly on 0 and 1 and passes through the middle', () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBe(0.5);
  });

  it('clamps outside [0, 1]', () => {
    expect(smoothstep(-2)).toBe(0);
    expect(smoothstep(3)).toBe(1);
  });

  // Flat at both ends: the scroll depth starts and settles without a kink.
  it('eases in and out, monotonically', () => {
    expect(smoothstep(0.1)).toBeLessThan(0.1);
    expect(smoothstep(0.9)).toBeGreaterThan(0.9);
    let prev = 0;
    for (let x = 0; x <= 1; x += 0.05) {
      expect(smoothstep(x)).toBeGreaterThanOrEqual(prev);
      prev = smoothstep(x);
    }
  });
});

// How far the hero has been scrolled away, over MOTION.fadeDistance viewport heights.
describe('scrollProgress', () => {
  const vh = 800;
  const fadePx = vh * MOTION.fadeDistance;

  it('is 0 at the top and 1 once the fade distance is scrolled', () => {
    expect(scrollProgress(0, vh)).toBe(0);
    expect(scrollProgress(fadePx, vh)).toBe(1);
    expect(scrollProgress(fadePx * 3, vh)).toBe(1);
  });

  it('is linear in between', () => {
    expect(scrollProgress(fadePx * 0.3, vh)).toBeCloseTo(0.3);
  });

  // iOS rubber-band overscroll reports a negative scrollY at the top.
  it('never goes negative', () => {
    expect(scrollProgress(-60, vh)).toBe(0);
  });

  it('survives a zero-height viewport', () => {
    expect(Number.isFinite(scrollProgress(10, 0))).toBe(true);
  });
});

// The core's brief flare when the galaxy first appears.
describe('ignition', () => {
  const d = 0.6;

  it('is 0 before it starts and once it is over', () => {
    expect(ignition(-0.1, d)).toBe(0);
    expect(ignition(0, d)).toBe(0);
    expect(ignition(d, d)).toBe(0);
    expect(ignition(5, d)).toBe(0);
  });

  it('peaks at 1 inside the window', () => {
    let peak = 0;
    for (let t = 0; t <= d; t += d / 200) peak = Math.max(peak, ignition(t, d));
    expect(peak).toBeCloseTo(1, 2);
  });

  // A flare: fast attack, slower release.
  it('rises faster than it decays', () => {
    let peakAt = 0;
    let peak = 0;
    for (let t = 0; t <= d; t += d / 200) {
      if (ignition(t, d) > peak) {
        peak = ignition(t, d);
        peakAt = t;
      }
    }
    expect(peakAt).toBeLessThan(d / 2);
  });

  it('stays within [0, 1]', () => {
    for (let t = 0; t <= d; t += d / 50) {
      expect(ignition(t, d)).toBeGreaterThanOrEqual(0);
      expect(ignition(t, d)).toBeLessThanOrEqual(1);
    }
  });
});

// Shader precompile gate: the loop starts when shaders are ready, or after the
// timeout at the latest, and a rejected compile never blocks the galaxy.
describe('settleWithin', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves as soon as the work resolves', async () => {
    let done = false;
    void settleWithin(Promise.resolve('x'), 1000).then(() => (done = true));
    await vi.advanceTimersByTimeAsync(0);
    expect(done).toBe(true);
  });

  it('resolves at the timeout when the work never settles', async () => {
    let done = false;
    void settleWithin(new Promise(() => {}), 1000).then(() => (done = true));
    await vi.advanceTimersByTimeAsync(999);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toBe(true);
  });

  it('resolves (never rejects) when the work rejects', async () => {
    await expect(settleWithin(Promise.reject(new Error('boom')), 1000)).resolves.toBeUndefined();
  });
});

// ---- Adaptive resolution governor ----
// Small windows so each scenario reads in a handful of frames. The real values
// live in QUALITY (galaxy-scene.config.ts).
const Q: QualityConfig = {
  step: 0.85,
  lateVsyncs: 1.5,
  stallMs: 250,
  vsyncMinMs: 2,
  vsyncMaxMs: 20,
  vsyncWindow: 16,
  vsyncMinSamples: 4,
  vsyncEvery: 2,
  vsyncPercentile: 0.1,
  vsyncTolerance: 0.1,
  vsyncRiseEvals: 4,
  windowFrames: 10,
  warmupFrames: 5,
  settleFrames: 2,
  overShare: 0.2,
  calmShare: 0.1,
  downWindows: 2,
  upWindows: 3,
  probeBackoff: { initial: 4, max: 16 },
  minGain: 0.1,
  maxIneffectiveSteps: 2,
  hold: { initial: 6, max: 48 },
};

const FAST = 1000 / 60;
const SLOW = 2000 / 60; // a dropped vsync on a 60Hz screen

/** Feeds `n` frames, each from `ms` (a fixed gap, or a model of the GPU at the current ratio). */
function feed(gov: QualityGovernor, n: number, ms: number | ((ratio: number) => number)): number {
  let changes = 0;
  for (let i = 0; i < n; i++) {
    gov.observeVsync(FAST); // the display is a 60Hz one unless a test says otherwise
    if (gov.sample(typeof ms === 'number' ? ms : ms(gov.ratio))) changes++;
  }
  return changes;
}

/** Frames a fresh (or resumed) governor needs before its first decision can fire. */
const FIRST_DECISION = Q.warmupFrames + Q.downWindows * Q.windowFrames;

describe('createQualityGovernor', () => {
  it('starts at the device cap', () => {
    expect(createQualityGovernor(2, 1, Q).ratio).toBe(2);
  });

  it('never starts above the cap when the floor is higher (1x screens)', () => {
    expect(createQualityGovernor(1, 1.2, Q).ratio).toBe(1);
  });

  // Shader compile, the first texture upload and the tab-switch catch-up all land here.
  it('ignores slow frames during the warm-up', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, Q.warmupFrames, 500 / 3);
    feed(gov, Q.downWindows * Q.windowFrames, FAST);
    expect(gov.ratio).toBe(2);
  });

  it('steps down one notch when frames stay over budget', () => {
    const gov = createQualityGovernor(2, 1, Q);
    expect(feed(gov, FIRST_DECISION - 1, SLOW)).toBe(0);
    expect(gov.sample(SLOW)).toBe(true);
    expect(gov.ratio).toBeCloseTo(2 * Q.step);
  });

  // A GC pause or a long task elsewhere in the page: a blip, not a trend.
  it('does not react to an isolated slow frame per window', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, Q.warmupFrames, FAST);
    for (let w = 0; w < 6; w++) {
      feed(gov, 1, 45);
      feed(gov, Q.windowFrames - 1, FAST);
    }
    expect(gov.ratio).toBe(2);
  });

  // Breakpoints, a frozen tab, a 300ms layout: not GPU load.
  it('drops stalls longer than stallMs entirely', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, Q.warmupFrames, FAST);
    feed(gov, 4 * Q.windowFrames, 400);
    expect(gov.ratio).toBe(2);
  });

  it('ignores zero or negative gaps (restart stamp taken after the rAF time)', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, Q.warmupFrames, FAST);
    feed(gov, 4 * Q.windowFrames, -3);
    expect(gov.ratio).toBe(2);
  });

  // Each setPixelRatio reallocates the drawing buffer.
  it('rate-limits changes: settle frames plus fresh windows between steps', () => {
    const gov = createQualityGovernor(2, 0.5, Q);
    feed(gov, FIRST_DECISION, SLOW);
    expect(gov.ratio).toBeCloseTo(1.7);
    const between = Q.settleFrames + Q.downWindows * Q.windowFrames;
    expect(feed(gov, between - 1, SLOW)).toBe(0);
  });

  it('keeps stepping while it helps and stops once the budget is met', () => {
    // Fill-bound GPU: 60fps only at or below 1.5x.
    const gpu = (r: number) => (r > 1.5 ? SLOW : FAST);
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, 200, gpu);
    expect(gov.ratio).toBeCloseTo(2 * Q.step * Q.step); // 1.445
  });

  it('never goes below the floor', () => {
    const gov = createQualityGovernor(2, 1.5, Q);
    feed(gov, 2000, (r) => (r > 1.6 ? SLOW : 30 - r));
    expect(gov.ratio).toBeGreaterThanOrEqual(1.5);
  });

  it('steps back up after a sustained calm stretch, never above the cap', () => {
    let heavy = true;
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, FIRST_DECISION, () => (heavy ? SLOW : FAST));
    expect(gov.ratio).toBeCloseTo(1.7);
    heavy = false;
    feed(gov, 500, FAST);
    expect(gov.ratio).toBe(2);
  });

  it('waits longer after each failed probe up (backoff)', () => {
    // 60fps only at or below 1.7x: probing 2x always fails.
    const gpu = (r: number) => (r > 1.8 ? SLOW : FAST);
    const gov = createQualityGovernor(2, 1, Q);
    const frames = 600;
    const ratios: number[] = [];
    for (let i = 0; i < frames; i++) {
      gov.observeVsync(FAST);
      if (gov.sample(gpu(gov.ratio))) ratios.push(gov.ratio);
    }
    expect(ratios[0]).toBeCloseTo(1.7);
    const probes = ratios.filter((r) => r === 2).length;
    // Without a backoff a probe would come back every settle + upWindows windows.
    const naiveProbes = Math.floor(frames / (Q.settleFrames + (Q.upWindows + 1) * Q.windowFrames));
    expect(probes).toBeGreaterThan(0);
    expect(probes).toBeLessThan(naiveProbes / 2);
    expect(gov.ratio).toBeCloseTo(1.7);
  });

  // iOS Low Power Mode, Chrome's Energy Saver or a CPU-bound page: the cadence
  // is 30fps whatever the resolution. Dropping pixels would only blur the stars.
  it('gives up and restores the resolution when stepping down does not help', () => {
    const gov = createQualityGovernor(2, 1, Q);
    const steps = Q.maxIneffectiveSteps + 1;
    feed(gov, Q.warmupFrames + steps * (Q.settleFrames + Q.downWindows * Q.windowFrames), SLOW);
    expect(gov.ratio).toBe(2);
  });

  it('holds off after giving up, longer each time', () => {
    const gov = createQualityGovernor(2, 1, Q);
    const changes = feed(gov, 2000, SLOW);
    // Without a growing hold it would pump every ~80 frames (~75 changes).
    expect(changes).toBeLessThan(25);
  });

  it('rewarm() ignores the next frames (resume after off-screen / hidden tab)', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, FIRST_DECISION - 1, SLOW);
    gov.rewarm();
    feed(gov, Q.warmupFrames, SLOW);
    expect(gov.ratio).toBe(2);
  });

  it('setCap() jumps to the new cap (window moved to another monitor)', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feed(gov, FIRST_DECISION, SLOW);
    expect(gov.ratio).toBeCloseTo(1.7);
    gov.setCap(1);
    expect(gov.ratio).toBe(1);
    gov.setCap(1.5);
    expect(gov.ratio).toBe(1.5);
  });
});

// ---- Vsync estimate ----

const vsyncOf = (hz: number) => 1000 / hz;

/** A small deterministic jitter (+-0.15ms) so streams are not perfectly flat. */
const jitter = (i: number) => ((i * 7) % 5) * 0.075 - 0.15;

function observeStream(est: ReturnType<typeof createVsyncEstimator>, hz: number, n: number, start = 0): void {
  for (let i = start; i < start + n; i++) est.observe(vsyncOf(hz) + jitter(i));
}

describe('createVsyncEstimator', () => {
  it('has no estimate until it has seen enough gaps', () => {
    const est = createVsyncEstimator(Q);
    expect(est.ms).toBe(0);
    expect(est.ready).toBe(false);
    observeStream(est, 60, Q.vsyncMinSamples - 1);
    expect(est.ready).toBe(false);
    observeStream(est, 60, 2, 10);
    expect(est.ready).toBe(true);
  });

  it.each([60, 120, 144, 165])('measures a %iHz display', (hz) => {
    const est = createVsyncEstimator(Q);
    observeStream(est, hz, 40);
    expect(est.ms).toBeCloseTo(vsyncOf(hz), 0);
  });

  // A late frame is a 2-vsync gap: it must not make the vsync look longer.
  it('is not inflated by late frames (a minority of 2-vsync gaps)', () => {
    const est = createVsyncEstimator(Q);
    for (let i = 0; i < 80; i++) est.observe(i % 4 === 3 ? 2 * vsyncOf(165) : vsyncOf(165));
    expect(est.ms).toBeCloseTo(vsyncOf(165), 0);
  });

  it('ignores stalls, non-positive gaps and sub-millisecond catch-up gaps', () => {
    const est = createVsyncEstimator(Q);
    observeStream(est, 144, 40);
    const before = est.ms;
    for (let i = 0; i < 40; i++) {
      est.observe(400); // tab switch
      est.observe(-3); // restart stamp
      est.observe(0.4); // two callbacks in the same frame
      est.observe(NaN);
    }
    expect(est.ms).toBe(before);
  });

  it('never claims a vsync longer than vsyncMaxMs (a GPU stuck at 2 vsyncs on 60Hz)', () => {
    const est = createVsyncEstimator(Q);
    for (let i = 0; i < 100; i++) est.observe(2 * vsyncOf(60));
    expect(est.ms).toBeLessThanOrEqual(Q.vsyncMaxMs);
  });

  it('adapts down at once when the display is faster (60Hz monitor -> 165Hz one)', () => {
    const est = createVsyncEstimator(Q);
    observeStream(est, 60, 40);
    observeStream(est, 165, 2 * Q.vsyncWindow, 40);
    expect(est.ms).toBeCloseTo(vsyncOf(165), 0);
  });

  // Rising needs persistence: a stretch of slow frames (GPU load) must not retune it.
  it('does not move up for a short slow stretch, but does when the pattern persists', () => {
    const est = createVsyncEstimator(Q);
    observeStream(est, 165, 40);
    observeStream(est, 60, Q.vsyncWindow, 40);
    expect(est.ms).toBeCloseTo(vsyncOf(165), 0);
    observeStream(est, 60, 20 * Q.vsyncWindow, 80); // 165Hz -> 60Hz monitor, no dpr change
    expect(est.ms).toBeCloseTo(vsyncOf(60), 0);
  });

  it('reset() forgets everything', () => {
    const est = createVsyncEstimator(Q);
    observeStream(est, 144, 40);
    est.reset();
    expect(est.ms).toBe(0);
    expect(est.ready).toBe(false);
  });
});

// ---- Governor: lateness measured in vsyncs ----

/** Feeds `n` rendered frames whose gap is `gapVsyncs` vsyncs of a `hz` display. */
function feedOnDisplay(gov: QualityGovernor, hz: number, n: number, gapVsyncs: number): number {
  let changes = 0;
  for (let i = 0; i < n; i++) {
    gov.observeVsync(vsyncOf(hz) + jitter(i));
    if (gov.sample(gapVsyncs * vsyncOf(hz))) changes++;
  }
  return changes;
}

describe('createQualityGovernor (budget relative to the real vsync)', () => {
  const settle = Q.warmupFrames + Q.downWindows * Q.windowFrames + 5;

  it.each([60, 144, 165])('%iHz: frames arriving every vsync are on budget', (hz) => {
    const gov = createQualityGovernor(2, 1, Q);
    feedOnDisplay(gov, hz, 300, 1);
    expect(gov.ratio).toBe(2);
    expect(gov.halfRate).toBe(false);
  });

  it.each([60, 144, 165])('%iHz: a gap of 1.4 vsyncs is still on time', (hz) => {
    const gov = createQualityGovernor(2, 1, Q);
    feedOnDisplay(gov, hz, 300, 1.4);
    expect(gov.ratio).toBe(2);
  });

  it.each([60, 144, 165])('%iHz: a gap of 2 vsyncs is late and lowers the resolution', (hz) => {
    const gov = createQualityGovernor(2, 1, Q);
    feedOnDisplay(gov, hz, settle, 2);
    expect(gov.ratio).toBeLessThan(2);
  });

  // The old fixed 21.5ms let 48fps through on 144Hz; 3 vsyncs there is 20.8ms.
  it('144Hz: 3-vsync gaps (20.8ms, under the old fixed budget) now count as late', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feedOnDisplay(gov, 144, settle, 3);
    expect(gov.ratio).toBeLessThan(2);
  });

  // The old fixed 21.5ms let 82fps through on 165Hz (12.1ms).
  it('165Hz: 82fps (a frame every 2nd vsync) is late, the cursor runs at 165', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feedOnDisplay(gov, 165, settle, 2);
    expect(gov.ratio).toBeLessThan(2);
  });

  it('does not judge anything before the vsync is known', () => {
    const gov = createQualityGovernor(2, 1, Q);
    for (let i = 0; i < 400; i++) gov.sample(100);
    expect(gov.ratio).toBe(2);
    expect(gov.vsyncMs).toBe(0);
  });

  it('setCap() (monitor change) re-estimates the vsync from scratch', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feedOnDisplay(gov, 165, 60, 1);
    expect(gov.vsyncMs).toBeCloseTo(vsyncOf(165), 0);
    gov.setCap(1);
    expect(gov.vsyncMs).toBe(0);
    feedOnDisplay(gov, 60, 60, 1);
    expect(gov.vsyncMs).toBeCloseTo(vsyncOf(60), 0);
  });

  it('measures 60 and 165Hz independently: the same 14ms gap is late on 165Hz only', () => {
    const slow165 = createQualityGovernor(2, 1, Q);
    const ok60 = createQualityGovernor(2, 1, Q);
    for (let i = 0; i < settle; i++) {
      slow165.observeVsync(vsyncOf(165));
      slow165.sample(14);
      ok60.observeVsync(vsyncOf(60));
      ok60.sample(14);
    }
    expect(slow165.ratio).toBeLessThan(2);
    expect(ok60.ratio).toBe(2);
  });
});

// ---- Governor: half-rate fallback ----

/**
 * Feeds `n` frames at 165Hz where each window of `windowFrames` has `share(ratio, half)` of
 * its frames late (2 periods), the rest on time. The period is 1 vsync, or 2 at half rate.
 */
function feedShare(gov: QualityGovernor, n: number, share: (ratio: number, half: boolean) => number): void {
  const v = vsyncOf(165);
  for (let i = 0; i < n; i++) {
    gov.observeVsync(v);
    const period = gov.halfRate ? 2 : 1;
    const late = i % Q.windowFrames < share(gov.ratio, gov.halfRate) * Q.windowFrames;
    gov.sample(period * v * (late ? 2 : 1));
  }
}

describe('createQualityGovernor (half-rate fallback)', () => {
  // Share falls 0.5 per ratio unit: every step down helps, but at the floor (1) it is still 0.4.
  const stillOver = (ratio: number, half: boolean) => (half ? 0 : Math.min(1, (ratio - 1) * 0.5 + 0.4));

  it('stays at full rate while the resolution can still drop', () => {
    const gov = createQualityGovernor(2, 1, Q);
    let sawHalfAboveFloor = false;
    for (let i = 0; i < 120; i++) {
      feedShare(gov, 10, stillOver);
      if (gov.halfRate && gov.ratio > 1.0001) sawHalfAboveFloor = true;
    }
    expect(sawHalfAboveFloor).toBe(false);
  });

  it('engages at the floor when windows are still over budget', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feedShare(gov, 3000, stillOver);
    expect(gov.ratio).toBeCloseTo(1);
    expect(gov.halfRate).toBe(true);
  });

  it('never engages when the budget is met above the floor', () => {
    const gov = createQualityGovernor(2, 1, Q);
    feedShare(gov, 3000, (ratio) => (ratio > 1.5 ? 0.6 : 0));
    expect(gov.halfRate).toBe(false);
    expect(gov.ratio).toBeGreaterThan(1);
  });

  it('engages on a 1x screen (cap == floor) as soon as two windows are over budget', () => {
    const gov = createQualityGovernor(1, 1, Q);
    feedShare(gov, Q.warmupFrames + 4 * Q.windowFrames, (_r, half) => (half ? 0 : 0.5));
    expect(gov.halfRate).toBe(true);
    expect(gov.ratio).toBe(1);
  });

  it('gives up half rate when it does not help (rAF throttled, not GPU bound)', () => {
    const gov = createQualityGovernor(1, 1, Q);
    feedShare(gov, 600, () => 0.6);
    let atHalf = 0;
    for (let i = 0; i < 40; i++) {
      feedShare(gov, Q.windowFrames, () => 0.6);
      if (gov.halfRate) atHalf++;
    }
    // Held at full rate for most of the hold (it may only flap for a probe).
    expect(atHalf).toBeLessThan(10);
  });

  it('judges lateness against the half-rate period (2 vsyncs on time is not late)', () => {
    const gov = createQualityGovernor(1, 1, Q);
    feedShare(gov, 400, (_r, half) => (half ? 0 : 0.5));
    expect(gov.halfRate).toBe(true);
    // From here every frame arrives exactly 2 vsyncs after the last: healthy at half rate.
    feedShare(gov, 3 * Q.windowFrames, (_r, half) => (half ? 0 : 0.5));
    expect(gov.halfRate).toBe(true);
  });

  it('probes full rate again after a calm stretch and falls back if that fails', () => {
    const gov = createQualityGovernor(1, 1, Q);
    const states: boolean[] = [];
    const v = vsyncOf(165);
    for (let i = 0; i < 4000; i++) {
      gov.observeVsync(v);
      const period = gov.halfRate ? 2 : 1;
      // GPU cannot hold full rate: every full-rate frame is late, half-rate ones are on time.
      gov.sample(period * v * (gov.halfRate ? 1 : 2));
      if (i % Q.windowFrames === 0) states.push(gov.halfRate);
    }
    expect(states.filter(Boolean).length).toBeGreaterThan(states.length / 2);
    expect(states.some((s) => !s)).toBe(true);
  });

  it('setCap() leaves half rate (new monitor, new budget)', () => {
    const gov = createQualityGovernor(1, 1, Q);
    feedShare(gov, 400, (_r, half) => (half ? 0 : 0.5));
    expect(gov.halfRate).toBe(true);
    gov.setCap(1);
    expect(gov.halfRate).toBe(false);
  });

  it('observeVsync() and sample() return primitives only (allocation-free contract)', () => {
    const gov = createQualityGovernor(2, 1, Q);
    expect(gov.observeVsync(vsyncOf(165))).toBeUndefined();
    expect(typeof gov.sample(vsyncOf(165))).toBe('boolean');
  });
});

describe('QUALITY (production config) against a 165Hz display', () => {
  it('1 vsync per frame is calm, 2 vsyncs per frame is late', () => {
    const calm = createQualityGovernor(2, 1, QUALITY);
    const busy = createQualityGovernor(2, 1, QUALITY);
    const frames = QUALITY.warmupFrames + QUALITY.downWindows * QUALITY.windowFrames + 5;
    for (let i = 0; i < frames; i++) {
      calm.observeVsync(vsyncOf(165));
      calm.sample(vsyncOf(165));
      busy.observeVsync(vsyncOf(165));
      busy.sample(2 * vsyncOf(165));
    }
    expect(calm.ratio).toBe(2);
    expect(busy.ratio).toBeLessThan(2);
  });
});

// ---- Vsync probe (before the first draw) ----

describe('vsync lock-in (GPU too slow from the very first frame)', () => {
  const v165 = vsyncOf(165);
  const frames = QUALITY.warmupFrames + QUALITY.downWindows * QUALITY.windowFrames + 5;

  // Chrome throttles rAF to the frame production rate: every loop gap is 2 vsyncs.
  it('with only loop gaps the estimate locks onto 2 vsyncs and nothing is ever late (the bug)', () => {
    const gov = createQualityGovernor(2, 1, QUALITY);
    for (let i = 0; i < 400; i++) {
      gov.observeVsync(2 * v165);
      gov.sample(2 * v165);
    }
    expect(gov.vsyncMs).toBeCloseTo(2 * v165, 0);
    expect(gov.ratio).toBe(2);
  });

  it('seeded by 1-vsync probe gaps it steps the resolution down', () => {
    const gov = createQualityGovernor(2, 1, QUALITY);
    for (let i = 0; i < QUALITY.vsyncMinSamples + 2; i++) gov.observeVsync(v165); // probe, no draw
    expect(gov.vsyncMs).toBeCloseTo(v165, 0);
    for (let i = 0; i < frames; i++) {
      gov.observeVsync(2 * v165);
      gov.sample(2 * v165);
    }
    expect(gov.ratio).toBeLessThan(2);
  });

  // The rise path still protects against a genuinely slower display: only after a long
  // consistent run of longer gaps, never before the governor had its say.
  it('a probe-seeded estimate still follows a genuinely slower display, after vsyncRiseEvals', () => {
    const gov = createQualityGovernor(2, 1, QUALITY);
    for (let i = 0; i < 40; i++) gov.observeVsync(v165);
    for (let i = 0; i < 64 + QUALITY.vsyncRiseEvals * QUALITY.vsyncEvery + 16; i++) gov.observeVsync(vsyncOf(60));
    expect(gov.vsyncMs).toBeCloseTo(vsyncOf(60), 0);
  });
});

describe('loopMayStart (shader gate + vsync probe)', () => {
  it('waits for the shader gate whatever the probe says', () => {
    expect(loopMayStart(false, true, 100, 30)).toBe(false);
  });

  it('starts once the gate settled and the vsync is known', () => {
    expect(loopMayStart(true, true, 5, 30)).toBe(true);
  });

  it('holds the loop back while the vsync is unknown and the probe still has callbacks left', () => {
    expect(loopMayStart(true, false, 10, 30)).toBe(false);
  });

  it('gives up probing after the cap so the loop always starts', () => {
    expect(loopMayStart(true, false, 30, 30)).toBe(true);
  });
});

describe('vsyncProbeWanted', () => {
  it('probes only while the scene is due, not drawing yet, and the vsync is unknown', () => {
    expect(vsyncProbeWanted(true, false, false, 0, 30)).toBe(true);
    expect(vsyncProbeWanted(false, false, false, 0, 30)).toBe(false); // hidden / off-screen: no rAF work
    expect(vsyncProbeWanted(true, true, false, 0, 30)).toBe(false); // the loop feeds it
    expect(vsyncProbeWanted(true, false, true, 0, 30)).toBe(false); // already known
    expect(vsyncProbeWanted(true, false, false, 30, 30)).toBe(false); // cap reached
  });
});
