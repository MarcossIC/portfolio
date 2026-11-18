import {
  compileFilterInPlace,
  compileFilterOps,
  coverRect,
  depthEllipse,
  parseFilterChain,
} from './cosmic-background.utils';

/**
 * Inputs of one baked atmosphere. They mirror the live CSS stack in
 * cosmic-background.component.css, which in turn reads the tokens in _vars.css.
 */
export interface AtmosBakeTokens {
  /** --atmos-nebula-filter */
  filter: string;
  /** --atmos-cool-veil (alpha of the violet `color` veils) */
  coolVeil: number;
  /** --atmos-void-rgb, e.g. "15, 2, 39" */
  voidRgb: string;
  /** --ml-bg-color (body background behind the fixed stack) */
  bg: string;
}

/** Fallback mirror of _vars.css — used only when a token can't be read at runtime. */
export const ATMOS_TOKEN_FALLBACK: Record<'nebula' | 'ember', AtmosBakeTokens> = {
  nebula: {
    filter: 'brightness(0.64) saturate(1.05) hue-rotate(16deg)',
    coolVeil: 0.32,
    voidRgb: '15, 2, 39',
    bg: '#0f0227',
  },
  ember: {
    filter: 'brightness(0.86) saturate(1.7) hue-rotate(-46deg)',
    coolVeil: 0,
    voidRgb: '26, 4, 20',
    bg: '#1a0414',
  },
};

/** Same constants as the live CSS stack. */
const IMG_OPACITY = 0.6;
const COOL_VEIL_HSL = '264, 80%, 42%';

/** Reads the atmos tokens computed on `el`, falling back per-token to the mirror. */
export function readAtmosTokens(el: Element, fallback: AtmosBakeTokens): AtmosBakeTokens {
  const cs = getComputedStyle(el);
  const get = (name: string) => cs.getPropertyValue(name).trim();
  const veil = parseFloat(get('--atmos-cool-veil'));
  return {
    filter: get('--atmos-nebula-filter') || fallback.filter,
    coolVeil: Number.isFinite(veil) ? veil : fallback.coolVeil,
    voidRgb: get('--atmos-void-rgb') || fallback.voidRgb,
    bg: get('--ml-bg-color') || fallback.bg,
  };
}

const ctxFilterTrust = new Map<string, boolean>();
/** Probe colors for the calibration (a violet, a warm and a cyan-ish tone). */
const CALIBRATION_RGB: [number, number, number][] = [
  [120, 60, 200],
  [210, 120, 70],
  [40, 170, 190],
];

/**
 * Can ctx.filter be trusted to match the CSS filter for this chain?
 * Feature-detecting the property is not enough: Safari < 18 ignores it and
 * WebKit's canvas filter (measured, Playwright WebKit) produces visibly
 * different colors than its own CSS `filter`. So calibrate on a few pixels
 * against the spec matrices (which match CSS output in Chromium and WebKit).
 */
function ctxFilterMatchesCss(filter: string): boolean {
  const cached = ctxFilterTrust.get(filter);
  if (cached !== undefined) return cached;
  let ok = false;
  try {
    const c = document.createElement('canvas');
    c.width = CALIBRATION_RGB.length;
    c.height = 1;
    const x = c.getContext('2d', { willReadFrequently: true });
    if (x && 'filter' in x) {
      x.filter = filter;
      CALIBRATION_RGB.forEach(([r, g, b], i) => {
        x.fillStyle = `rgb(${r}, ${g}, ${b})`;
        x.fillRect(i, 0, 1, 1);
      });
      const got = x.getImageData(0, 0, CALIBRATION_RGB.length, 1).data;
      const fx = compileFilterOps(parseFilterChain(filter));
      ok = CALIBRATION_RGB.every(([r, g, b], i) => {
        const want = fx(r, g, b);
        return want.every((v, k) => Math.abs(v - got[i * 4 + k]) <= 3);
      });
    }
    c.width = c.height = 0;
  } catch {
    ok = false;
  }
  ctxFilterTrust.set(filter, ok);
  return ok;
}

/** Pixels filtered per slice before yielding back to the main thread (~5-10ms on mid phones). */
const FILTER_SLICE_PX = 120_000;

