import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  InjectionToken,
  afterNextRender,
  inject,
  output,
} from '@angular/core';
// Type-only: erased at compile time, so three.js never leaks into this chunk.
import type { createGalaxyScene } from '@app/lib/galaxy-scene';
import { createFrameWatchdog, type FrameWatchdog } from './frame-watchdog';

export type GalaxySceneFactory = typeof createGalaxyScene;

/**
 * Active time (tab visible, hero on screen) the scene gets to present its first
 * frame before the hero falls back to the CSS orbit rings. It covers a shader
 * compile that never reports "ready": the scene stops waiting for it after
 * `LOOP.compileTimeoutMs` (a spec keeps that well under this) and compiles on the
 * first frame instead. The intro fades in from black, so a fallback swapped in
 * at this point reads as a slow start, not as a glitch.
 */
export const FIRST_FRAME_TIMEOUT_MS = 2500;

/**
 * How the component gets hold of the scene builder.
 *
 * The default implementation dynamic-imports the module, which keeps the ~150 KB
 * three.js chunk out of the initial bundle and out of SSR. It is a DI token so
 * tests can swap the WebGL scene for a stub — the Angular unit-test system does
 * not allow `vi.mock` on first-party modules, and DI is the better seam anyway.
 */
export const GALAXY_SCENE_LOADER = new InjectionToken<() => Promise<GalaxySceneFactory>>(
  'GALAXY_SCENE_LOADER',
  {
    providedIn: 'root',
    factory: () => async () => (await import('@app/lib/galaxy-scene')).createGalaxyScene,
  }
);

/**
 * Hosts the WebGL galaxy behind the hero copy.
 *
 * SSR-safe: `afterNextRender` only runs in the browser and, with hydration, only
 * once the DOM is hydrated. Zoneless-safe: the rAF loop lives inside the scene
 * module, touches no signals, and therefore never schedules change detection.
 * Emits `failed` (at most once) so the hero can fall back to the CSS orbit rings
 * when there is no WebGL context, when the scene reports a failure (context lost,
 * shader program that does not link), or when no frame reaches the screen within
 * `FIRST_FRAME_TIMEOUT_MS` of active time. The scene is released right away.
 */
@Component({
  standalone: true,
  selector: 'hero-galaxy',
  template: '',
  host: { 'aria-hidden': 'true' },
  styles: [
    ':host{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;display:block}',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroGalaxyComponent {
  readonly failed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadScene = inject(GALAXY_SCENE_LOADER);

  private destroyed = false;
  private hasFailed = false;
  private release: (() => void) | null = null;
  private watchdog: FrameWatchdog | null = null;

  constructor() {
    // Registered now, while the view is surely alive: onDestroy throws (NG0911)
    // once it is destroyed, and the chunk below may arrive after that.
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.watchdog?.dispose();
      this.releaseScene();
    });

    afterNextRender(async () => {
      try {
        const createScene = await this.loadScene();
        // Destroyed while the chunk was loading: building now would leak a live
        // WebGL context and a rAF loop nobody can release.
        if (this.destroyed) return;
        // Armed with the scene, not before: a slow chunk download is not a failure.
        const watchdog = (this.watchdog = createFrameWatchdog(FIRST_FRAME_TIMEOUT_MS, () =>
          this.fail('no frame reached the screen in time')
        ));
        const release = createScene(this.host.nativeElement, {
          onFirstFrame: () => watchdog.frame(),
          onActiveChange: (active) => watchdog.setActive(active),
          onFailure: (reason) => this.fail(reason),
        });
        if (!release) return this.fail();
        // A failure reported while the scene was still being built had nothing to release yet.
        if (this.hasFailed) release();
        else this.release = release;
      } catch (e) {
        this.fail('the galaxy scene failed to start', e);
      }
    });
  }

  /** No reason: WebGL is unavailable, the expected fallback (the scene already logged it). */
  private fail(reason?: string, error?: unknown): void {
    if (this.hasFailed || this.destroyed) return;
    if (reason) console.warn(`hero-galaxy: ${reason}, falling back to the orbit rings`, ...(error ? [error] : []));
    this.hasFailed = true;
    this.watchdog?.dispose();
    this.releaseScene();
    this.failed.emit();
  }

  private releaseScene(): void {
    const release = this.release;
    this.release = null;
    release?.();
  }
}
