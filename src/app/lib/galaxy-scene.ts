import * as THREE from 'three';
import {
  ATMOS_ATTRIBUTE,
  CAMERA,
  CORE_GLOW,
  DEVICE,
  FRAMING,
  GALAXY,
  LOOP,
  MOTION,
  PALETTES,
  QUALITY,
  SHADER,
  WARM_ATMOS,
  type GradientStop,
} from './galaxy-scene.config';

interface Size {
  w: number;
  h: number;
}

const TAU = Math.PI * 2;
const MS_PER_SECOND = 1000;
/** Components per vertex in the position and color buffers (xyz / rgb). */
const VEC3 = 3;

/** Camera distance multiplier so portrait screens still frame the spiral, not just its core. */
export function zoomOutFor(aspect: number): number {
  return Math.min(FRAMING.maxZoomOut, Math.max(1, FRAMING.minAspect / aspect));
}

export interface Framing {
  /** Camera distance as a multiple of `CAMERA.offset`. */
  readonly zoom: number;
  /** Telephoto magnification (camera.zoom); point sizes scale with it. */
  readonly magnify: number;
  /** Image lift, as a fraction of the canvas height. */
  readonly lift: number;
  /** Image shift to the right, as a fraction of the canvas width. */
  readonly shift: number;
  /** Multiplier on the galaxy's opacity. */
  readonly brightness: number;
  /** Extra disc tilt toward the viewer, radians, on top of `GALAXY.tilt.x`. */
  readonly tilt: number;
}

/** Hermite smoothstep on [0, 1], clamped: flat at both ends, so blends start and settle without a kink. */
export function smoothstep(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/** How far the hero has scrolled away: 0 at the top, 1 after `MOTION.fadeDistance` viewport heights. */
export function scrollProgress(scrollY: number, viewportH: number): number {
  return Math.min(1, Math.max(0, scrollY / (Math.max(1, viewportH) * MOTION.fadeDistance)));
}

/**
 * Flare envelope for the core's ignition, `t` seconds after the first frame:
 * 0 outside (0, duration), peaking at exactly 1 a third of the way in. The
 * x·(1−x)² shape gives a fast attack and a slower release.
 */
export function ignition(t: number, duration: number): number {
  const x = t / duration;
  if (!(x > 0 && x < 1)) return 0;
  const rest = 1 - x;
  return 6.75 * x * rest * rest; // 27/4 normalizes the peak at x = 1/3 to 1
}

/** A phone on its side: landscape (CSS calls a square portrait) and no taller than the hero CSS breakpoint. */
export function isShortLandscape(viewport: Size): boolean {
  return viewport.w > viewport.h && viewport.h <= FRAMING.shortLandscape.maxHeightPx;
}

/**
 * Framing by canvas aspect: the original zoom-out on landscape, blending smoothly
 * into `FRAMING.portrait` as the canvas turns portrait. A short landscape
 * viewport (phone on its side) gets `FRAMING.shortLandscape` instead, whatever
 * the canvas aspect. Runs on resize only.
 */
export function framingFor(aspect: number, viewport?: Size): Framing {
  if (viewport && isShortLandscape(viewport)) {
    const l = FRAMING.shortLandscape;
    return {
      zoom: zoomOutFor(aspect),
      magnify: l.magnify,
      lift: l.lift,
      shift: l.shift,
      brightness: l.brightness,
      tilt: 0,
    };
  }
  const p = FRAMING.portrait;
  const t = smoothstep((FRAMING.minAspect - aspect) / (FRAMING.minAspect - p.aspect));
  // a·(1−t) + b·t lands exactly on both ends: landscape stays bit-identical.
  const mix = (a: number, b: number) => a * (1 - t) + b * t;
  return {
    zoom: mix(zoomOutFor(aspect), p.zoom),
    magnify: mix(1, p.magnify),
    lift: mix(0, p.lift),
    shift: 0,
    brightness: mix(1, p.brightness),
    tilt: mix(0, p.tilt),
  };
}

/** Seconds since the last rendered frame, clamped to [0, LOOP.maxFrameMs]. */
export function frameDelta(now: number, last: number): number {
  return Math.min(Math.max(now - last, 0), LOOP.maxFrameMs) / MS_PER_SECOND;
}

/**
 * Whether this rAF callback should draw. Full rate draws every vsync (the galaxy and
 * the cursor then share a cadence). The half-rate fallback draws every 2nd one,
 * decided by counting vsyncs (`vsyncIndex` = rAF callbacks since the loop started),
 * never by a millisecond threshold: that would drift against the refresh rate.
 */
export function isFrameDue(vsyncIndex: number, halfRate: boolean): boolean {
  return !halfRate || vsyncIndex % 2 === 0;
}

/**
 * Whether the draw loop may start. Besides the shader gate it waits for the vsync
 * estimate: measured from the loop's own gaps, a GPU that can't make a frame per
 * vsync gets rAF throttled to its production rate, every gap reads as 2 vsyncs, and
 * the governor would never see a late frame. The probe (rAF callbacks with no draw)
 * measures the display first; after `maxProbeCallbacks` the loop starts regardless.
 */
export function loopMayStart(
  gateSettled: boolean,
  vsyncKnown: boolean,
  probeCallbacks: number,
  maxProbeCallbacks: number,
): boolean {
  return gateSettled && (vsyncKnown || probeCallbacks >= maxProbeCallbacks);
}

/**
 * Whether the draw-less vsync probe should be running: only while the scene is due
 * (visible, on screen: an inactive scene does no rAF work), not drawing yet, and
 * the vsync is still unknown within the callback cap.
 */
export function vsyncProbeWanted(
  due: boolean,
  running: boolean,
  vsyncKnown: boolean,
  probeCallbacks: number,
  maxProbeCallbacks: number,
): boolean {
  return due && !running && !vsyncKnown && probeCallbacks < maxProbeCallbacks;
}

export interface FrameStepDeps {
  readonly governor: Pick<QualityGovernor, 'halfRate' | 'sample'>;
  /** Reallocates the drawing buffer at the governor's ratio (clears it!). */
  applyPixelRatio(): void;
  render(now: number): void;
}

/**
 * One rAF callback of the draw loop, with the order that matters: a pending buffer
 * reallocation is applied at the START of a frame that is about to draw, never after
 * the draw. `setPixelRatio` reassigns `canvas.width`, which clears the drawing buffer;
 * done after `render` the browser would present that empty buffer (the galaxy blinks).
 * `sample()` only DECIDES; the change waits for the next frame that actually draws
 * (a skipped half-rate vsync keeps it pending). Allocation-free.
 */
export function createFrameStep(deps: FrameStepDeps) {
  let dirty = false;
  return {
    /** Something outside the loop changed the ratio (devicePixelRatio): apply before the next draw. */
    markDirty(): void {
      dirty = true;
    },
    /** Returns true when this callback drew. `last` is the previous drawn frame's timestamp. */
    run(vsyncIndex: number, now: number, last: number): boolean {
      if (!isFrameDue(vsyncIndex, deps.governor.halfRate)) return false;
      const gap = now - last;
      if (dirty) {
        dirty = false;
        deps.applyPixelRatio();
      }
      deps.render(now);
      if (deps.governor.sample(gap)) dirty = true;
      return true;
    },
  };
}

export interface ResizeRedrawState {
  /** `fit()` reallocated the drawing buffer (an absorbed change leaves it alone). */
  readonly resized: boolean;
  /** The draw loop is on (visible, in view, shaders ready). */
  readonly running: boolean;
  /** The first frame was already drawn and reported. */
  readonly presented: boolean;
  readonly disposed: boolean;
  readonly broken: boolean;
}

/**
 * Whether to redraw the CURRENT state right after a resize. `setSize` clears the
 * drawing buffer, and the ResizeObserver runs after the rAF draw and before paint,
 * so without a redraw in that same callback the cleared buffer is what gets presented.
 * Paused scenes don't draw (the loop draws first thing on resume); before the first
 * frame the loop's own draw has to be the one that reports the presentation.
 */
export function shouldRedrawOnResize(s: ResizeRedrawState): boolean {
  return s.resized && s.running && s.presented && !s.disposed && !s.broken;
}

/**
 * Width changes and height growth always resize; a height-only shrink within
 * `slack` is absorbed — the canvas overflows the host and gets clipped instead.
 */
export function needsResize(buffer: Size, next: Size, slack: number): boolean {
  if (next.w !== buffer.w || next.h > buffer.h) return true;
  return buffer.h - next.h > slack;
}

/** GLSL float literal: GLSL has no implicit int → float, so `27` must be written `27.0`. */
export function glslFloat(value: number): string {
  return Number.isInteger(value) ? value.toFixed(1) : String(value);
}

/**
 * Frame-rate independent exponential approach toward `target`, snapped onto it
 * once within `snap`. Landing exactly on the target is what lets the caller skip
 * work while nothing changes.
 */
export function approach(current: number, target: number, rate: number, dt: number, snap: number): number {
  const next = current + (target - current) * Math.min(1, dt * rate);
  return Math.abs(target - next) < snap ? target : next;
}

/** Resolves when `work` settles — fulfilled or rejected — or after `ms`, whichever comes first. Never rejects. */
export function settleWithin(work: Promise<unknown>, ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    work.then(done, done);
  });
}

