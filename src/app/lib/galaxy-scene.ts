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
  /** Multiplier on the galaxy's opacity. */
  readonly brightness: number;
}

/**
 * Framing by canvas aspect: the original zoom-out on landscape, blending smoothly
 * into `FRAMING.portrait` as the canvas turns portrait. Runs on resize only.
 */
export function framingFor(aspect: number): Framing {
  const p = FRAMING.portrait;
  const x = Math.min(1, Math.max(0, (FRAMING.minAspect - aspect) / (FRAMING.minAspect - p.aspect)));
  const t = x * x * (3 - 2 * x); // smoothstep: no kink where the blend starts or ends
  // a·(1−t) + b·t lands exactly on both ends: landscape stays bit-identical.
  const mix = (a: number, b: number) => a * (1 - t) + b * t;
  return {
    zoom: mix(zoomOutFor(aspect), p.zoom),
    magnify: mix(1, p.magnify),
    lift: mix(0, p.lift),
    brightness: mix(1, p.brightness),
  };
}

/** Seconds since the last rendered frame, clamped to [0, LOOP.maxFrameMs]. */
export function frameDelta(now: number, last: number): number {
  return Math.min(Math.max(now - last, 0), LOOP.maxFrameMs) / MS_PER_SECOND;
}

export function isFrameDue(now: number, last: number): boolean {
  return now - last >= LOOP.minFrameMs;
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
  readonly slowFrameMs: number;
  readonly stallMs: number;
  readonly windowFrames: number;
  readonly warmupFrames: number;
  readonly settleFrames: number;
  readonly overShare: number;
  readonly calmShare: number;
  readonly downWindows: number;
  readonly upWindows: number;
  readonly probeBackoff: { readonly initial: number; readonly max: number };
  readonly minGain: number;
  readonly maxIneffectiveSteps: number;
  readonly hold: { readonly initial: number; readonly max: number };
}

export interface QualityGovernor {
  /** Pixel ratio the drawing buffer should use now. */
  readonly ratio: number;
  /** Feeds the gap (ms) since the previous rendered frame. Returns true when `ratio` changed. */
  sample(gapMs: number): boolean;
  /** Ignores at least the next `frames` samples (loop resumed, canvas resized). */
  rewarm(frames?: number): void;
  /** New device cap (devicePixelRatio changed): starts over from it. Returns true when `ratio` changed. */
  setCap(cap: number): boolean;
}

/**
 * Adaptive resolution: steps the pixel ratio down a notch while frames keep
 * coming late, and probes back up after a calm stretch. See `QUALITY` for why it
 * counts late frames instead of averaging milliseconds.
 *
 * Mutable closure state on purpose: it runs once per rendered frame and must not
 * allocate. Notches are `cap × step^level`, clamped to `floor`.
 */
