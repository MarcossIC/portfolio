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
  /**
   * Longest the loop waits for the shaders to compile in the background before it
   * starts anyway (and compiles them on the first frame, as it did before).
   * It only matters when the parallel-compile extension never reports "ready".
   * Kept well under hero-galaxy's `FIRST_FRAME_TIMEOUT_MS` (a spec checks it), so
   * a stuck compile still gets its first frame on screen before the fallback.
   */
  compileTimeoutMs: 1500,
} as const;

// ---- Adaptive resolution ----

/**
 * The governor lowers the drawing-buffer pixel ratio when the galaxy can't hold
 * ~60fps and raises it back once frames are on time again. Fill-rate is the only
 * real cost of this scene, and it scales with the square of the pixel ratio.
 *
 * It only sees the gaps between rendered rAF frames, and those are quantized to
 * the display's vsync: a frame is either on time or one vsync late. So it counts
 * late frames per window instead of averaging milliseconds, and it can't tell
 * "on budget" from "well under budget" — going back up is a probe that is undone
 * if it fails. Stars keep their apparent size: `uSize` follows the pixel ratio.
 */
export const QUALITY = {
  /** Lowest pixel ratio the governor may drop to. Soft glow points still read fine at 1x on desktop. */
  minPixelRatio: { mobile: 0.75, desktop: 1 },
  /** Each notch multiplies the pixel ratio by this: ≈28% fewer pixels per notch down. */
  step: 0.85,
  /**
   * A rendered frame is late when it comes more than this after the previous one.
   * Between the healthy gaps (16.7ms at 60/120Hz, 20ms on 100Hz where the cap
   * renders every other vsync) and the late ones (33.3ms at 60Hz, 22.2ms at 90Hz,
   * 25ms at 120Hz). At 144Hz a 20.8ms gap (48fps) counts as on time.
   */
  slowFrameMs: 21.5,
  /** Gaps longer than this are stalls (tab switch, breakpoint, a long task), not GPU load: dropped. */
  stallMs: 250,
  /** Rendered frames per evaluation window, ~0.5s at 60fps. */
  windowFrames: 30,
  /** Frames ignored after the loop starts or resumes: shader warm-up, tab-switch catch-up. */
  warmupFrames: 45,
  /** Frames ignored after a pixel-ratio change or a resize: the buffer reallocation hitch. */
  settleFrames: 10,
  /** A window is over budget when more than this share of its frames is late (~50fps or worse). */
  overShare: 0.2,
  /** A window is calm when at most this share is late: one late frame in a window is a blip. */
  calmShare: 0.04,
  /** Over-budget windows in a row before stepping down. A GC pause only ever spoils one. */
  downWindows: 2,
  /** Calm windows in a row (~4s) before probing one notch up. */
  upWindows: 8,
  /** Extra windows to wait before probing a notch that failed; doubles on each failure. */
  probeBackoff: { initial: 8, max: 240 },
  /**
   * Least drop in the late-frame share a step down must buy. Under iOS Low Power
   * Mode, Chrome's Energy Saver or a CPU-bound page the rAF cadence is ~30fps at
   * any resolution, and dropping pixels would only blur the stars.
   */
  minGain: 0.1,
  /** Useless steps down in a row before giving up: the resolution is restored and held. */
  maxIneffectiveSteps: 2,
  /**
   * Windows without any step down after giving up (240 ≈ 2-4 min); doubles each
   * time, so a throttled device sees one short dip, not a resolution that pumps.
   */
  hold: { initial: 240, max: 1920 },
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
  /**
   * Portrait framing. Backing the camera off to fit the whole spiral on a phone
   * left a tiny speck sitting on the hero copy, so portrait goes the other way:
   * a closer camera (the rim bleeds past the sides, cinematic crop), the image
   * lifted so the core sits above the name, and a dimmer galaxy so copy over the
   * arms keeps its contrast. It blends in smoothly (smoothstep) as the canvas
   * aspect drops from `minAspect` to `aspect`; at `minAspect` and wider nothing changes.
   */
  portrait: {
    /** Canvas aspect (width / height) at and below which the full portrait framing applies: phones and portrait tablets. */
    aspect: 0.75,
    /**
     * Camera distance as a multiple of `CAMERA.offset`. 1 is the desktop distance:
     * the narrow portrait view then crops the spiral to its core and inner arms.
     * Going below ~0.9 brings the near rim so close its stars balloon into blobs.
     */
    zoom: 1,
    /**
     * Telephoto magnification (narrower FOV): a bigger galaxy with no close-up
     * distortion. Star sizes scale with it, so it reads as a crop of the same image.
     */
    magnify: 1.4,
    /** Image lift as a fraction of the canvas height (a lens shift: the perspective doesn't change). Puts the core above the name. */
    lift: 0.21,
    /** Brightness multiplier for the stars and the core glow. */
    brightness: 0.8,
    /**
     * Extra disc tilt toward the viewer, radians, added to `GALAXY.tilt.x`. The
     * desktop view grazes the disc at ~10°, which reads as a flat band on a narrow
     * screen; tilting the near rim down opens the spiral arms up. 0 keeps the desktop angle.
     */
    tilt: 0.35,
  },
  /**
   * Landscape phones. The hero copy is a centered column and the viewport is too
   * short to lift the core above it, so the default framing parked the bright core
   * right on the name and the role text (~1:1 contrast). Instead the image slides
   * sideways (a horizontal lens shift, like the portrait `lift`) so the core sits
   * in the empty band right of the copy, and the copy keeps dim arms behind it.
   *
   * Detected by viewport, not canvas aspect: the hero's height depends on how much
   * copy fits, so the canvas aspect on these screens is anything from ~1 to ~2.4.
   * Replaces the portrait blend there; desktop, tablets and portrait phones never
   * get here.
   */
  shortLandscape: {
    /** Same breakpoint as the hero CSS: `(orientation: landscape) and (max-height: 500px)`. */
    maxHeightPx: 500,
    /** Image shift to the right, as a fraction of the canvas width: 0.32 puts the core at ~82% of the width. */
    shift: 0.32,
    /** Telephoto magnification: slightly bigger, so it reads as a deliberate side element and not a speck. */
    magnify: 1.15,
    /** Image lift as a fraction of the canvas height. */
    lift: 0,
    /** Brightness multiplier: the inner arms still cross the copy. */
    brightness: 0.8,
  },
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
  /**
   * Ignition: when the first frame shows, the core flares (fast attack, slower
   * release, peak at a third of `durationMs`) so the galaxy reads as switching on
   * rather than just fading in. `scale` is the extra core size at the peak, as a
   * fraction. `opacity` is extra core opacity at the peak, as a multiple of
   * `core.opacity`, added on top of the intro fade (not scaled by it): the core
   * lights up while the arms are still faint. 0 and 0 turn it off.
   */
  ignition: { durationMs: 600, scale: 0.5, opacity: 1.5 },
  /** Wide, faint glow around the core. */
  halo: { scale: 6.5, opacity: 0.06 },
  /**
   * Sprite fragments whose alpha (texture × opacity) is under this are discarded
   * instead of blended. The halo quad covers ~half the screen and its corners are
   * fully transparent; at 1/1024 a skipped pixel adds under 1/4 of an 8-bit step,
   * so nothing visible is lost — only the blending work.
   */
  alphaTest: 1 / 1024,
} as const;