/** Governor tuning; `QUALITY` in the config is the production value. */
export interface QualityConfig {
  readonly step: number;
  readonly lateVsyncs: number;
  readonly stallMs: number;
  readonly vsyncMinMs: number;
  readonly vsyncMaxMs: number;
  readonly vsyncWindow: number;
  readonly vsyncMinSamples: number;
  readonly vsyncEvery: number;
  readonly vsyncPercentile: number;
  readonly vsyncTolerance: number;
  readonly vsyncRiseMs: number;
  readonly windowMs: number;
  readonly minWindowFrames: number;
  readonly warmupFrames: number;
  readonly settleFrames: number;
  readonly overShare: number;
  readonly calmShare: number;
  readonly downWindows: number;
  readonly upWindows: number;
  readonly probeBackoff: { readonly initial: number; readonly max: number };
  readonly recentFailWindows: number;
  readonly minProbeGain: number;
  readonly minGain: number;
  readonly maxIneffectiveSteps: number;
  readonly hold: { readonly initial: number; readonly max: number };
}

export interface VsyncEstimator {
  /** Estimated vsync interval in ms; 0 until `ready`. */
  readonly ms: number;
  readonly ready: boolean;
  /** Feeds the gap (ms) between two consecutive rAF callbacks (every vsync, drawn or not). */
  observe(gapMs: number): void;
  /** Forgets everything (the window moved to another monitor). */
  reset(): void;
}

/**
 * Measures the display's vsync interval from rAF gaps: a low percentile of the last
 * `vsyncWindow` valid gaps. Late frames are longer gaps, so they don't inflate it.
 * Gaps outside [`vsyncMinMs`, `stallMs`] are not vsyncs and are dropped. It follows a
 * faster display at once and a slower one only after `vsyncRiseMs` of consistent
 * evaluations (so GPU load can't retune it before the governor reacts); the result
 * is clamped to `vsyncMaxMs`. Preallocated buffers, no allocation per call.
 */
