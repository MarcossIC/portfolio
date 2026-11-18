/**
 * Pure helpers for the cosmic background. No DOM access here: everything is
 * deterministic and unit-testable, so SSR and the client compute the same values.
 */

/** Fixed seed: SSR markup and client bindings must produce identical stars. */
export const STAR_SEED = 0x2f6b1d3;
/** Full star budget (desktop, fine pointer). */
export const STAR_COUNT_DESKTOP = 80;
/** Star budget on small / touch screens — the rest get `.star--extra` and are hidden by CSS. */
export const STAR_COUNT_MOBILE = 30;
/** Breakpoint under which the background and the atmosphere FX go "lite". */
export const LITE_MAX_WIDTH = 767;

/** Parallax reach: ±10px, same as the old CSS-transition version. */
export const PARALLAX_AMPLITUDE_PX = 10;
/** Time constant of the parallax easing (≈ the feel of the old 1.2s ease-out). */
export const PARALLAX_TAU_MS = 300;
/** Distance under which the parallax loop snaps to target and goes idle. */
export const PARALLAX_EPSILON_PX = 0.05;

export interface Star {
  /** % of the viewport */
  x: number;
  y: number;
  /** px */
  size: number;
  /** s */
  duration: number;
  delay: number;
  isBright: boolean;
  /** Past the mobile budget → hidden on lite viewports. */
  extra: boolean;
}

/** mulberry32: tiny, fast, good-enough seeded PRNG in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round2 = (v: number) => Math.round(v * 100) / 100;

/**
 * Same distribution as the original Math.random() field, but seeded. Values are
 * rounded to 2 decimals so the server-serialized style attribute and the client
 * binding are byte-identical (no hydration "pop").
 */
export function buildStars(
  count = STAR_COUNT_DESKTOP,
  seed = STAR_SEED,
  mobileCount = STAR_COUNT_MOBILE
): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: Math.min(99.99, round2(rand() * 100)),
    y: Math.min(99.99, round2(rand() * 100)),
    size: Math.min(2.99, round2(rand() * 2.5 + 0.5)),
    duration: Math.min(5.99, round2(rand() * 4 + 2)),
    delay: Math.min(4.99, round2(rand() * 5)),
    isBright: rand() * 2.5 + 0.5 > 2,
    extra: i >= mobileCount,
  }));
}

/** Small or touch screens get the lighter background and FX. */
export function isLiteViewport(width: number, coarsePointer: boolean): boolean {
  return coarsePointer || width <= LITE_MAX_WIDTH;
}

/**
 * Exponential smoothing toward a target, frame-rate independent:
 * applying it twice with dt=16 equals once with dt=32.
 */
export function smoothToward(current: number, target: number, dtMs: number, tauMs: number): number {
  if (dtMs <= 0) return current;
  const k = 1 - Math.exp(-dtMs / tauMs);
  return current + (target - current) * k;
}

/** Pointer position → parallax offset in px (±amplitude around the center). */
export function parallaxTarget(
  clientX: number,
  clientY: number,
  width: number,
  height: number,
  amplitude = PARALLAX_AMPLITUDE_PX
): { x: number; y: number } {
  const x = (clientX / width - 0.5) * 2 * amplitude;
  const y = (clientY / height - 0.5) * 2 * amplitude;
  // normalize -0 → 0 so equality checks stay simple
  return { x: x + 0, y: y + 0 };
}

export interface BakeScaleInput {
  dpr: number;
  lite: boolean;
  layerW: number;
  layerH: number;
  imgW: number;
  imgH: number;
}

export const BAKE_MAX_SCALE_DESKTOP = 2;
export const BAKE_MAX_SCALE_LITE = 1.5;
export const BAKE_MAX_WIDTH_PX = 2560;

/**
 * Bitmap px per CSS px for the baked background. Bounded by:
 * - the display DPR (capped 2x desktop / 1.5x lite),
 * - the source image density: the photo is the only high-frequency content and
 *   baking beyond its own resolution adds pixels, not detail (gradients upscale
 *   losslessly to the eye),
 * - a 2560px bitmap width.
 * Never below 1.
 */
export function bakeScale(i: BakeScaleInput): number {
  const dprCap = Math.min(i.dpr || 1, i.lite ? BAKE_MAX_SCALE_LITE : BAKE_MAX_SCALE_DESKTOP);
  const cover = Math.max(i.layerW / i.imgW, i.layerH / i.imgH);
  const sourceDensity = cover > 0 ? 1 / cover : dprCap;
  let s = Math.min(dprCap, Math.max(1, sourceDensity));
  if (i.layerW * s > BAKE_MAX_WIDTH_PX) s = BAKE_MAX_WIDTH_PX / i.layerW;
  return Math.max(1, s);
}

/** object-fit: cover placement of an image inside a box. */
export function coverRect(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number
): { x: number; y: number; w: number; h: number } {
  const k = Math.max(boxW / imgW, boxH / imgH);
  const w = imgW * k;
  const h = imgH * k;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}