/** Let input/rendering run between slices (scheduler.yield when available). */
function yieldToMain(): Promise<void> {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (s?.yield) return s.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** Thrown when a newer bake superseded this one (or the host was destroyed). */
export class BakeAborted extends Error {}

/**
 * Draws the image object-fit:cover with the atmos filter applied: ctx.filter
 * when it is calibrated to match CSS, otherwise the spec matrices per pixel,
 * sliced so no single task blocks input.
 */
async function drawFilteredImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  filter: string,
  boxW: number,
  boxH: number,
  scale: number,
  aborted: () => boolean
): Promise<void> {
  const r = coverRect(img.naturalWidth, img.naturalHeight, boxW, boxH);

  if (ctxFilterMatchesCss(filter)) {
    ctx.globalAlpha = IMG_OPACITY;
    ctx.filter = filter;
    ctx.drawImage(img, r.x, r.y, r.w, r.h);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    return;
  }

  // Exact path: filter the opaque pixels with the spec matrices on a scratch
  // canvas, then draw at 0.6 — same order as CSS (filter first, opacity after).
  const scratch = document.createElement('canvas');
  try {
    scratch.width = Math.round(boxW * scale);
    scratch.height = Math.round(boxH * scale);
    const sctx = scratch.getContext('2d', { willReadFrequently: true });
    if (!sctx) throw new Error('2d context unavailable');
    sctx.setTransform(scale, 0, 0, scale, 0, 0);
    sctx.drawImage(img, r.x, r.y, r.w, r.h);

    const run = compileFilterInPlace(parseFilterChain(filter));
    const rows = Math.max(1, Math.floor(FILTER_SLICE_PX / scratch.width));
    for (let y = 0; y < scratch.height; y += rows) {
      const h = Math.min(rows, scratch.height - y);
      const slice = sctx.getImageData(0, y, scratch.width, h);
      run(slice.data);
      sctx.putImageData(slice, 0, y);
      await yieldToMain();
      if (aborted()) throw new BakeAborted();
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = IMG_OPACITY;
    ctx.drawImage(scratch, 0, 0);
    ctx.restore();
  } finally {
    scratch.width = scratch.height = 0;
  }
}

export interface BakeGeometry {
  /** Parallax layer box in CSS px (viewport + 2·pad). */
  layerW: number;
  layerH: number;
  /** Viewport inside the layer (the depth gradient is viewport-anchored). */
  viewW: number;
  viewH: number;
  pad: number;
  /** Bitmap px per CSS px. */
  scale: number;
}

/**
 * Bakes the static stack ONCE into `target`, reproducing the live CSS layers in
 * order inside the isolated group of `.cosmic-bg`:
 *   1. nebula image, filtered, opacity 0.6
 *   2. .parallax-img-overlay  — mix-blend-mode: color, hsla(264 80% 42% / veil)
 *   3. .cool-veil             — mix-blend-mode: color, same color
 *   4. .overlay-depth         — mix-blend-mode: screen, ellipse gradient to the void
 * The group is then composited (normal) over the body background, so the
 * result is opaque and the compositor never re-blends it per frame.
 */
export async function bakeAtmosphere(
  target: HTMLCanvasElement,
  img: HTMLImageElement,
  tokens: AtmosBakeTokens,
  g: BakeGeometry,
  aborted: () => boolean = () => false
): Promise<void> {
  const bw = Math.max(1, Math.round(g.layerW * g.scale));
  const bh = Math.max(1, Math.round(g.layerH * g.scale));

  // Blends must run against a TRANSPARENT backdrop (the stacking context is an
  // isolated group), so the group is built on a scratch canvas with alpha.
  const group = document.createElement('canvas');
  try {
    group.width = bw;
    group.height = bh;
    await composeGroup(group, img, tokens, g, aborted);

    // Final: opaque bitmap = body background + group (normal). Written in ONE
    // synchronous step, so the visible canvas never paints half-baked or cleared.
    if (aborted()) throw new BakeAborted();
    target.width = bw;
    target.height = bh;
    const out = target.getContext('2d', { alpha: false });
    if (!out) throw new Error('2d context unavailable');
    out.fillStyle = tokens.bg;
    out.fillRect(0, 0, bw, bh);
    out.drawImage(group, 0, 0);
  } finally {
    group.width = group.height = 0; // release the scratch memory now
  }
}

async function composeGroup(
  group: HTMLCanvasElement,
  img: HTMLImageElement,
  tokens: AtmosBakeTokens,
  g: BakeGeometry,
  aborted: () => boolean
): Promise<void> {
  const ctx = group.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.setTransform(g.scale, 0, 0, g.scale, 0, 0);

  await drawFilteredImage(ctx, img, tokens.filter, g.layerW, g.layerH, g.scale, aborted);

  if (tokens.coolVeil > 0) {
    ctx.globalCompositeOperation = 'color';
    ctx.fillStyle = `hsla(${COOL_VEIL_HSL}, ${tokens.coolVeil})`;
    ctx.fillRect(0, 0, g.layerW, g.layerH); // .parallax-img-overlay
    ctx.fillRect(0, 0, g.layerW, g.layerH); // .cool-veil
  }

  // .overlay-depth — explicit rgba(void, 0) instead of `transparent` so the
  // canvas (unpremultiplied) interpolation matches CSS (premultiplied).
  const e = depthEllipse(g.viewW, g.viewH);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(g.pad + e.cx, g.pad + e.cy);
  ctx.scale(e.rx, e.ry);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  grad.addColorStop(0, `rgba(${tokens.voidRgb}, 0)`);
  grad.addColorStop(0.2, `rgba(${tokens.voidRgb}, 0)`);
  grad.addColorStop(0.6, `rgba(${tokens.voidRgb}, 0.8)`);
  grad.addColorStop(1, `rgba(${tokens.voidRgb}, 0.9)`);
  ctx.fillStyle = grad;
  const ox = (g.pad + e.cx) / e.rx;
  const oy = (g.pad + e.cy) / e.ry;
  ctx.fillRect(-ox, -oy, g.layerW / e.rx, g.layerH / e.ry);
  ctx.restore();
}