export function createVsyncEstimator(cfg: QualityConfig): VsyncEstimator {
  const ring = new Float64Array(cfg.vsyncWindow);
  const scratch = new Float64Array(cfg.vsyncWindow);
  let head = 0;
  let count = 0;
  let since = 0;
  let estimate = 0;
  let rise = 0; // ms the evaluations have consistently read a longer vsync
  let span = 0; // ms of valid gaps since the last evaluation

  const evaluate = () => {
    // Insertion sort of a copy: at most vsyncWindow items, once every `vsyncEvery` gaps.
    for (let i = 0; i < count; i++) {
      const v = ring[i];
      let j = i - 1;
      while (j >= 0 && scratch[j] > v) {
        scratch[j + 1] = scratch[j];
        j--;
      }
      scratch[j + 1] = v;
    }
    const raw = scratch[Math.min(count - 1, Math.floor(count * cfg.vsyncPercentile))];
    const next = Math.min(Math.max(raw, cfg.vsyncMinMs), cfg.vsyncMaxMs);
    if (estimate === 0) {
      estimate = next;
      return;
    }
    if (next < estimate * (1 - cfg.vsyncTolerance)) {
      estimate = next;
      rise = 0;
    } else if (next > estimate * (1 + cfg.vsyncTolerance)) {
      rise += span;
      if (rise >= cfg.vsyncRiseMs) {
        estimate = next;
        rise = 0;
      }
    } else {
      rise = 0;
    }
  };

  return {
    get ms() {
      return estimate;
    },
    get ready() {
      return estimate > 0;
    },
    observe(gapMs) {
      if (!(gapMs >= cfg.vsyncMinMs) || gapMs > cfg.stallMs) return;
      ring[head] = gapMs;
      head = (head + 1) % ring.length;
      if (count < ring.length) count++;
      span += gapMs;
      if (++since >= cfg.vsyncEvery && count >= cfg.vsyncMinSamples) {
        since = 0;
        evaluate();
        span = 0;
      }
    },
    reset() {
      head = count = since = rise = span = 0;
      estimate = 0;
    },
  };
}

export interface QualityGovernor {
  /** Pixel ratio the drawing buffer should use now. */
  readonly ratio: number;
  /** True while the loop should draw only every 2nd vsync (last resort at the floor). */
  readonly halfRate: boolean;
  /** Current vsync estimate in ms (0 until measured). */
  readonly vsyncMs: number;
  /** Feeds the gap (ms) since the previous rAF callback, on EVERY vsync, drawn or not. */
  observeVsync(gapMs: number): void;
  /**
   * Feeds the gap (ms) since the previous rendered frame. Returns true when `ratio`
   * changed (a `halfRate` change needs no buffer reallocation).
   */
  sample(gapMs: number): boolean;
  /** Ignores at least the next `frames` samples (loop resumed, canvas resized). */
  rewarm(frames?: number): void;
  /** New device cap (devicePixelRatio changed): starts over from it. Returns true when `ratio` changed. */
  setCap(cap: number): boolean;
}

/**
 * Adaptive resolution: steps the pixel ratio down a notch while frames keep
 * coming late (more than `lateVsyncs` measured vsyncs after the previous one), and
 * probes back up after a calm stretch. When already at the floor and still over
 * budget, one last step switches to half rate. See `QUALITY` for why it counts late
 * frames instead of averaging milliseconds.
 *
 * Mutable closure state on purpose: it runs once per frame and must not allocate.
 * Pixel notches are `cap × step^level`, clamped to `floor`; the level after the
 * last notch is half rate.
 */
