/** Node centers (px from the rail top) -> fractions of the rail height (0..1). */
export function nodeThresholds(centersPx: number[], railHeight: number): number[] {
  return centersPx.map((c) => (railHeight > 0 ? c / railHeight : 0));
}

/** A node is lit once the rail fill has reached its threshold. */
export function litFlags(fill: number, thresholds: number[]): boolean[] {
  return thresholds.map((t) => fill >= t);
}