/**
 * Geometry of `radial-gradient(ellipse at 50% 30%, ...)` over a W×H box.
 * Default size is farthest-corner: the farthest-side aspect ratio, scaled until
 * the ellipse passes through the farthest corner (k = √2 for this center).
 */
export function depthEllipse(w: number, h: number): { cx: number; cy: number; rx: number; ry: number } {
  const cx = w * 0.5;
  const cy = h * 0.3;
  const sx = Math.max(cx, w - cx);
  const sy = Math.max(cy, h - cy);
  const dx = Math.max(cx, w - cx);
  const dy = Math.max(cy, h - cy);
  const k = Math.sqrt((dx / sx) ** 2 + (dy / sy) ** 2);
  return { cx, cy, rx: sx * k, ry: sy * k };
}

export type FilterOp =
  | { fn: 'brightness'; v: number }
  | { fn: 'saturate'; v: number }
  | { fn: 'hue-rotate'; v: number };

/** Parses the subset of CSS filter functions the atmos tokens use. */
export function parseFilterChain(input: string): FilterOp[] {
  const ops: FilterOp[] = [];
  const re = /(brightness|saturate|hue-rotate)\(\s*(-?[\d.]+)\s*(%|deg)?\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    const fn = m[1] as FilterOp['fn'];
    let v = parseFloat(m[2]);
    if (m[3] === '%') v /= 100;
    ops.push({ fn, v } as FilterOp);
  }
  return ops;
}

type Mat3 = [number, number, number, number, number, number, number, number, number];

function saturateMatrix(s: number): Mat3 {
  return [
    0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s,
    0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s,
    0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s,
  ];
}

function hueRotateMatrix(deg: number): Mat3 {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [
    0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
    0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.14, 0.072 - c * 0.072 - s * 0.283,
    0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
  ];
}

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

function toMatrices(ops: FilterOp[]): Mat3[] {
  return ops.map((op): Mat3 =>
    op.fn === 'brightness'
      ? [op.v, 0, 0, 0, op.v, 0, 0, 0, op.v]
      : op.fn === 'saturate'
        ? saturateMatrix(op.v)
        : hueRotateMatrix(op.v)
  );
}

/**
 * Allocation-free version for ImageData buffers (RGBA, alpha untouched).
 * Same math and rounding as compileFilterOps.
 */
export function compileFilterInPlace(ops: FilterOp[]): (px: Uint8ClampedArray) => void {
  const steps = toMatrices(ops);
  return (px) => {
    for (let i = 0; i < px.length; i += 4) {
      let r = px[i];
      let g = px[i + 1];
      let b = px[i + 2];
      for (let s = 0; s < steps.length; s++) {
        const m = steps[s];
        const nr = clamp255(m[0] * r + m[1] * g + m[2] * b);
        const ng = clamp255(m[3] * r + m[4] * g + m[5] * b);
        const nb = clamp255(m[6] * r + m[7] * g + m[8] * b);
        r = nr;
        g = ng;
        b = nb;
      }
      px[i] = Math.round(r);
      px[i + 1] = Math.round(g);
      px[i + 2] = Math.round(b);
    }
  };
}

/** Precompiled per-pixel function equivalent to the CSS filter chain (sRGB, clamped per step). */
export function compileFilterOps(ops: FilterOp[]): (r: number, g: number, b: number) => [number, number, number] {
  const steps = toMatrices(ops);
  return (r, g, b) => {
    for (const m of steps) {
      const nr = clamp255(m[0] * r + m[1] * g + m[2] * b);
      const ng = clamp255(m[3] * r + m[4] * g + m[5] * b);
      const nb = clamp255(m[6] * r + m[7] * g + m[8] * b);
      r = nr;
      g = ng;
      b = nb;
    }
    return [Math.round(r), Math.round(g), Math.round(b)];
  };
}

export function applyFilterOps(rgb: [number, number, number], ops: FilterOp[]): [number, number, number] {
  return compileFilterOps(ops)(rgb[0], rgb[1], rgb[2]);
}

/** Re-bake only on a real size change; touch devices ignore height-only changes (URL bar). */
export function shouldRebake(
  prev: { w: number; h: number },
  next: { w: number; h: number },
  touch: boolean
): boolean {
  if (prev.w !== next.w) return true;
  return !touch && prev.h !== next.h;
}

/**
 * Star-flare texture as one CSS background (one raster, then the toggle only
 * animates its opacity on the compositor). A white core + soft halo per star.
 */
export function flareBackground(stars: Star[]): string {
  return stars
    .map((s) => {
      const r = round2(s.size * 2.4 + 1.5);
      return `radial-gradient(circle ${r}px at ${s.x}% ${s.y}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 35%, rgba(255,255,255,0) 100%)`;
    })
    .join(',');
}
