import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
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
    expect(createGalaxyScene).toHaveBeenCalledWith(fixture.nativeElement);
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
