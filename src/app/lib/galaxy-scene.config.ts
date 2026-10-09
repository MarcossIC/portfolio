/**
 * Tuning knobs for the hero galaxy (`galaxy-scene.ts`).
 *
 * Pure data with no three.js import: the look is tweaked here without touching
 * the render engine. Values were tuned by eye in the prototype; each comment says
 * what the value controls and how a change shows up on screen.
 *
 * Units: three.js world units for distances, radians for angles, and "per second"
 * for rates and speeds, unless a name says otherwise (`Px`, `Ms`).
 */
import type { Atmos } from '@app/services/atmosphere.service';

/** A palette stop: position along the radius (0 = core, 1 = rim) and its color. */
export type GradientStop = readonly [t: number, hex: string];

export interface Palette {
  /** Star colors from core to rim. */
  readonly arms: readonly GradientStop[];
  /** Tint of the small glow sprite at the center. */
  readonly core: string;
  /** Tint of the wide, faint glow around the core. */
  readonly halo: string;
}

// ---- Atmosphere ----

/**
 * AtmosphereService marks Ember with `data-atmos="ember"` on <html>. These values
 * repeat it on purpose, because importing the service would pull Angular into
 * this framework-free chunk. Only the `Atmos` type is imported, and types are erased.
 */
export const ATMOS_ATTRIBUTE = 'data-atmos';
export const WARM_ATMOS: Atmos = 'ember';

/** Brand palettes. The scene blends between them when the atmosphere toggles. */
export const PALETTES = {
  // Warm white → flame red → violet → stellar blue.
  nebula: {
    arms: [
      [0, '#fff1e2'],
      [0.16, '#e8452c'],
      [0.55, '#b565fd'],
      [1, '#5677d8'],
    ],
    core: '#ff5b3a',
    halo: '#8b5cf6',
  },
  // Warm white → orange → flame red → deep wine.
  ember: {
    arms: [
      [0, '#fff3e0'],
      [0.2, '#ff7a3d'],
      [0.55, '#e8452c'],
      [1, '#7c2d55'],
    ],
    core: '#ff9256',
    halo: '#d43a2a',
  },
} as const satisfies Record<Atmos, Palette>;

// ---- Device budget ----

export const DEVICE = {
  /** Viewports narrower than this get the mobile budget (Tailwind's `md`). */
  mobileBreakpointPx: 768,
  /** devicePixelRatio cap. On a soft glow the extra pixels past ~2x aren't visible but still cost fill-rate. */
  maxPixelRatio: { mobile: 1.8, desktop: 2 },
  /** Number of stars. */
  particleCount: { mobile: 9_000, desktop: 22_000 },
  /** Point-size multiplier. */
  pointScale: { mobile: 0.85, desktop: 1 },
} as const;

// ---- Render loop ----

export const LOOP = {
  /** Most time one frame may advance, so a tab switch or a breakpoint doesn't make the animation jump. */
  maxFrameMs: 50,
  /**
   * Minimum time between rendered frames. It sits just under the 90Hz frame time:
   * 60Hz and 90Hz render every frame, 120Hz runs at 60fps and 144Hz at 72fps. A slow
   * galaxy gains nothing from high refresh rates; the GPU would only do twice the work.
   */
  minFrameMs: 1000 / 95,
} as const;

// ---- Camera & framing ----

export const CAMERA = {
  /** Vertical field of view, degrees. */
  fov: 52,
  near: 0.1,
  far: 60,
  /** Point the camera looks at. */
  target: [0, 0.5, 0],
  /** Camera position relative to `target`: more z → smaller galaxy, more y → steeper view. */
  offset: [0, 3.1, 6.6],
} as const;

export const FRAMING = {
  /** Aspect below which the camera starts backing off. The FOV is vertical, so portrait screens crop the sides. */
  minAspect: 1.1,
  /** Furthest a portrait screen may pull the camera back, as a multiple of `CAMERA.offset`. */
  maxZoomOut: 2.4,
  /** Height-only shrink (px) a touch device absorbs without resizing. Covers the mobile URL bar showing back up mid-scroll. */
  touchHeightSlackPx: 160,
} as const;

// ---- Galaxy shape ----

