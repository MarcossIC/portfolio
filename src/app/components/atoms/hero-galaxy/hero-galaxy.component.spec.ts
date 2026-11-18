import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { GalaxySceneHooks } from '@app/lib/galaxy-scene';
import {
  FIRST_FRAME_TIMEOUT_MS,
  GALAXY_SCENE_LOADER,
  HeroGalaxyComponent,
  type GalaxySceneFactory,
} from './hero-galaxy.component';

/** afterNextRender + the awaited loader both resolve off the microtask queue. */
const settle = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await new Promise((r) => setTimeout(r, 10));
  await fixture.whenStable();
};

describe('HeroGalaxyComponent', () => {
  let fixture: ComponentFixture<HeroGalaxyComponent>;
  let failed: number;

  const cleanup = vi.fn();
  const createGalaxyScene = vi.fn<GalaxySceneFactory>(() => cleanup);

  /** The scene module is framework-free and needs WebGL, so DI swaps it out here:
   *  what this component owns is the lifecycle contract, not the rendering. */
  const mount = async (loader: () => Promise<GalaxySceneFactory>) => {
    await TestBed.configureTestingModule({
      imports: [HeroGalaxyComponent],
      providers: [{ provide: GALAXY_SCENE_LOADER, useValue: loader }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroGalaxyComponent);
    fixture.componentInstance.failed.subscribe(() => failed++);
    await settle(fixture);
  };

  const mountWithScene = () => mount(async () => createGalaxyScene);

  beforeEach(() => {
    failed = 0;
    cleanup.mockClear();
    createGalaxyScene.mockClear().mockReturnValue(cleanup);
  });

  it('should create', async () => {
    await mountWithScene();
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Purely decorative: it must never reach the accessibility tree.
  it('hides itself from assistive tech', async () => {
    await mountWithScene();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
  });

  it('boots the scene into its own host element after render', async () => {
    await mountWithScene();

    expect(createGalaxyScene).toHaveBeenCalledTimes(1);
    expect(createGalaxyScene).toHaveBeenCalledWith(fixture.nativeElement, expect.any(Object));
    expect(failed).toBe(0);
  });

  // No leaks: renderer, geometry and listeners must go down with the view.
  it('runs the scene cleanup when the component is destroyed', async () => {
    await mountWithScene();
    expect(cleanup).not.toHaveBeenCalled();

    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  // null = no WebGL context. The hero swaps back to the CSS orbit rings.
  it('emits failed when the scene reports no WebGL support', async () => {
    createGalaxyScene.mockReturnValue(null);

    await mountWithScene();

    expect(failed).toBe(1);
  });

  it('emits failed when the scene throws instead of returning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    createGalaxyScene.mockImplementation(() => {
      throw new Error('WebGL boom');
    });

    await mountWithScene();

    expect(failed).toBe(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  // A chunk that never arrives (offline, CDN hiccup) must not leave the hero empty.
  it('emits failed when the three.js chunk cannot be loaded', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await mount(() => Promise.reject(new Error('chunk load error')));

    expect(failed).toBe(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  // A failed boot leaves nothing to dispose — calling a null cleanup would throw.
  it('does not blow up on destroy after a failed boot', async () => {
    createGalaxyScene.mockReturnValue(null);
    await mountWithScene();

    expect(() => fixture.destroy()).not.toThrow();
    expect(cleanup).not.toHaveBeenCalled();
  });
});

// The scene can create a context and still never show a frame (a compile that
// never settles, a lost context, a program that fails to link). The component
// owns the fallback decision: no frame in time, or a reported failure → `failed`.
describe('HeroGalaxyComponent (first-frame watchdog)', () => {
  let fixture: ComponentFixture<HeroGalaxyComponent>;
  let failed: number;
  let hooks: GalaxySceneHooks | undefined;
  const cleanup = vi.fn();
  const createGalaxyScene = vi.fn<GalaxySceneFactory>((_host, h) => {
    hooks = h;
    return cleanup;
  });

  /** Fake timers drive both the boot (afterNextRender, the awaited loader) and the watchdog. */
  const flush = async (ms = 20) => {
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(ms);
  };

  const mount = async (loader: () => Promise<GalaxySceneFactory> = async () => createGalaxyScene) => {
    await TestBed.configureTestingModule({
      imports: [HeroGalaxyComponent],
      providers: [{ provide: GALAXY_SCENE_LOADER, useValue: loader }],
    }).compileComponents();
    fixture = TestBed.createComponent(HeroGalaxyComponent);
    fixture.componentInstance.failed.subscribe(() => failed++);
    await flush();
  };

  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    failed = 0;
    hooks = undefined;
    cleanup.mockClear();
    createGalaxyScene.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
    warn.mockRestore();
  });

  it('hands the scene its lifecycle hooks', async () => {
    await mount();
    expect(createGalaxyScene).toHaveBeenCalledTimes(1);
    expect(hooks?.onFirstFrame).toEqual(expect.any(Function));
    expect(hooks?.onActiveChange).toEqual(expect.any(Function));
    expect(hooks?.onFailure).toEqual(expect.any(Function));
  });

  it('emits failed and releases the scene when no frame shows up in time', async () => {
    await mount();
    await vi.advanceTimersByTimeAsync(FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(1);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
    // Destroying afterwards must not release it twice.
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('stays quiet once the first frame is presented', async () => {
    await mount();
    hooks!.onFirstFrame!();
    await vi.advanceTimersByTimeAsync(10 * FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(0);
    expect(cleanup).not.toHaveBeenCalled();
  });

  // Hidden tab, hero off-screen, faded out by scroll: legitimately not drawing.
  it('does not count time while the scene reports it is idle', async () => {
    await mount();
    hooks!.onActiveChange!(false);
    await vi.advanceTimersByTimeAsync(10 * FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(0);
    hooks!.onActiveChange!(true);
    await vi.advanceTimersByTimeAsync(FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(1);
  });

  // createScene builds geometry and, without KHR_parallel_shader_compile, links the
  // shaders synchronously: seconds on a slow phone. That is boot work, not a
  // missing frame — the budget starts once the build has returned.
  it('does not count the synchronous scene build against the first-frame budget', async () => {
    createGalaxyScene.mockImplementationOnce((_host, h) => {
      hooks = h;
      vi.advanceTimersByTime(FIRST_FRAME_TIMEOUT_MS + 1000); // the build hogs the thread
      return cleanup;
    });
    await mount();
    await vi.advanceTimersByTimeAsync(FIRST_FRAME_TIMEOUT_MS - 100);
    expect(failed).toBe(0);
    hooks!.onFirstFrame!();
    await vi.advanceTimersByTimeAsync(10 * FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(0);
    expect(cleanup).not.toHaveBeenCalled();
  });

  it('still falls back when no frame follows a slow build', async () => {
    createGalaxyScene.mockImplementationOnce((_host, h) => {
      hooks = h;
      vi.advanceTimersByTime(FIRST_FRAME_TIMEOUT_MS + 1000);
      return cleanup;
    });
    await mount();
    await vi.advanceTimersByTimeAsync(FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  // The scene reports its initial activity from inside createScene: a hero that
  // boots off-screen (reload mid-page) or in a hidden tab must start paused.
  it('honors the activity the scene reported while it was being built', async () => {
    createGalaxyScene.mockImplementationOnce((_host, h) => {
      hooks = h;
      h?.onActiveChange?.(false);
      return cleanup;
    });
    await mount();
    await vi.advanceTimersByTimeAsync(10 * FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(0);
    hooks!.onActiveChange!(true);
    await vi.advanceTimersByTimeAsync(FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(1);
  });

  it('emits failed when the scene reports a failure (context lost, shader link error)', async () => {
    await mount();
    hooks!.onFirstFrame!();
    hooks!.onFailure!('context lost');
    expect(failed).toBe(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('emits failed only once', async () => {
    await mount();
    hooks!.onFailure!('context lost');
    hooks!.onFailure!('shader');
    await vi.advanceTimersByTimeAsync(10 * FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(1);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('stops the watchdog when the component is destroyed', async () => {
    await mount();
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(10 * FIRST_FRAME_TIMEOUT_MS);
    expect(failed).toBe(0);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  // The view can go away while the three.js chunk is still loading (hydration
  // re-render, fast navigation). Registering on a destroyed DestroyRef throws
  // NG0911 and would leak a live WebGL context nobody can release.
  it('never builds a scene for a view destroyed while the chunk was loading', async () => {
    let release!: (f: GalaxySceneFactory) => void;
    await mount(() => new Promise((r) => (release = r)));
    fixture.destroy();
    release(createGalaxyScene);
    await vi.advanceTimersByTimeAsync(10 * FIRST_FRAME_TIMEOUT_MS);
    expect(createGalaxyScene).not.toHaveBeenCalled();
    expect(failed).toBe(0);
    expect(warn).not.toHaveBeenCalled();
  });
});

// End-to-end on the real module: jsdom has no WebGL, so this exercises the exact
// path a browser without a GPU context takes — no mocks, no stubs.
describe('HeroGalaxyComponent (real scene, no WebGL)', () => {
  it('falls back through the real galaxy-scene module when WebGL is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let failed = 0;

    await TestBed.configureTestingModule({ imports: [HeroGalaxyComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HeroGalaxyComponent);
    fixture.componentInstance.failed.subscribe(() => failed++);
    fixture.detectChanges();

    // The real chunk is three.js: give the dynamic import room to resolve.
    for (let i = 0; i < 100 && failed === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    await fixture.whenStable();

    expect(failed).toBe(1);
    expect(() => fixture.destroy()).not.toThrow();
    warn.mockRestore();
  });
});
