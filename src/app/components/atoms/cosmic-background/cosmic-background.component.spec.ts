import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { CosmicBackgroundComponent } from './cosmic-background.component';
import { STAR_COUNT_DESKTOP, STAR_COUNT_MOBILE } from './cosmic-background.utils';

describe('CosmicBackgroundComponent', () => {
  let fixture: ComponentFixture<CosmicBackgroundComponent>;

  const host = () => fixture.nativeElement as HTMLElement;
  const starStyles = (el: HTMLElement) =>
    Array.from(el.querySelectorAll<HTMLElement>('.star')).map((s) => s.getAttribute('style'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosmicBackgroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CosmicBackgroundComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the desktop star budget, flagging the ones past the mobile budget as extra', () => {
    expect(host().querySelectorAll('.star')).toHaveLength(STAR_COUNT_DESKTOP);
    expect(host().querySelectorAll('.star:not(.star--extra)')).toHaveLength(STAR_COUNT_MOBILE);
  });

  it('places the stars deterministically (SSR markup === client render, no hydration pop)', () => {
    const second = TestBed.createComponent(CosmicBackgroundComponent);
    second.detectChanges();
    expect(starStyles(second.nativeElement as HTMLElement)).toEqual(starStyles(host()));
    second.destroy();
  });

  it('no longer filters the animated star container', () => {
    const field = host().querySelector<HTMLElement>('.star-field')!;
    expect(field.getAttribute('style') ?? '').not.toContain('filter');
  });

  it('exposes the star-flare hook for the atmosphere toggle, hidden at rest', () => {
    const flare = host().querySelector<HTMLElement>('[data-star-flare]');
    expect(flare).toBeTruthy();
    const layers = flare!.querySelectorAll<HTMLElement>('.star-flare-layer');
    expect(layers).toHaveLength(2);
    expect(layers[0].style.backgroundImage).toContain('radial-gradient');
  });

  it('keeps the live CSS stack until a bake succeeds (jsdom has no canvas)', () => {
    expect(host().classList.contains('is-baked')).toBe(false);
    expect(host().querySelector('.nebula-img')).toBeTruthy();
  });

  it('pauses the infinite animations while the tab is hidden', async () => {
    const setHidden = (hidden: boolean) => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
      document.dispatchEvent(new Event('visibilitychange'));
    };

    setHidden(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host().classList.contains('is-paused')).toBe(true);

    setHidden(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host().classList.contains('is-paused')).toBe(false);

    delete (document as unknown as Record<string, unknown>)['hidden'];
  });
});
