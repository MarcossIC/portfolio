import { TestBed } from '@angular/core/testing';
import { ScrollProgressService } from './ScrollProgressService.service';

describe('ScrollProgressService scroll animation', () => {
  let service: ScrollProgressService;
  let scrollSpy: ReturnType<typeof vi.fn>;
  let y = 0;

  const lastTop = () => scrollSpy.mock.calls.at(-1)?.[0]?.top as number;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    y = 0;
    scrollSpy = vi.fn((opts: ScrollToOptions) => {
      y = opts.top ?? 0;
    });
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });
    window.scrollTo = scrollSpy as unknown as typeof window.scrollTo;
    service = TestBed.inject(ScrollProgressService);
  });

  afterEach(() => vi.useRealTimers());

  it('scrollToElement follows the replacement when the element is swapped out (defer placeholder)', async () => {
    const skeleton = document.createElement('div');
    skeleton.id = 'swap-target';
    document.body.appendChild(skeleton);
    const real = document.createElement('section');
    real.id = 'swap-target';
    vi.spyOn(real, 'getBoundingClientRect').mockImplementation(() => ({ top: 800 - y }) as DOMRect);
    vi.spyOn(skeleton, 'getBoundingClientRect').mockImplementation(() => ({ top: -y }) as DOMRect);

    const p = service.scrollToElement(skeleton, 0, 600);
    await vi.advanceTimersByTimeAsync(100);
    skeleton.replaceWith(real); // defer swaps the placeholder mid-animation
    await vi.advanceTimersByTimeAsync(700);
    await p;
    expect(lastTop()).toBe(800);
    real.remove();
  });

  it('scrollTo eases to the target with instant per-frame writes', async () => {
    const p = service.scrollTo(1000, 600);
    await vi.advanceTimersByTimeAsync(700);
    await p;
    expect(lastTop()).toBe(1000);
    expect(scrollSpy.mock.calls[0][0].behavior).toBe('instant');
  });

  it('scales duration by distance, clamped to 450-1000ms', async () => {
    let done = false;
    service.scrollTo(10).then(() => (done = true)); // tiny distance -> 450ms
    await vi.advanceTimersByTimeAsync(400);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(100);
    expect(done).toBe(true);

    y = 0;
    done = false;
    service.scrollTo(50000).then(() => (done = true)); // huge -> 1000ms
    await vi.advanceTimersByTimeAsync(1050);
    expect(done).toBe(true);
  });

  it('cancels the animation when the user wheels, and resolves', async () => {
    const p = service.scrollTo(5000, 1000);
    await vi.advanceTimersByTimeAsync(200);
    window.dispatchEvent(new Event('wheel'));
    const calls = scrollSpy.mock.calls.length;
    await p;
    await vi.advanceTimersByTimeAsync(500);
    expect(scrollSpy.mock.calls.length).toBe(calls);
    expect(lastTop()).toBeLessThan(5000);
  });

  it('cancels on touchstart and keydown too', async () => {
    for (const type of ['touchstart', 'keydown']) {
      y = 0;
      const p = service.scrollTo(5000, 1000);
      await vi.advanceTimersByTimeAsync(100);
      window.dispatchEvent(new Event(type));
      await p;
    }
  });

  it('scrollToElement follows the live element position and snaps at the end', async () => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 900 - y }) as DOMRect;
    const p = service.scrollToElement(el, 100, 500);
    await vi.advanceTimersByTimeAsync(600);
    await p;
    expect(lastTop()).toBe(800);
  });
});