export function createQualityGovernor(cap: number, floor: number, cfg: QualityConfig = QUALITY): QualityGovernor {
  let maxRatio = cap;
  let minRatio = Math.min(floor, cap);
  let ladder = 0; // pixel-ratio notches
  let maxLevel = 0; // ladder + 1: the extra level is half rate
  let level = 0;
  let ratio = cap;
  const vsync = createVsyncEstimator(cfg);

  // Current window.
  let skip = cfg.warmupFrames;
  let frames = 0;
  let late = 0;
  // Window streaks.
  let over = 0;
  let overSum = 0;
  let calm = 0;
  // Probing up.
  let probing = false;
  let probeOk = 0;
  // Per notch (index = the level that was probed): windows left before it may be probed
  // again, and how many times in a row that probe failed. Sized with the ladder.
  let blockLeft = new Int32Array(0);
  let fails = new Uint8Array(0);
  let sinceFail = cfg.recentFailWindows; // windows since any probe failed: none recent
  // Giving up when stepping down does not help.
  let lastDownShare = -1;
  let ineffective = 0;
  let holdLeft = 0;
  let holdLen = cfg.hold.initial;

  const buildLadder = () => {
    // Epsilon: a floor sitting exactly on a notch must not add an empty one.
    ladder = maxRatio > minRatio ? Math.ceil(Math.log(minRatio / maxRatio) / Math.log(cfg.step) - 1e-9) : 0;
    maxLevel = ladder + 1;
    blockLeft = new Int32Array(maxLevel + 1);
    fails = new Uint8Array(maxLevel + 1);
    sinceFail = cfg.recentFailWindows;
  };
  const ratioAt = (l: number) => Math.max(minRatio, maxRatio * Math.pow(cfg.step, Math.min(l, ladder)));
  const backoffFor = (l: number) =>
    Math.min(cfg.probeBackoff.initial * Math.pow(2, fails[l]), cfg.probeBackoff.max);
  buildLadder();

  const resetStreaks = () => {
    frames = late = 0;
    over = overSum = calm = 0;
  };

  const setLevel = (next: number): boolean => {
    level = Math.min(maxLevel, Math.max(0, next));
    skip = Math.max(skip, cfg.settleFrames);
    resetStreaks();
    const r = Math.max(minRatio, maxRatio * Math.pow(cfg.step, Math.min(level, ladder)));
    if (r === ratio) return false;
    ratio = r;
    return true;
  };

  const stepDown = (share: number): boolean => {
    if (holdLeft > 0) return false;
    // Judge the previous step down by what it bought.
    if (lastDownShare >= 0) {
      ineffective = share > lastDownShare - cfg.minGain ? ineffective + 1 : 0;
      lastDownShare = -1;
    }
    // Half rate is the last step: one useless judgement is enough to take it back.
    if (ineffective >= cfg.maxIneffectiveSteps || (level >= maxLevel && ineffective > 0)) {
      // Not fill-bound (throttled rAF, busy main thread): undo the useless steps and hold.
      const restore = level - ineffective;
      ineffective = 0;
      holdLeft = holdLen;
      holdLen = Math.min(holdLen * 2, cfg.hold.max);
      return setLevel(restore);
    }
    if (level >= maxLevel) return false;
    lastDownShare = share;
    return setLevel(level + 1);
  };

  const evaluate = (share: number): boolean => {
    for (let i = 0; i < blockLeft.length; i++) if (blockLeft[i] > 0) blockLeft[i]--;
    if (sinceFail < cfg.recentFailWindows) sinceFail++;
    if (holdLeft > 0) holdLeft--;
    const isOver = share > cfg.overShare;
    if (!isOver) {
      lastDownShare = -1;
      ineffective = 0;
    }

    if (probing) {
      if (isOver) {
        // The notch above is too much: back down, and wait longer before probing THIS
        // notch again (doubling per failure of this notch).
        probing = false;
        blockLeft[level] = backoffFor(level);
        if (fails[level] < 255) fails[level]++;
        sinceFail = 0;
        return setLevel(level + 1);
      }
      if (++probeOk >= cfg.downWindows) {
        probing = false;
        fails[level] = 0; // this notch holds: its history is forgiven, the others' is not
      }
    }

    if (isOver) {
      calm = 0;
      overSum += share;
      if (++over < cfg.downWindows) return false;
      const sustained = overSum / over;
      over = overSum = 0;
      return stepDown(sustained);
    }

    over = overSum = 0;
    if (share > cfg.calmShare) {
      calm = 0;
      return false;
    }
    if (++calm < cfg.upWindows || level === 0 || probing || blockLeft[level - 1] > 0) return false;
    // Right after a failed probe only a step that is worth the risk is tried; going
    // from half rate back to full always is (it doubles the cadence).
    const worth = level > ladder || sinceFail >= cfg.recentFailWindows || ratioAt(level - 1) - ratio >= cfg.minProbeGain;
    if (!worth) return false;
    probing = true;
    probeOk = 0;
    return setLevel(level - 1);
  };

  return {
    get ratio() {
      return ratio;
    },
    get halfRate() {
      return level > ladder;
    },
    get vsyncMs() {
      return vsync.ms;
    },
    observeVsync(gapMs) {
      vsync.observe(gapMs);
    },
    sample(gapMs) {
      // Non-positive: restart stamp taken after the rAF time. Huge: a stall, not load.
      if (!(gapMs > 0) || gapMs > cfg.stallMs) return false;
      if (skip > 0) {
        skip--;
        return false;
      }
      // No vsync measured yet: nothing to compare against.
      if (!vsync.ready) return false;
      frames++;
      // At half rate a frame is on time 2 vsyncs after the previous one.
      if (gapMs > cfg.lateVsyncs * (level > ladder ? 2 : 1) * vsync.ms) late++;
      // The window is a length of time: how many frames that is depends on the display.
      const period = level > ladder ? 2 : 1;
      if (frames < Math.max(cfg.minWindowFrames, Math.round(cfg.windowMs / (period * vsync.ms)))) return false;
      const share = late / frames;
      frames = late = 0;
      return evaluate(share);
    },
    rewarm(n = cfg.warmupFrames) {
      skip = Math.max(skip, n);
      resetStreaks();
    },
    setCap(next) {
      maxRatio = next;
      minRatio = Math.min(floor, next);
      buildLadder();
      level = 0;
      vsync.reset(); // another monitor can have another refresh rate
      probing = false;
      lastDownShare = -1;
      ineffective = 0;
      holdLeft = 0;
      holdLen = cfg.hold.initial;
      skip = Math.max(skip, cfg.warmupFrames);
      resetStreaks();
      const changed = ratio !== next;
      ratio = next;
      return changed;
    },
  };
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/** What the scene reports to its host. All optional. */
export interface GalaxySceneHooks {
  /** Once, after the first frame was drawn with linked shader programs. */
  onFirstFrame?(): void;
  /**
   * Whether a frame is due right now: tab visible, container on screen, not faded
   * out by scroll. Reported right after creation, then on every change until the
   * first frame. "Not active" is the scene legitimately idling, not failing.
   */
  onActiveChange?(active: boolean): void;
  /**
   * Once, when the scene can no longer draw: the WebGL context was lost, or a
   * shader program failed to link. The loop is already stopped; the host should
   * fall back and call the cleanup.
   */
  onFailure?(reason: string): void;
}

/**
 * Spiral galaxy particle field for the hero section. Every tunable value lives
 * in `galaxy-scene.config.ts`; this module is only the mechanism.
 *
 * Framework-free on purpose: no Angular, no signals, no zone. The rAF loop lives
 * entirely outside change detection, so it cannot trigger a render pass in a
 * zoneless app. Only import this from the browser — it touches `window` at call time.
 *
 * @param container element the canvas is appended to; it drives size and visibility
 * @param hooks first-frame, activity and failure reports (see `GalaxySceneHooks`)
 * @returns a cleanup function, or `null` when WebGL is unavailable (caller falls back)
 */
export function createGalaxyScene(container: HTMLElement, hooks: GalaxySceneHooks = {}): (() => void) | null {
  // Outside the try: a failure after the context exists must still release it.
  let renderer: THREE.WebGLRenderer | undefined;
  try {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = coarsePointer || window.innerWidth < DEVICE.mobileBreakpointPx;
    const forDevice = <T>(value: { readonly mobile: T; readonly desktop: T }): T =>
      isMobile ? value.mobile : value.desktop;

    // Never 0: the camera aspect divides by them.
    const width = () => Math.max(1, container.clientWidth);
    const height = () => Math.max(1, container.clientHeight);
    const pixelRatio = () => Math.min(window.devicePixelRatio || 1, forDevice(DEVICE.maxPixelRatio));

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      // Nothing reads or writes depth (additive blending, depthWrite off, and
      // additive order doesn't matter), so the default depth buffer is pure cost:
      // memory plus a clear per frame. Stencil is off by default; stated for clarity.
      depth: false,
      stencil: false,
      // Decorative background: never wake the discrete GPU on dual-GPU laptops.
      powerPreference: 'low-power',
    });
    const gl = renderer;
    // A program that fails to link draws nothing, forever, while three keeps
    // "rendering" it. Replacing three's logger keeps the diagnostics and turns
    // the failure into a fallback. three calls this synchronously the first time
    // the program is used (compile() or the first render).
    gl.debug.onShaderError = (ctx, program, vs, fs) => {
      console.warn(
        'HeroGalaxy: shader program failed to link.',
        ctx.getProgramInfoLog(program),
        ctx.getShaderInfoLog(vs),
        ctx.getShaderInfoLog(fs)
      );
      fail('shader program failed to link');
    };
    const governor = createQualityGovernor(pixelRatio(), forDevice(QUALITY.minPixelRatio));
    gl.setPixelRatio(governor.ratio);
    // Telephoto factor of the current framing (`fit()` sets it). The shader sizes
    // points by distance only, so a narrower FOV must scale them explicitly.
    let magnify = 1;
    const pointSize = () => gl.getPixelRatio() * forDevice(DEVICE.pointScale) * magnify;
    // Height is set in px by `fit()`, not 100%: on touch devices the buffer may
    // stay taller than the host, which clips it instead of stretching it.
    gl.domElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;display:block;';
    container.appendChild(gl.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      CAMERA.fov,
      width() / height(),
      CAMERA.near,
      CAMERA.far
    );
    // Orientation is fixed once by lookAt; reframing only slides the camera along
    // this same line of sight, so it never needs another lookAt (the rig may be
    // rotated by then, and lookAt would fight the parallax).
    const target = new THREE.Vector3(...CAMERA.target);
    const baseOffset = new THREE.Vector3(...CAMERA.offset);
    camera.position.copy(target).add(baseOffset);
    camera.lookAt(target);
    // The camera hangs off a rig so mouse parallax rotates the rig, never the lookAt.
    const rig = new THREE.Group();
    rig.add(camera);
    scene.add(rig);

    // ---- Galaxy points ----
    const count = forDevice(DEVICE.particleCount);

    const cA = new THREE.Color();
    const cB = new THREE.Color();
    const grad = (stops: readonly GradientStop[], t: number): THREE.Color => {
      let i = 1;
      while (i < stops.length - 1 && stops[i][0] < t) i++;
      const [from, fromHex] = stops[i - 1];
      const [to, toHex] = stops[i];
      cA.set(fromHex);
      cB.set(toHex);
      return cA.lerp(cB, THREE.MathUtils.clamp((t - from) / (to - from), 0, 1));
    };

    const pos = new Float32Array(count * VEC3);
    const col = new Float32Array(count * VEC3);
    const colW = new Float32Array(count * VEC3);
    const siz = new Float32Array(count);
    const pha = new Float32Array(count);
    const sgn = () => (Math.random() < 0.5 ? 1 : -1);
    // Signed offset off the arm, mostly small: see GALAXY.scatterFalloff.
    const scatter = (spread: number) => Math.pow(Math.random(), GALAXY.scatterFalloff) * sgn() * spread;

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), GALAXY.coreDensity) * GALAXY.radius + GALAXY.minRadius;
      const armAngle = ((i % GALAXY.arms) / GALAXY.arms) * TAU;
      const angle = armAngle + r * GALAXY.curl;
      const spread = GALAXY.spread * r;
      const j = i * VEC3;
      pos[j] = Math.cos(angle) * r + scatter(spread);
      pos[j + 1] = scatter(spread) * GALAXY.thickness;
      pos[j + 2] = Math.sin(angle) * r + scatter(spread);

      const t = r / GALAXY.radius;
      grad(PALETTES.nebula.arms, t).toArray(col, j);
      grad(PALETTES.ember.arms, t).toArray(colW, j);

      const bulge = t < GALAXY.bulge.extent ? GALAXY.bulge.sizeBoost : 1;
      siz[i] = (GALAXY.starSize.min + Math.random() * GALAXY.starSize.range) * bulge;
      pha[i] = Math.random() * TAU;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, VEC3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, VEC3));
    geo.setAttribute('aColorWarm', new THREE.BufferAttribute(colW, VEC3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(pha, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSpin: { value: SHADER.spin },
      uWarm: { value: 0 },
      uOpacity: { value: 0 },
      uSize: { value: pointSize() },
    };

    // Compile-time constants: three prepends them to both shaders as #defines.
    const defines = {
      SPIN_CORE_SOFTENING: glslFloat(SHADER.spinCoreSoftening),
      POINT_PERSPECTIVE: glslFloat(SHADER.pointPerspective),
      TWINKLE_DEPTH: glslFloat(SHADER.twinkle.depth),
      TWINKLE_SPEED: glslFloat(SHADER.twinkle.speed),
      FLICKER_DEPTH: glslFloat(SHADER.flicker.depth),
      FLICKER_SPEED: glslFloat(SHADER.flicker.speed),
      FLICKER_PHASE_SCALE: glslFloat(SHADER.flicker.phaseScale),
      ALPHA_GAIN: glslFloat(SHADER.alpha),
      GLOW_FALLOFF: glslFloat(SHADER.glowFalloff),
    };

    // Differential rotation happens on the GPU: inner rings spin faster than the
    // rim (`uSpin / (r + SPIN_CORE_SOFTENING)`), which is what sells it as a galaxy and not a disc.
    const vertexShader = /* glsl */ `
      uniform float uTime;
      uniform float uSpin;
      uniform float uSize;
      uniform float uWarm;
      uniform float uOpacity;
      attribute vec3 aColor;
      attribute vec3 aColorWarm;
      attribute float aSize;
      attribute float aPhase;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float r = length(p.xz);
        float a = atan(p.z, p.x) + uTime * uSpin / (r + SPIN_CORE_SOFTENING);
        p = vec3(cos(a) * r, p.y, sin(a) * r);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float twinkle = 1.0 - TWINKLE_DEPTH + TWINKLE_DEPTH * sin(uTime * TWINKLE_SPEED + aPhase);
        gl_PointSize = aSize * uSize * twinkle * (POINT_PERSPECTIVE / -mv.z);
        gl_Position = projectionMatrix * mv;
        vColor = mix(aColor, aColorWarm, uWarm);
        float flicker = 1.0 - FLICKER_DEPTH
          + FLICKER_DEPTH * sin(uTime * FLICKER_SPEED + aPhase * FLICKER_PHASE_SCALE);
        vAlpha = uOpacity * ALPHA_GAIN * flicker;
      }
    `;

    // mediump overrides three's highp default for this stage only: an 8-bit glow
    // needs no more, it is cheaper on mobile GPUs, and desktop drivers ignore it.
    // The vertex stage stays highp (the shader clock grows without bound).
    const fragmentShader = /* glsl */ `
      precision mediump float;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        // 0 at the point's center, 1 at its edge.
        float d = length(gl_PointCoord - 0.5) * 2.0;
        // The quad's corners have zero glow: skip their blending (~21% of the quad).
        if (d >= 1.0) discard;
        float glow = pow(max(0.0, 1.0 - d), GLOW_FALLOFF);
        gl_FragColor = vec4(vColor, glow * vAlpha);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      defines,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader,
      fragmentShader,
    });

    const galaxy = new THREE.Points(geo, mat);
    galaxy.rotation.x = GALAXY.tilt.x;
    galaxy.rotation.z = GALAXY.tilt.z;
    galaxy.position.y = GALAXY.centerY;
    scene.add(galaxy);

    // ---- Core sprites (radial canvas texture) ----
    const texSize = CORE_GLOW.textureSize;
    const texCenter = texSize / 2;
    const cv = document.createElement('canvas');
    cv.width = cv.height = texSize;
    const ctx = cv.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    const g2 = ctx.createRadialGradient(texCenter, texCenter, 0, texCenter, texCenter, texCenter);
    // White on purpose: each sprite material tints it with its palette color.
    for (const [stop, alpha] of CORE_GLOW.profile) g2.addColorStop(stop, `rgba(255,255,255,${alpha})`);
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, texSize, texSize);
    const tex = new THREE.CanvasTexture(cv);

    const mkSprite = (scale: number, opacity: number) => {
      const m = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity,
        alphaTest: CORE_GLOW.alphaTest,
      });
      const s = new THREE.Sprite(m);
      s.scale.setScalar(scale);
      s.position.copy(galaxy.position);
      scene.add(s);
      return s;
    };
    const core = mkSprite(CORE_GLOW.core.scale, CORE_GLOW.core.opacity);
    const halo = mkSprite(CORE_GLOW.halo.scale, CORE_GLOW.halo.opacity);
    const coreCol = {
      neb: new THREE.Color(PALETTES.nebula.core),
      emb: new THREE.Color(PALETTES.ember.core),
    };
    const haloCol = {
      neb: new THREE.Color(PALETTES.nebula.halo),
      emb: new THREE.Color(PALETTES.ember.halo),
    };

    // ---- State ----
    let raf = 0;
    let running = false;
    let disposed = false;
    // Context lost or a program failed to link: nothing will ever draw again.
    let broken = false;
    // First frame reported; `active` is the last activity reported before it.
    let presented = false;
    let active: boolean | undefined;
    let clock = 0;
    let last = 0;
    let intro = 0;
    // `getAttribute`, not `dataset`: keeps this module usable against any DOM
    // implementation, the same reason AtmosphereService avoids dataset.
    const isWarm = () => document.documentElement.getAttribute(ATMOS_ATTRIBUTE) === WARM_ATMOS;
    let warm = isWarm() ? 1 : 0;
    let warmTarget = warm;
    // Blend the sprite tints were last computed for; NaN forces the first tint.
    let tinted = NaN;
    let mx = 0;
    let my = 0;
    let fade = 1;
    let inView = true;
    let hidden = document.hidden;
    // Galaxy brightness from the framing (dimmer on portrait, behind the copy).
    let brightness = 1;
    // Framing set by `fit()` on resize; `applyView()` composes it with the scroll depth.
    let framedZoom = 1;
    let framedTilt = 0;
    let framedLift = 0;
    let framedShift = 0;
    // Scroll depth: `scrollTarget` follows scroll events, `depth` glides toward it
    // per frame. Both are progress in [0, 1]; see MOTION.scrollDepth.
    let scrollTarget = 0;
    let depth = 0;
    let fadePx = window.innerHeight * MOTION.fadeDistance;

    // `approach` lands exactly on the target, so once the palette blend settles
    // the two color lerps stop running every frame.
    const tintGlow = () => {
      if (warm === tinted) return;
      tinted = warm;
      core.material.color.lerpColors(coreCol.neb, coreCol.emb, warm);
      halo.material.color.lerpColors(haloCol.neb, haloCol.emb, warm);
    };

    // ---- Sizing / framing ----
    const buffer: Size = { w: 0, h: 0 };
    const heightSlack = isMobile ? FRAMING.touchHeightSlackPx : 0;
    /** Returns true when the drawing buffer was reallocated (and so cleared). */
    const fit = (): boolean => {
      const next = { w: width(), h: height() };
      if (!needsResize(buffer, next, heightSlack)) return false;
      buffer.w = next.w;
      buffer.h = next.h;
      gl.setSize(buffer.w, buffer.h, false);
      gl.domElement.style.height = `${buffer.h}px`;
      camera.aspect = buffer.w / buffer.h;
      const framing = framingFor(camera.aspect, { w: window.innerWidth, h: window.innerHeight });
      brightness = framing.brightness;
      magnify = framing.magnify;
      camera.zoom = magnify;
      uniforms.uSize.value = pointSize();
      framedZoom = framing.zoom;
      framedTilt = framing.tilt;
      framedLift = framing.lift;
      framedShift = framing.shift;
      applyView();
      // The reallocation hitch is not GPU load.
      governor.rewarm(QUALITY.settleFrames);
      return true;
    };

    // Framing plus scroll depth: camera distance, disc tilt and lens shift. Runs
    // on resize and on frames where the smoothed depth moved; allocation-free.
    // At depth 0 it reproduces the framing exactly (no view offset on desktop).
    function applyView(): void {
      const S = MOTION.scrollDepth;
      const eased = smoothstep(depth);
      // Dolly: slide back along the same line of sight, so no lookAt is needed.
      camera.position.copy(baseOffset).multiplyScalar(framedZoom * (1 + S.dolly * eased)).add(target);
      galaxy.rotation.x = GALAXY.tilt.x + framedTilt + S.tilt * eased;
      // Lens shift: render a window `lift` lower (and `shift` further left) in the
      // full frame, which moves the image up (and right) without touching the
      // perspective. The scroll lag moves the window up, so the image trails the page.
      const x = framedShift === 0 ? 0 : -framedShift * buffer.w;
      const y = framedLift * buffer.h - S.lag * depth * fadePx;
      if (x !== 0 || y !== 0) camera.setViewOffset(buffer.w, buffer.h, x, y, buffer.w, buffer.h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    }
    fit();

    // Points are sized in drawing-buffer pixels: `uSize` follows the pixel ratio so
    // stars keep the same CSS size whatever resolution the governor picks.
    const applyPixelRatio = () => {
      gl.setPixelRatio(governor.ratio); // re-applies the current size internally
      uniforms.uSize.value = pointSize();
    };

    // advance(): moves time and every animated value forward. draw(): paints the state as it is.
    // The loop does both; a resize only draws (the galaxy must look exactly as it did).
    const advance = (now: number) => {
      const dt = frameDelta(now, last);
      last = now;
      clock += dt;
      intro = Math.min(1, intro + dt * MOTION.introRate);
      warm = approach(warm, warmTarget, MOTION.paletteRate, dt, MOTION.paletteSnap);
      const introEased = easeOutCubic(intro);

      uniforms.uTime.value = clock + MOTION.startTime;
      uniforms.uWarm.value = warm;
      // The glow sprites below derive from this too, so `brightness` dims everything.
      uniforms.uOpacity.value = introEased * fade * brightness;

      galaxy.scale.setScalar(THREE.MathUtils.lerp(MOTION.introStartScale, 1, introEased));
      galaxy.rotation.y += dt * GALAXY.driftSpeed;
      if (depth !== scrollTarget) {
        const S = MOTION.scrollDepth;
        depth = approach(depth, scrollTarget, S.rate, dt, S.snap);
        applyView();
      }
      const follow = Math.min(1, dt * MOTION.parallax.rate);
      rig.rotation.y += (mx * MOTION.parallax.yaw - rig.rotation.y) * follow;
      rig.rotation.x += (my * MOTION.parallax.pitch - rig.rotation.x) * follow;

      const glow = CORE_GLOW.core;
      const ig = CORE_GLOW.ignition;
      const flare = ignition(clock, ig.durationMs / MS_PER_SECOND);
      core.scale.setScalar(glow.scale * (1 + glow.pulse * Math.sin(clock * glow.pulseSpeed)) * (1 + ig.scale * flare));
      // The flare is added on top of the intro fade, not scaled by it: the core
      // lights up first and the arms fade in around it.
      core.material.opacity =
        (glow.opacity + glow.flicker * Math.sin(clock * glow.flickerSpeed)) * uniforms.uOpacity.value +
        glow.opacity * ig.opacity * flare * fade * brightness;
      halo.material.opacity = CORE_GLOW.halo.opacity * uniforms.uOpacity.value;
      tintGlow();
    };
    const draw = () => {
      gl.render(scene, camera);
      reportPresented();
    };
    const render = (now: number) => {
      advance(now);
      draw();
    };

    // Every vsync draws (the cursor does too); only the governor's half-rate fallback
    // skips every 2nd one. The vsync gap is measured on every callback, drawn or not,
    // so skipping doesn't distort the estimate.
    let vsyncStamp = 0;
    let vsyncIndex = 0;
    // A new resolution is applied before the next draw, never after one (see createFrameStep).
    const frameStep = createFrameStep({ governor, applyPixelRatio, render });
    const loop = (now: number) => {
      if (disposed || broken) return;
      if (vsyncStamp > 0) governor.observeVsync(now - vsyncStamp);
      vsyncStamp = now;
      frameStep.run(vsyncIndex++, now, last);
      raf = requestAnimationFrame(loop);
    };

    const setRunning = (on: boolean) => {
      if (disposed || (on && broken) || on === running) return;
      running = on;
      if (on) {
        last = performance.now();
        vsyncStamp = 0; // the gap across a pause is not a vsync
        vsyncIndex = 0;
        // The first frames after a resume (tab switch, scrolled back) are catch-up, not load.
        governor.rewarm();
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    // Zero GPU work until the shaders are ready, and whenever the hero is
    // off-screen, the tab is hidden, or the scroll fade reached full transparency.
    const syncRunning = () => {
      const due = !hidden && inView && fade > MOTION.stopOpacity;
      if (due !== active && !presented && !broken) {
        active = due;
        hooks.onActiveChange?.(due);
      }
      const known = governor.vsyncMs > 0;
      const probeCap = LOOP.probeMaxCallbacks;
      // Draw-less vsync probe: see `loopMayStart`. Never runs while the scene is inactive.
      if (!disposed && !broken && vsyncProbeWanted(due, running, known, probeCount, probeCap)) {
        if (!probeRaf) {
          probeStamp = 0; // the gap across a pause is not a vsync
          probeRaf = requestAnimationFrame(probe);
        }
      } else if (probeRaf) {
        cancelAnimationFrame(probeRaf);
        probeRaf = 0;
      }
      // Once drawing, only `due` decides: a monitor change must not stop the loop to re-probe.
      setRunning(settled && (running || loopMayStart(true, known, probeCount, probeCap)) && due);
    };
    // Feeds the estimator and nothing else: no render, no GPU work.
    let probeRaf = 0;
    let probeStamp = 0;
    let probeCount = 0;
    function probe(now: number): void {
      probeRaf = 0;
      if (disposed || broken) return;
      if (probeStamp > 0) governor.observeVsync(now - probeStamp);
      probeStamp = now;
      probeCount++;
      syncRunning(); // re-arms the probe, or hands over to the loop
    }

    // Reported once the first frame was drawn by linked programs: a link failure
    // reports itself through onShaderError during that same render, first.
    function reportPresented(): void {
      if (presented || broken) return;
      presented = true;
      const err = gl.getContext().getError(); // once: a sync point, never per frame
      if (err !== 0) console.warn(`HeroGalaxy: WebGL error 0x${err.toString(16)} after the first frame.`);
      hooks.onFirstFrame?.();
    }

    function fail(reason: string): void {
      if (broken || disposed) return;
      broken = true;
      setRunning(false);
      hooks.onFailure?.(reason);
    }

    // ---- Shader precompile ----
    // The first render would otherwise compile and link the programs inside the
    // first animation frame — a visible hitch right as the intro starts. With
    // KHR_parallel_shader_compile, compileAsync links them in the background and
    // polls; without it, compile() links them synchronously now, before the loop
    // (compileAsync would only add a "not supported" console warning). Either way
    // the intro starts on a warm pipeline, and the timeout guarantees it starts.
    gl.initTexture(tex); // upload the glow texture now, not on the first frame
    const precompile = (): Promise<unknown> => {
      try {
        if (gl.extensions.has('KHR_parallel_shader_compile')) return gl.compileAsync(scene, camera);
        gl.compile(scene, camera);
        return Promise.resolve();
      } catch {
        return Promise.resolve(); // the first render compiles instead, as before
      }
    };
    let settled = false;
    const gate = settleWithin(precompile(), LOOP.compileTimeoutMs).then(() => {
      settled = true;
      if (disposed || broken) return;
      syncRunning();
    });

    // ---- Context loss ----
    // Lost (GPU reset, memory pressure, too many live contexts): stop drawing and
    // let the host fall back to the CSS orbits instead of rebuilding. A restore
    // is never guaranteed to come, a context lost for one of those reasons tends
    // to be lost again, and a rebuild re-uploads everything for a decorative
    // background. The cleanup's own forceContextLoss() fires this event too; by
    // then the listener is gone and `disposed` is set.
    const onContextLost = () => fail('WebGL context lost');
    gl.domElement.addEventListener('webglcontextlost', onContextLost);

    // ---- Listeners / observers ----
    // Pointer normalized to [-0.5, 0.5] on each axis, 0 at the viewport center.
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => {
      fadePx = window.innerHeight * MOTION.fadeDistance;
      scrollTarget = scrollProgress(window.scrollY, window.innerHeight);
      fade = 1 - scrollTarget;
      syncRunning();
    };
    const onVis = () => {
      hidden = document.hidden;
      syncRunning();
    };

    const io = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      syncRunning();
    });
    io.observe(container);

    // Runs after the rAF draw and before paint: the reallocation cleared the buffer, so
    // redraw the unchanged state right here. No clock, intro, parallax or governor step.
    const ro = new ResizeObserver(() => {
      const resized = fit();
      if (shouldRedrawOnResize({ resized, running, presented, disposed, broken })) draw();
    });
    ro.observe(container);

    // devicePixelRatio has no change event: watch a media query pinned to the
    // current value, and re-pin it after every change (window dragged between
    // a 1x and a 2x monitor, browser zoom).
    let dprQuery: MediaQueryList | undefined;
    const watchPixelRatio = () => {
      dprQuery?.removeEventListener('change', onPixelRatioChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener('change', onPixelRatioChange);
    };
    const onPixelRatioChange = () => {
      // New screen, new budget: the governor starts over from the new cap.
      governor.setCap(pixelRatio());
      frameStep.markDirty(); // reallocate right before the next draw, not now: a cleared buffer would show empty
      probeCount = 0; // the new display is measured again (probe, if the loop is not running)
      syncRunning();
      watchPixelRatio();
    };
    watchPixelRatio();

    // AtmosphereService writes the atmosphere attribute on <html>; mirroring it here
    // keeps the palette in sync with the CSS tokens without coupling the scene to Angular.
    const mo = new MutationObserver(() => {
      warmTarget = isWarm() ? 1 : 0;
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: [ATMOS_ATTRIBUTE] });

    // Touch-first devices get no parallax listener at all: taps would only fire
    // compatibility mousemoves that nudge the camera for no reason.
    if (!coarsePointer) window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    onScroll(); // seeds `fade` for a page loaded mid-scroll; the gate starts the loop
    // ...and the depth, so a reload mid-page doesn't glide in from the top.
    depth = scrollTarget;
    applyView();
    syncRunning(); // reports the initial activity; the loop itself waits for the gate

    const releaseGpu = () => {
      geo.dispose();
      mat.dispose();
      tex.dispose();
      core.material.dispose();
      halo.material.dispose();
      releaseRenderer(gl);
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(probeRaf);
      gl.domElement.removeEventListener('webglcontextlost', onContextLost);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      dprQuery?.removeEventListener('change', onPixelRatioChange);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      // While compiling, three polls each program's status on a timer; freeing the
      // programs under that poll would throw from it. Release once it settled.
      if (settled) releaseGpu();
      else void gate.then(releaseGpu);
    };
  } catch (e) {
    console.warn('HeroGalaxy: WebGL unavailable, falling back.', e);
    if (renderer) releaseRenderer(renderer);
    return null;
  }
}

/**
 * `dispose()` frees three's GPU resources but the WebGL context itself lingers
 * until GC — and browsers cap live contexts (~16). Force-losing it frees it now.
 */
function releaseRenderer(renderer: THREE.WebGLRenderer): void {
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement.remove();
}
