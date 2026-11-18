import { TestBed } from '@angular/core/testing';
import { NavigationService } from './NavigationService.service';
import { ScrollProgressService } from './ScrollProgressService.service';

describe('NavigationService deep links', () => {
  let service: NavigationService;
  let scrollToElement: ReturnType<typeof vi.fn>;
  let section: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollToElement = vi.fn(() => Promise.resolve());
    TestBed.configureTestingModule({
      providers: [{ provide: ScrollProgressService, useValue: { scrollToElement, scrollTo: vi.fn() } }],
    });
    service = TestBed.inject(NavigationService);
    section = document.createElement('section');
    section.id = 'contact';
    document.body.appendChild(section);
  });

  afterEach(() => {
    section.remove();
    history.replaceState(null, '', '/');
    vi.useRealTimers();
  });

  it('scrollToHash jumps instantly (duration 0) to a known section and focuses it', async () => {
    const done = service.scrollToHash('#contact');
    await vi.advanceTimersByTimeAsync(2500);
    expect(await done).toBe(true);
    expect(scrollToElement).toHaveBeenCalledWith(section, 100, 0);
    vi.advanceTimersByTime(60);
    expect(document.activeElement).toBe(section);
  });

  it('scrollToHash re-aligns and re-focuses when the skeleton is swapped for the real section', async () => {
    const real = document.createElement('section');
    real.id = 'contact';
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({ top: 100 } as DOMRect);
    vi.spyOn(real, 'getBoundingClientRect').mockReturnValue({ top: 28 } as DOMRect);
    const done = service.scrollToHash('#contact');
    await vi.advanceTimersByTimeAsync(100);
    section.replaceWith(real);
    await vi.advanceTimersByTimeAsync(100);
    expect(scrollToElement).toHaveBeenLastCalledWith(real, 100, 0);
    expect(document.activeElement).toBe(real);
    await vi.advanceTimersByTimeAsync(2500);
    await done;
    real.remove();
    document.body.appendChild(section);
  });

  it('scrollToHash does not rewrite the URL', async () => {
    const spy = vi.spyOn(history, 'replaceState');
    const done = service.scrollToHash('#contact');
    await vi.advanceTimersByTimeAsync(2500);
    await done;
    expect(spy).not.toHaveBeenCalled();
  });

  it('scrollToHash ignores empty and unknown hashes', async () => {
    expect(await service.scrollToHash('')).toBe(false);
    expect(await service.scrollToHash('#nope')).toBe(false);
    expect(scrollToElement).not.toHaveBeenCalled();
  });

  it('navigateToSection keeps the hash in sync via replaceState, preserving history.state', async () => {
    history.replaceState({ navigationId: 7 }, '', '/');
    await service.navigateToSection('contact');
    expect(location.hash).toBe('#contact');
    expect(history.state).toEqual({ navigationId: 7 });
  });
});