export const GALAXY = {
  /** Disc radius. */
  radius: 5.8,
  /** Number of spiral arms. */
  arms: 3,
  /** Twist per unit of radius: higher → arms wind tighter. */
  curl: 0.9,
  /** Off-arm scatter as a fraction of the radius: higher → thicker, fuzzier arms. */
  spread: 0.33,
  /** Vertical scatter relative to in-plane scatter, i.e. the disc's thickness. */
  thickness: 0.26,
  /** Exponent on the radial distribution: above 1 packs more stars toward the core. */
  coreDensity: 1.6,
  /** Exponent on the scatter: higher → most stars hug their arm and only a few stray far. */
  scatterFalloff: 3,
  /** Keeps stars off the exact center, where the shader's `atan(z, x)` is undefined. */
  minRadius: 0.05,
  /** Base star size, random in [min, min + range]. */
  starSize: { min: 0.5, range: 1.3 },
  /** Stars within `extent` (fraction of the radius) are drawn `sizeBoost` times bigger: the bright bulge. */
  bulge: { extent: 0.15, sizeBoost: 1.7 },
  /** Disc tilt, so it reads in perspective. */
  tilt: { x: -0.18, z: 0.1 },
  /** Height of the core above the hero's center. Raise it if the galaxy covers the role text. */
  centerY: 1.25,
  /** Slow rotation of the whole disc, about one turn every 5 minutes. */
  driftSpeed: 0.02,
} as const;

// ---- Particle shader (injected as #defines) ----

export const SHADER = {
  /** Base speed of the differential rotation: inner rings orbit faster than the rim. */
  spin: 0.32,
  /** Angular speed is `spin / (r + this)`. It stops the very center from whirling. */
  spinCoreSoftening: 0.35,
  /** Perspective size: point size (px) = star size × this / distance to the camera. */
  pointPerspective: 27,
  /** Size twinkle: each star pulses between (1 − 2·depth) and 1 of its size. */
  twinkle: { depth: 0.28, speed: 1.7 },
  /**
   * Brightness flicker, same shape: alpha between (1 − 2·depth) and 1.
   * `phaseScale` keeps it out of step with the size twinkle.
   */
  flicker: { depth: 0.4, speed: 1.3, phaseScale: 1.7 },
  /** Overall particle intensity. */
  alpha: 0.72,
  /** Glow falloff exponent of each point: higher → harder, smaller dots. */
  glowFalloff: 2.2,
} as const;

// ---- Core glow sprites ----

export const CORE_GLOW = {
  /** Resolution of the radial glow texture, px. */
  textureSize: 256,
  /** Alpha profile of that texture, as [radius 0–1, alpha]: hot center, soft shoulder, transparent edge. */
  profile: [
    [0, 1],
    [0.25, 0.55],
    [1, 0],
  ],
  /** Small bright glow: breathes in size (`pulse`) and flickers in opacity. */
  core: { scale: 2, opacity: 0.2, flicker: 0.04, flickerSpeed: 1.9, pulse: 0.05, pulseSpeed: 1.4 },
  /** Wide, faint glow around the core. */
  halo: { scale: 6.5, opacity: 0.06 },
} as const;

// ---- Motion ----

export const MOTION = {
  /** Intro progress per second: fade-in and zoom settle in ~1.8s. */
  introRate: 0.55,
  /** The intro grows the disc from this scale up to 1. */
  introStartScale: 0.78,
  /** Shader clock on the first frame. Starting mid-spin means the arms already show differential winding. */
  startTime: 6,
  /** Shader clock for the still frame painted under reduced motion. */
  stillTime: 9,
  /** Nebula ⇄ Ember blend rate: ~95% of the way in ~0.6s. */
  paletteRate: 5,
  /**
   * Mouse parallax: rig rotation across the full viewport width (yaw) and height (pitch).
   * The pointer at an edge gets half of it. `rate` sets how fast the rig catches up.
   */
  parallax: { yaw: 0.16, pitch: 0.1, rate: 3 },
  /** Scroll distance, in viewport heights, over which the galaxy fades out. */
  fadeDistance: 0.9,
  /** Opacity under which the loop stops, since nothing visible is left to draw. */
  stopOpacity: 0.01,
} as const;
