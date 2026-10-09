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

export type GalaxySceneFactory = typeof createGalaxyScene;

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
 * Emits `failed` when there is no WebGL context, so the hero can fall back to the
 * CSS orbit rings.
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

  constructor() {
    afterNextRender(async () => {
      try {
        const createScene = await this.loadScene();
        const cleanup = createScene(this.host.nativeElement);
        if (!cleanup) {
          this.failed.emit();
          return;
        }
        this.destroyRef.onDestroy(cleanup);
      } catch (e) {
        console.warn('hero-galaxy: the galaxy scene failed to start', e);
        this.failed.emit();
      }
    });
  }
}