export function createQualityGovernor(cap: number, floor: number, cfg: QualityConfig = QUALITY): QualityGovernor {
  let maxRatio = cap;
  let minRatio = Math.min(floor, cap);
  let maxLevel = 0;
  let level = 0;
  let ratio = cap;

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
  let upBlock = 0;
  let backoff = cfg.probeBackoff.initial;
  // Giving up when stepping down does not help.
  let lastDownShare = -1;
  let ineffective = 0;
  let holdLeft = 0;
  let holdLen = cfg.hold.initial;

  const buildLadder = () => {
    // Epsilon: a floor sitting exactly on a notch must not add an empty one.
    maxLevel =
      maxRatio > minRatio ? Math.ceil(Math.log(minRatio / maxRatio) / Math.log(cfg.step) - 1e-9) : 0;
  };
  buildLadder();

  const resetStreaks = () => {
    frames = late = 0;
    over = overSum = calm = 0;
  };

  const setLevel = (next: number): boolean => {
    level = Math.min(maxLevel, Math.max(0, next));
    skip = Math.max(skip, cfg.settleFrames);
    resetStreaks();
    const r = Math.max(minRatio, maxRatio * Math.pow(cfg.step, level));
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
    if (ineffective >= cfg.maxIneffectiveSteps) {
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
    if (upBlock > 0) upBlock--;
    if (holdLeft > 0) holdLeft--;
    const isOver = share > cfg.overShare;
    if (!isOver) {
      lastDownShare = -1;
      ineffective = 0;
    }

    if (probing) {
      if (isOver) {
        // The notch above is too much: back down, and wait longer before the next try.
        probing = false;
        upBlock = backoff;
        backoff = Math.min(backoff * 2, cfg.probeBackoff.max);
        return setLevel(level + 1);
      }
      if (++probeOk >= cfg.downWindows) {
        probing = false;
        backoff = cfg.probeBackoff.initial;
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
    if (++calm < cfg.upWindows || upBlock > 0 || level === 0 || probing) return false;
    probing = true;
    probeOk = 0;
    return setLevel(level - 1);
  };

  return {
    get ratio() {
      return ratio;
    },
    sample(gapMs) {
      // Non-positive: restart stamp taken after the rAF time. Huge: a stall, not load.
      if (!(gapMs > 0) || gapMs > cfg.stallMs) return false;
      if (skip > 0) {
        skip--;
        return false;
      }
      frames++;
      if (gapMs > cfg.slowFrameMs) late++;
      if (frames < cfg.windowFrames) return false;
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
      probing = false;
      upBlock = 0;
      backoff = cfg.probeBackoff.initial;
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

/**
 * Spiral galaxy particle field for the hero section. Every tunable value lives
 * in `galaxy-scene.config.ts`; this module is only the mechanism.
 *
 * Framework-free on purpose: no Angular, no signals, no zone. The rAF loop lives
 * entirely outside change detection, so it cannot trigger a render pass in a
 * zoneless app. Only import this from the browser — it touches `window` at call time.
 *
 * @param container element the canvas is appended to; it drives size and visibility
 * @returns a cleanup function, or `null` when WebGL is unavailable (caller falls back)
 */
export function createGalaxyScene(container: HTMLElement): (() => void) | null {
  // Outside the try: a failure after the context exists must still release it.
  let renderer: THREE.WebGLRenderer | undefined;
  try {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    // Shaders compiled (or the compile timeout passed): the loop may start.
    let ready = false;
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
    const fit = () => {
      const next = { w: width(), h: height() };
      if (!needsResize(buffer, next, heightSlack)) return;
      buffer.w = next.w;
      buffer.h = next.h;
      gl.setSize(buffer.w, buffer.h, false);
      gl.domElement.style.height = `${buffer.h}px`;
      camera.aspect = buffer.w / buffer.h;
      const framing = framingFor(camera.aspect);
      brightness = framing.brightness;
      magnify = framing.magnify;
      camera.zoom = magnify;
      uniforms.uSize.value = pointSize();
      camera.position.copy(baseOffset).multiplyScalar(framing.zoom).add(target);
      // Lens shift: render a window `lift` lower in the full frame, which moves the
      // image up without touching the perspective. No offset at all on landscape.
      if (framing.lift > 0) {
        camera.setViewOffset(buffer.w, buffer.h, 0, framing.lift * buffer.h, buffer.w, buffer.h);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
      // The reallocation hitch is not GPU load.
      governor.rewarm(QUALITY.settleFrames);
    };
    fit();

    // Points are sized in drawing-buffer pixels: `uSize` follows the pixel ratio so
    // stars keep the same CSS size whatever resolution the governor picks.
    const applyPixelRatio = () => {
      gl.setPixelRatio(governor.ratio); // re-applies the current size internally
      uniforms.uSize.value = pointSize();
    };

    const render = (now: number) => {
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
      const follow = Math.min(1, dt * MOTION.parallax.rate);
      rig.rotation.y += (mx * MOTION.parallax.yaw - rig.rotation.y) * follow;
      rig.rotation.x += (my * MOTION.parallax.pitch - rig.rotation.x) * follow;

      const glow = CORE_GLOW.core;
      core.scale.setScalar(glow.scale * (1 + glow.pulse * Math.sin(clock * glow.pulseSpeed)));
      core.material.opacity =
        (glow.opacity + glow.flicker * Math.sin(clock * glow.flickerSpeed)) * uniforms.uOpacity.value;
      halo.material.opacity = CORE_GLOW.halo.opacity * uniforms.uOpacity.value;
      tintGlow();

      gl.render(scene, camera);
    };

    const loop = (now: number) => {
      if (disposed) return;
      if (isFrameDue(now, last)) {
        const gap = now - last;
        render(now);
        // Applied after the frame: the next one draws at the new resolution.
        if (governor.sample(gap)) applyPixelRatio();
      }
      raf = requestAnimationFrame(loop);
    };

    const setRunning = (on: boolean) => {
      if (disposed || on === running) return;
      running = on;
      if (on) {
        last = performance.now();
        // The first frames after a resume (tab switch, scrolled back) are catch-up, not load.
        governor.rewarm();
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    // Zero GPU work until the shaders are ready, and whenever the hero is
    // off-screen, the tab is hidden, or the scroll fade reached full transparency.
    const syncRunning = () => setRunning(ready && !hidden && inView && fade > MOTION.stopOpacity);

    const paintStaticFrame = () => {
      uniforms.uTime.value = MOTION.stillTime;
      uniforms.uWarm.value = warm;
      uniforms.uOpacity.value = brightness;
      galaxy.scale.setScalar(1);
      core.material.opacity = CORE_GLOW.core.opacity * brightness;
      halo.material.opacity = CORE_GLOW.halo.opacity * brightness;
      tintGlow();
      gl.render(scene, camera);
    };
    // Reduced motion: repaint the still frame when something it depends on changes.
    const repaintStill = () => {
      if (reduce && ready) paintStaticFrame();
    };

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
      if (disposed) return;
      ready = true;
      if (reduce) {
        // Reduced motion: the still frame first, no scroll/mouse listeners. The
        // loop still starts below, exactly as the IntersectionObserver's first
        // callback started it before the precompile gate existed (kept on purpose).
        intro = 1;
        fade = 1;
        paintStaticFrame();
      }
      syncRunning();
    });

    // ---- Listeners / observers ----
    // Pointer normalized to [-0.5, 0.5] on each axis, 0 at the viewport center.
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => {
      const fadeDistancePx = window.innerHeight * MOTION.fadeDistance;
      fade = 1 - THREE.MathUtils.clamp(window.scrollY / fadeDistancePx, 0, 1);
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

    const ro = new ResizeObserver(() => {
      fit();
      repaintStill();
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
      applyPixelRatio();
      repaintStill();
      watchPixelRatio();
    };
    watchPixelRatio();

    // AtmosphereService writes the atmosphere attribute on <html>; mirroring it here
    // keeps the palette in sync with the CSS tokens without coupling the scene to Angular.
    const mo = new MutationObserver(() => {
      warmTarget = isWarm() ? 1 : 0;
      if (reduce) {
        warm = warmTarget;
        repaintStill();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: [ATMOS_ATTRIBUTE] });

    if (!reduce) {
      // Touch-first devices get no parallax listener at all: taps would only fire
      // compatibility mousemoves that nudge the camera for no reason.
      if (!coarsePointer) window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVis);
      onScroll(); // seeds `fade` for a page loaded mid-scroll; the gate starts the loop
    }

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
