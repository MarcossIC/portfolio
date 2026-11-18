import {
  PARALLAX_AMPLITUDE_PX,
  STAR_COUNT_DESKTOP,
  STAR_COUNT_MOBILE,
  STAR_SEED,
  applyFilterOps,
  bakeScale,
  buildStars,
  compileFilterInPlace,
  coverRect,
  depthEllipse,
  isLiteViewport,
  mulberry32,
  parallaxTarget,
  parseFilterChain,
  shouldRebake,
  smoothToward,
} from './cosmic-background.utils';

describe('cosmic-background utils', () => {
  describe('mulberry32 (seeded PRNG)', () => {
    it('produces the exact same sequence for the same seed (SSR === client)', () => {
      const a = mulberry32(1234);
      const b = mulberry32(1234);
      const seqA = Array.from({ length: 20 }, () => a());
      const seqB = Array.from({ length: 20 }, () => b());
      expect(seqA).toEqual(seqB);
    });

    it('produces a different sequence for a different seed', () => {
      const a = mulberry32(1);
      const b = mulberry32(2);
      expect(a()).not.toBe(b());
    });

    it('stays inside [0, 1)', () => {
      const r = mulberry32(STAR_SEED);
      for (let i = 0; i < 500; i++) {
        const v = r();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });
  });

  describe('buildStars', () => {
    it('is deterministic: two builds are identical', () => {
      expect(buildStars()).toEqual(buildStars());
    });

    it('builds the desktop count and flags everything past the mobile budget as extra', () => {
      const stars = buildStars();
      expect(stars).toHaveLength(STAR_COUNT_DESKTOP);
      expect(stars.filter((s) => !s.extra)).toHaveLength(STAR_COUNT_MOBILE);
      // the mobile set is the FIRST n stars, so hiding extras never reshuffles
      expect(stars.slice(0, STAR_COUNT_MOBILE).every((s) => !s.extra)).toBe(true);
      expect(stars.slice(STAR_COUNT_MOBILE).every((s) => s.extra)).toBe(true);
    });

    it('keeps every star inside the viewport box with sane sizes/timings', () => {
      for (const s of buildStars()) {
        expect(s.x).toBeGreaterThanOrEqual(0);
        expect(s.x).toBeLessThan(100);
        expect(s.y).toBeGreaterThanOrEqual(0);
        expect(s.y).toBeLessThan(100);
        expect(s.size).toBeGreaterThanOrEqual(0.5);
        expect(s.size).toBeLessThan(3);
        expect(s.duration).toBeGreaterThanOrEqual(2);
        expect(s.duration).toBeLessThan(6);
        expect(s.delay).toBeGreaterThanOrEqual(0);
        expect(s.delay).toBeLessThan(5);
      }
    });

    it('rounds values so SSR markup and client bindings serialize identically', () => {
      for (const s of buildStars()) {
        expect(Number(s.x.toFixed(2))).toBe(s.x);
        expect(Number(s.size.toFixed(2))).toBe(s.size);
      }
    });
  });

  describe('isLiteViewport (star budget / FX weight by breakpoint)', () => {
    it('is lite under 768px or on a coarse pointer', () => {
      expect(isLiteViewport(390, false)).toBe(true);
      expect(isLiteViewport(767, false)).toBe(true);
      expect(isLiteViewport(1440, true)).toBe(true);
    });

    it('is full on a wide fine-pointer viewport', () => {
      expect(isLiteViewport(768, false)).toBe(false);
      expect(isLiteViewport(1440, false)).toBe(false);
    });
  });

  describe('smoothToward (frame-rate independent exponential smoothing)', () => {
    it('does not move with dt = 0 and lands on target for huge dt', () => {
      expect(smoothToward(0, 10, 0, 300)).toBe(0);
      expect(smoothToward(0, 10, 1e6, 300)).toBeCloseTo(10, 6);
    });

    it('covers ~63% of the gap after one time constant', () => {
      expect(smoothToward(0, 10, 300, 300)).toBeCloseTo(10 * (1 - Math.exp(-1)), 6);
    });

    it('is frame-rate independent: 2 frames of 16ms == 1 frame of 32ms', () => {
      const twoSteps = smoothToward(smoothToward(0, 10, 16, 300), 10, 16, 300);
      const oneStep = smoothToward(0, 10, 32, 300);
      expect(twoSteps).toBeCloseTo(oneStep, 9);
    });

    it('works in both directions', () => {
      expect(smoothToward(10, 0, 300, 300)).toBeCloseTo(10 * Math.exp(-1), 6);
    });
  });

  describe('parallaxTarget', () => {
    it('maps the pointer to ±amplitude px around the center', () => {
      expect(parallaxTarget(500, 300, 1000, 600)).toEqual({ x: 0, y: 0 });
      expect(parallaxTarget(0, 0, 1000, 600)).toEqual({
        x: -PARALLAX_AMPLITUDE_PX,
        y: -PARALLAX_AMPLITUDE_PX,
      });
      expect(parallaxTarget(1000, 600, 1000, 600)).toEqual({
        x: PARALLAX_AMPLITUDE_PX,
        y: PARALLAX_AMPLITUDE_PX,
      });
    });
  });

  describe('bakeScale', () => {
    const base = { layerW: 1520, layerH: 980, imgW: 1920, imgH: 1080 };

    it('never goes above the source density (more pixels add no detail)', () => {
      // cover factor = max(1520/1920, 980/1080) ≈ 0.907 → ≈1.10 src px per css px
      const s = bakeScale({ ...base, dpr: 2, lite: false });
      expect(s).toBeCloseTo(1080 / 980, 3);
    });

    it('honors a 1x display', () => {
      expect(bakeScale({ ...base, dpr: 1, lite: false })).toBe(1);
    });

    it('caps at 1.5x on lite (mobile) and 2x on desktop', () => {
      const big = { layerW: 400, layerH: 300, imgW: 4000, imgH: 3000 };
      expect(bakeScale({ ...big, dpr: 3, lite: true })).toBe(1.5);
      expect(bakeScale({ ...big, dpr: 3, lite: false })).toBe(2);
    });

    it('caps the bitmap width at 2560px', () => {
      const wide = { layerW: 2000, layerH: 1000, imgW: 8000, imgH: 4000 };
      const s = bakeScale({ ...wide, dpr: 2, lite: false });
      expect(Math.round(wide.layerW * s)).toBeLessThanOrEqual(2560);
    });

    it('never drops under 1 css px per bitmap px', () => {
      const tinyImg = { layerW: 1520, layerH: 980, imgW: 320, imgH: 180 };
      expect(bakeScale({ ...tinyImg, dpr: 2, lite: false })).toBe(1);
    });
  });

  describe('coverRect (object-fit: cover)', () => {
    it('centers and crops the image like the CSS did', () => {
      const r = coverRect(1920, 1080, 1520, 980);
      const k = 980 / 1080;
      expect(r.w).toBeCloseTo(1920 * k, 6);
      expect(r.h).toBeCloseTo(980, 6);
      expect(r.x).toBeCloseTo((1520 - 1920 * k) / 2, 6);
      expect(r.y).toBeCloseTo(0, 6);
    });
  });

  describe('depthEllipse (radial-gradient(ellipse at 50% 30%) = farthest-corner)', () => {
    it('keeps the farthest-side aspect ratio and passes through the farthest corner', () => {
      const e = depthEllipse(1000, 800);
      expect(e.cx).toBe(500);
      expect(e.cy).toBe(240);
      expect(e.rx).toBeCloseTo(Math.SQRT2 * 500, 6);
      expect(e.ry).toBeCloseTo(Math.SQRT2 * 560, 6);
      // bottom corners lie exactly on the 100% ending shape
      const dx = 1000 - e.cx;
      const dy = 800 - e.cy;
      expect((dx / e.rx) ** 2 + (dy / e.ry) ** 2).toBeCloseTo(1, 6);
    });
  });

  describe('filter chain (Safari < 18 fallback for ctx.filter)', () => {
    it('parses the atmos filter tokens', () => {
      expect(parseFilterChain('brightness(0.64) saturate(1.05) hue-rotate(16deg)')).toEqual([
        { fn: 'brightness', v: 0.64 },
        { fn: 'saturate', v: 1.05 },
        { fn: 'hue-rotate', v: 16 },
      ]);
      expect(parseFilterChain('brightness(0.86) saturate(1.7) hue-rotate(-46deg)')).toEqual([
        { fn: 'brightness', v: 0.86 },
        { fn: 'saturate', v: 1.7 },
        { fn: 'hue-rotate', v: -46 },
      ]);
    });

    it('accepts percentages and ignores unknown functions', () => {
      expect(parseFilterChain('brightness(50%) blur(2px)')).toEqual([{ fn: 'brightness', v: 0.5 }]);
      expect(parseFilterChain('none')).toEqual([]);
    });

    it('brightness scales the channels', () => {
      expect(applyFilterOps([200, 100, 50], [{ fn: 'brightness', v: 0.5 }])).toEqual([100, 50, 25]);
    });

    it('saturate(0) gives the spec luminance gray', () => {
      const [r, g, b] = applyFilterOps([255, 0, 0], [{ fn: 'saturate', v: 0 }]);
      expect(r).toBe(Math.round(0.213 * 255));
      expect(g).toBe(r);
      expect(b).toBe(r);
    });

    it('the in-place RGBA filter matches the per-pixel one and keeps alpha', () => {
      const ops = parseFilterChain('brightness(0.86) saturate(1.7) hue-rotate(-46deg)');
      const px = new Uint8ClampedArray([120, 60, 200, 255, 210, 120, 70, 128, 0, 0, 0, 7]);
      compileFilterInPlace(ops)(px);
      expect(Array.from(px.slice(0, 3))).toEqual(applyFilterOps([120, 60, 200], ops));
      expect(Array.from(px.slice(4, 7))).toEqual(applyFilterOps([210, 120, 70], ops));
      expect([px[3], px[7], px[11]]).toEqual([255, 128, 7]);
    });

    it('hue-rotate(0) and saturate(1) are identities, and channels are clamped', () => {
      expect(
        applyFilterOps(
          [12, 140, 230],
          [
            { fn: 'hue-rotate', v: 0 },
            { fn: 'saturate', v: 1 },
          ]
        )
      ).toEqual([12, 140, 230]);
      const [r, g, b] = applyFilterOps([255, 10, 10], [{ fn: 'saturate', v: 3 }]);
      expect(r).toBe(255);
      expect(g).toBe(0);
      expect(b).toBe(0);
    });
  });

  describe('shouldRebake', () => {
    it('ignores height-only changes on touch devices (URL bar show/hide)', () => {
      expect(shouldRebake({ w: 390, h: 664 }, { w: 390, h: 844 }, true)).toBe(false);
      expect(shouldRebake({ w: 390, h: 844 }, { w: 844, h: 390 }, true)).toBe(true);
    });

    it('re-bakes on any real size change on desktop', () => {
      expect(shouldRebake({ w: 1440, h: 900 }, { w: 1440, h: 900 }, false)).toBe(false);
      expect(shouldRebake({ w: 1440, h: 900 }, { w: 1440, h: 700 }, false)).toBe(true);
    });
  });
});
