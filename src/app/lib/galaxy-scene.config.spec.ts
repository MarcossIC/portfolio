import { PALETTES, type GradientStop } from './galaxy-scene.config';

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
