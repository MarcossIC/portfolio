import { frameDelta, glslFloat, isFrameDue, needsResize, zoomOutFor } from './galaxy-scene';
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
