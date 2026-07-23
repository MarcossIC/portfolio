import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationRef, signal } from '@angular/core';
import { gsap } from 'gsap';
import { AtmosphereToggleComponent } from './atmosphere-toggle.component';
import { AtmosphereService, ATMOS_STORAGE_KEY } from '@app/services/atmosphere.service';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';

// A chainable GSAP timeline stub. Functions added via .add() (where commit()
// lives) run immediately; onComplete fires when the timeline is created.
vi.mock('gsap', () => {
  const tl: Record<string, unknown> = {};
  tl['to'] = vi.fn(() => tl);
  tl['fromTo'] = vi.fn(() => tl);
  tl['add'] = vi.fn((fn: () => void) => {
    fn();
    return tl;
  });
  return {
    gsap: {
      set: vi.fn(),
      timeline: vi.fn((opts?: { onComplete?: () => void }) => {
        opts?.onComplete?.();
        return tl;
      }),
    },
  };
});

describe('AtmosphereToggleComponent', () => {
  let fixture: ComponentFixture<AtmosphereToggleComponent>;
  let service: AtmosphereService;

  const html = () => document.documentElement;
  const button = (): HTMLButtonElement =>
    (fixture.nativeElement as HTMLElement).querySelector('button')!;

  beforeEach(async () => {
    delete html().dataset['atmos'];
    localStorage.removeItem(ATMOS_STORAGE_KEY);

    await TestBed.configureTestingModule({
      imports: [AtmosphereToggleComponent],
      providers: [
        {
          // reduced motion ON → the toggle must commit instantly, no GSAP
          provide: ReducedMotionService,
          useValue: { prefersReducedMotion: signal(true).asReadonly() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AtmosphereToggleComponent);
    service = TestBed.inject(AtmosphereService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an accessible button announcing the current atmosphere', () => {
    expect(button().getAttribute('aria-label')).toBe('Switch atmosphere, current mode: Nebula');
    expect(button().getAttribute('title')).toBe('Atmosphere: Nebula');
  });

  it('commits the atmosphere instantly on click when reduced motion is preferred', () => {
    button().click();

    expect(service.atmos()).toBe('ember');
    expect(html().dataset['atmos']).toBe('ember');
  });

  it('flips back to nebula on a second click', () => {
    button().click();
    button().click();

    expect(service.atmos()).toBe('nebula');
    expect(html().dataset['atmos']).toBeUndefined();
  });

  it('updates the title after switching', () => {
    button().click();
    fixture.detectChanges();

    expect(button().getAttribute('title')).toBe('Atmosphere: Ember');
  });

  it('renders the compact row with label and current mode name', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Atmosphere');
    expect(text).toContain('Nebula');
  });
});

describe('AtmosphereToggleComponent (animated path)', () => {
  let fixture: ComponentFixture<AtmosphereToggleComponent>;
  let service: AtmosphereService;

  const html = () => document.documentElement;
  const button = (): HTMLButtonElement =>
    (fixture.nativeElement as HTMLElement).querySelector('button')!;

  beforeEach(async () => {
    delete html().dataset['atmos'];
    localStorage.removeItem(ATMOS_STORAGE_KEY);

    await TestBed.configureTestingModule({
      imports: [AtmosphereToggleComponent],
      providers: [
        {
          // reduced motion OFF → the GSAP shockwave path runs
          provide: ReducedMotionService,
          useValue: { prefersReducedMotion: signal(false).asReadonly() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AtmosphereToggleComponent);
    service = TestBed.inject(AtmosphereService);
    fixture.detectChanges();
  });

  // Overlays get relocated onto <body>; destroy the fixture so they don't pile up.
  afterEach(() => fixture.destroy());

  // Fix (circular-reveal doc §3.3): overlays MUST live outside the header, which
  // carries a view-transition-name that would otherwise lift them out of the root
  // snapshot. Without this they animate in the header's group, not the reveal.
  it('relocates the FX overlays onto <body>, out of the header VT group', async () => {
    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    const ring = document.querySelector('.shock-ring');
    expect(ring).toBeTruthy();
    expect(ring!.parentElement).toBe(document.body);
    expect((fixture.nativeElement as HTMLElement).contains(ring!)).toBe(false);
  });

  // Fase 2.3 (§7.6): a plasma-trail circle must be wired into the FX (GSAP drives
  // it), not just present in the DOM.
  it('wires the plasma trail overlay into the shockwave FX', async () => {
    vi.mocked(gsap.set).mockClear();
    const plasma = (fixture.nativeElement as HTMLElement).querySelector('.shock-plasma');

    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    expect(plasma).toBeTruthy();
    const drivesPlasma = vi.mocked(gsap.set).mock.calls.some(
      ([target]) =>
        target === plasma || (Array.isArray(target) && target.includes(plasma))
    );
    expect(drivesPlasma).toBe(true);
  });

  // Fase 2.2 (§7.1): the button punch hatches 6-8 particles from the orb.
  it('hatches orb particles into the sparks container on the punch', async () => {
    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    // The sparks host is relocated onto <body>, so query the document, not the host.
    const sparks = document.querySelector('.atmos-sparks');
    const count = sparks?.querySelectorAll('span').length ?? 0;
    expect(count).toBeGreaterThanOrEqual(6);
    expect(count).toBeLessThanOrEqual(8);
  });

  // Regression: currentTarget must be captured before the `await import('gsap')`,
  // otherwise it is null by the time the shockwave reads getBoundingClientRect().
  it('commits the atmosphere through the shockwave without throwing', async () => {
    const commitSpy = vi.spyOn(service, 'commit');
    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // flush the `await import('gsap')` microtask before asserting
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    expect(commitSpy).toHaveBeenCalledWith('ember');
    expect(service.atmos()).toBe('ember');
    expect(html().dataset['atmos']).toBe('ember');
  });

  // Regression (check-then-act race): `busy` must lock BEFORE the awaited GSAP
  // import — otherwise a second click landing while the module is still loading
  // (first-ever click: network/parse time) slips past the guard and starts a
  // concurrent transition. The lock must engage in the synchronous prefix.
  it('locks busy synchronously, before the GSAP import is awaited', async () => {
    const cmp = fixture.componentInstance as unknown as {
      toggle: (e: MouseEvent) => Promise<void>;
      busy: boolean;
    };
    const event = { currentTarget: button() } as unknown as MouseEvent;

    const pending = cmp.toggle(event);
    // Still inside the import window: the guard must already be engaged.
    expect(cmp.busy).toBe(true);

    await pending;
    await fixture.whenStable();
    expect(service.atmos()).toBe('ember');
    expect(cmp.busy).toBe(false); // and released once the transition settles
  });

  // Fase 0: if GSAP throws while building the timeline, `busy` must be released
  // and the theme must still commit — otherwise the toggle locks for the session.
  it('unlocks and commits even if GSAP throws while building the timeline', async () => {
    vi.mocked(gsap.timeline).mockImplementationOnce(() => {
      throw new Error('gsap boom');
    });
    const commitSpy = vi.spyOn(service, 'commit');

    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    // theme applied despite the failure
    expect(commitSpy).toHaveBeenCalledWith('ember');
    expect(service.atmos()).toBe('ember');

    // busy released → a second click flips back (would be swallowed if still locked)
    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    expect(service.atmos()).toBe('nebula');
  });
});

// Fase 1: when the browser supports View Transitions, the toggle takes the
// circular-reveal route instead of the shockwave fallback.
type StartVT = (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };

describe('AtmosphereToggleComponent (view transition path)', () => {
  let fixture: ComponentFixture<AtmosphereToggleComponent>;
  let service: AtmosphereService;
  let originalSVT: StartVT | undefined;

  const html = () => document.documentElement;
  const button = (): HTMLButtonElement =>
    (fixture.nativeElement as HTMLElement).querySelector('button')!;

  const docWithVt = () =>
    document as unknown as { startViewTransition?: StartVT };

  beforeEach(async () => {
    delete html().dataset['atmos'];
    localStorage.removeItem(ATMOS_STORAGE_KEY);
    document.getElementById('ml-vt-style')?.remove();

    // Stub the View Transitions API: run the callback synchronously, resolve both promises.
    originalSVT = docWithVt().startViewTransition;
    docWithVt().startViewTransition = (cb: () => void) => {
      cb();
      return { ready: Promise.resolve(), finished: Promise.resolve() };
    };

    await TestBed.configureTestingModule({
      imports: [AtmosphereToggleComponent],
      providers: [
        {
          provide: ReducedMotionService,
          useValue: { prefersReducedMotion: signal(false).asReadonly() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AtmosphereToggleComponent);
    service = TestBed.inject(AtmosphereService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy(); // triggers overlay cleanup off <body>
    if (originalSVT === undefined) delete docWithVt().startViewTransition;
    else docWithVt().startViewTransition = originalSVT;
    document.getElementById('ml-vt-style')?.remove();
  });

  it('drives the swap through startViewTransition and unlocks on finish', async () => {
    const svtSpy = vi.spyOn(docWithVt() as Required<ReturnType<typeof docWithVt>>, 'startViewTransition');
    const commitSpy = vi.spyOn(service, 'commit');

    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    expect(svtSpy).toHaveBeenCalled();
    expect(commitSpy).toHaveBeenCalledWith('ember');
    expect(service.atmos()).toBe('ember');

    // busy released via vt.finished → second click flips back
    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();
    expect(service.atmos()).toBe('nebula');
  });

  it('injects the VT style once and does NOT name the header (Fix 1)', async () => {
    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    const style = document.getElementById('ml-vt-style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('view-transition-old(root)');
    // Fix 1: the header must NOT be pulled into its own group, or it won't ride the wave.
    expect(style?.textContent).not.toContain('ml-header');
    expect(style?.textContent).not.toContain('view-transition-name');

    // second toggle must NOT duplicate the style tag
    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();
    expect(document.querySelectorAll('#ml-vt-style').length).toBe(1);
  });

  // Fix 2: the .vt-live class must gate CSS transitions during the wave and be
  // cleaned off <html> once the transition finishes.
  it('toggles the .vt-live class on <html> for the duration of the transition', async () => {
    const addSpy = vi.spyOn(html().classList, 'add');
    const removeSpy = vi.spyOn(html().classList, 'remove');

    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    expect(addSpy).toHaveBeenCalledWith('vt-live');
    expect(removeSpy).toHaveBeenCalledWith('vt-live');
    expect(html().classList.contains('vt-live')).toBe(false); // cleaned up
  });

  // Fix 3: a synchronous render must run inside the VT callback so signal-driven
  // views reflect the new theme before the new snapshot is captured.
  it('forces a synchronous render (appRef.tick) inside the VT callback', async () => {
    const appRef = TestBed.inject(ApplicationRef);
    const tickSpy = vi.spyOn(appRef, 'tick').mockImplementation(() => {});
    const commitSpy = vi.spyOn(service, 'commit');

    button().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await fixture.whenStable();

    expect(commitSpy).toHaveBeenCalledWith('ember');
    expect(tickSpy).toHaveBeenCalled();
  });
});