// ---- Motion ----

export const MOTION = {
  /** Intro progress per second: fade-in and zoom settle in ~1.8s. */
  introRate: 0.55,
  /** The intro grows the disc from this scale up to 1. */
  introStartScale: 0.78,
  /** Shader clock on the first frame. Starting mid-spin means the arms already show differential winding. */
  startTime: 6,
  /** Nebula ⇄ Ember blend rate: ~95% of the way in ~0.6s. */
  paletteRate: 5,
  /** The blend snaps onto its target this close to it (invisible), so the glow tint stops being recomputed. */
  paletteSnap: 0.001,
  /**
   * Mouse parallax: rig rotation across the full viewport width (yaw) and height (pitch).
   * The pointer at an edge gets half of it. `rate` sets how fast the rig catches up.
   */
  parallax: { yaw: 0.16, pitch: 0.1, rate: 3 },
  /** Scroll distance, in viewport heights, over which the galaxy fades out. */
  fadeDistance: 0.9,
  /**
   * Scroll-linked depth. As the hero scrolls away (progress 0 → 1 over
   * `fadeDistance`) the galaxy recedes instead of only fading: the camera dollies
   * back, the disc tips a little toward the viewer, and the image lags behind the
   * page like a distant plane. It is smoothed per frame (dt-based, like the
   * parallax), so it glides even when scroll events arrive in bursts, and it
   * reverses the same way on the way back up. At the top of the page all three
   * are exactly 0: the framing is untouched.
   */
  scrollDepth: {
    /** Extra camera distance at full progress, as a fraction of the framed distance (eased). */
    dolly: 0.3,
    /** Extra disc tilt toward the viewer at full progress, radians (eased). */
    tilt: 0.16,
    /**
     * Image lag as a fraction of the scrolled distance (linear, so it moves like a
     * plane further away): 0.5 → the galaxy scrolls at half the page speed.
     */
    lag: 0.5,
    /** How fast the smoothed progress catches up with the scroll position, per second. */
    rate: 5,
    /** The smoothed progress snaps onto the scroll position this close to it, so the camera stops being updated. */
    snap: 0.0005,
  },
  /** Opacity under which the loop stops, since nothing visible is left to draw. */
  stopOpacity: 0.01,
} as const;
