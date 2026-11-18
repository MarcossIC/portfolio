import { litFlags, nodeThresholds } from './timeline-ignite';

describe('timeline-ignite', () => {
  it('turns node centers into fractions of the rail height', () => {
    expect(nodeThresholds([100, 500, 900], 1000)).toEqual([0.1, 0.5, 0.9]);
  });

  it('returns zeros for a collapsed rail', () => {
    expect(nodeThresholds([10], 0)).toEqual([0]);
  });

  it('lights the nodes the fill has reached (inclusive) and dims the rest', () => {
    const t = [0.1, 0.5, 0.9];
    expect(litFlags(0, t)).toEqual([false, false, false]);
    expect(litFlags(0.1, t)).toEqual([true, false, false]);
    expect(litFlags(0.7, t)).toEqual([true, true, false]);
    expect(litFlags(1, t)).toEqual([true, true, true]);
    // scrolling back up dims them again
    expect(litFlags(0.3, t)).toEqual([true, false, false]);
  });
});
