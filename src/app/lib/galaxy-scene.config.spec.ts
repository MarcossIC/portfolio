import { CORE_GLOW, DEVICE, PALETTES, QUALITY, type GradientStop } from './galaxy-scene.config';

// The palettes are hand-tuned data; the gradient lookup in galaxy-scene.ts relies
// on these invariants, so a tweak that breaks one fails here, not on screen.
describe('galaxy palettes', () => {
  const HEX = /^#[0-9a-f]{6}$/i;

  for (const [atmos, palette] of Object.entries(PALETTES)) {
    describe(atmos, () => {
      const stops: readonly GradientStop[] = palette.arms;

      it('spans the whole radius, core (0) to rim (1)', () => {
        expect(stops[0][0]).toBe(0);
        expect(stops[stops.length - 1][0]).toBe(1);
      });

      it('has strictly ascending stops', () => {
        for (let i = 1; i < stops.length; i++) {
          expect(stops[i][0]).toBeGreaterThan(stops[i - 1][0]);
        }
      });

      it('uses 6-digit hex colors', () => {
        for (const [, hex] of stops) expect(hex).toMatch(HEX);
        expect(palette.core).toMatch(HEX);
        expect(palette.halo).toMatch(HEX);
      });
    });
  }
});

// The governor only sees vsync-quantized rAF gaps, so `slowFrameMs` has to sit
// between every healthy cadence and every dropped-frame cadence the loop produces.
describe('QUALITY budget', () => {
  const vsync = (hz: number) => 1000 / hz;

  it('treats healthy cadences as on budget (60Hz, and the 100Hz every-other-frame pattern)', () => {
    expect(QUALITY.slowFrameMs).toBeGreaterThan(vsync(60));
    expect(QUALITY.slowFrameMs).toBeGreaterThan(2 * vsync(100));
  });

  it('flags a dropped frame at 60Hz, 90Hz and 120Hz as slow', () => {
    expect(QUALITY.slowFrameMs).toBeLessThan(2 * vsync(60));
    expect(QUALITY.slowFrameMs).toBeLessThan(2 * vsync(90));
    expect(QUALITY.slowFrameMs).toBeLessThan(3 * vsync(120));
  });

  it('only ever lowers the resolution with a step in (0, 1)', () => {
    expect(QUALITY.step).toBeGreaterThan(0);
    expect(QUALITY.step).toBeLessThan(1);
  });

  it('keeps the calm band below the over-budget band (hysteresis)', () => {
    expect(QUALITY.calmShare).toBeLessThan(QUALITY.overShare);
    expect(QUALITY.upWindows).toBeGreaterThan(QUALITY.downWindows);
  });

  it('keeps every floor at or below its device cap', () => {
    expect(QUALITY.minPixelRatio.desktop).toBeLessThanOrEqual(DEVICE.maxPixelRatio.desktop);
    expect(QUALITY.minPixelRatio.mobile).toBeLessThanOrEqual(DEVICE.maxPixelRatio.mobile);
  });
});

// alphaTest discards the halo's transparent corners; it must stay under a quarter
// of an 8-bit step, so a discarded pixel could never have shown.
describe('CORE_GLOW.alphaTest', () => {
  it('only discards fragments that contribute under 1/4 of an 8-bit step', () => {
    expect(CORE_GLOW.alphaTest).toBeGreaterThan(0);
    expect(CORE_GLOW.alphaTest * 255).toBeLessThanOrEqual(0.25);
  });
});
