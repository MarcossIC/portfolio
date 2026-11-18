import {
  approach,
  createQualityGovernor,
  frameDelta,
  framingFor,
  glslFloat,
  isFrameDue,
  isShortLandscape,
  needsResize,
  settleWithin,
  zoomOutFor,
  type QualityConfig,
  type QualityGovernor,
} from './galaxy-scene';
import { FRAMING, LOOP } from './galaxy-scene.config';

const MAX_ZOOM_OUT = FRAMING.maxZoomOut;
const MIN_FRAME_MS = LOOP.minFrameMs;

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
      expect(framingFor(aspect)).toEqual({ zoom: zoomOutFor(aspect), magnify: 1, lift: 0, shift: 0, brightness: 1 });
    }
  });

  // Landscape phones: the hero is taller than the viewport, so the canvas sits just under minAspect.
  it('barely moves just under the landscape threshold', () => {
    const f = framingFor(1.07);
    expect(Math.abs(f.zoom - zoomOutFor(1.07))).toBeLessThan(0.01);
    expect(f.lift).toBeLessThan(0.01);
    expect(f.magnify).toBeLessThan(1.01);
    expect(f.brightness).toBeGreaterThan(0.99);
  });

  it('applies the full portrait framing on phones', () => {
    for (const aspect of [P.aspect, 768 / 1024, 0.44, 0.3]) {
      expect(framingFor(aspect)).toEqual({
        zoom: P.zoom,
        magnify: P.magnify,
        lift: P.lift,
        shift: 0,
        brightness: P.brightness,
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

describe('isFrameDue (FPS cap)', () => {
  const hz = (rate: number) => 1000 / rate;

  it('renders every frame on 60Hz and 90Hz displays', () => {
    expect(isFrameDue(hz(60), 0)).toBe(true);
    expect(isFrameDue(hz(90), 0)).toBe(true);
  });

  it('skips every other frame on 120Hz and 144Hz displays', () => {
    expect(isFrameDue(hz(120), 0)).toBe(false);
    expect(isFrameDue(2 * hz(120), 0)).toBe(true);
    expect(isFrameDue(hz(144), 0)).toBe(false);
    expect(isFrameDue(2 * hz(144), 0)).toBe(true);
  });

  it('skips a frame stamped before the last render', () => {
    expect(isFrameDue(995, 1000)).toBe(false);
  });

  it('exposes a threshold below the 90Hz frame time', () => {
    expect(MIN_FRAME_MS).toBeLessThan(hz(90));
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
  slowFrameMs: 21.5,
  stallMs: 250,
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
