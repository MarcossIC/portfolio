import { TestBed } from '@angular/core/testing';
import { ScrollProgressBarComponent } from './scroll-progress-bar.component';

describe('ScrollProgressBarComponent', () => {
  let y = 0;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    y = 0;
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 500 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 1500 });
    (globalThis as any).ResizeObserver ??= class {
      observe() {}
      disconnect() {}
    };
  });

  afterEach(() => vi.useRealTimers());

  const setup = async () => {
    const fixture = TestBed.createComponent(ScrollProgressBarComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    vi.advanceTimersByTime(20);
    return fixture;
  };
  const bar = (f: { nativeElement: HTMLElement }) => f.nativeElement.querySelector('.scroll-bar') as HTMLElement;

  it('writes scaleX straight to the element on scroll, rAF-throttled', async () => {
    const fixture = await setup();
    y = 500; // half of max scroll (1500 - 500 = 1000)
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(20);
    expect(bar(fixture).style.transform).toBe('scaleX(0.5)');
  });

  it('does not mark the component dirty on scroll (no signal per frame)', async () => {
    const fixture = await setup();
    const spy = vi.spyOn(fixture.componentRef.changeDetectorRef, 'markForCheck');
    y = 250;
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(20);
    expect(spy).not.toHaveBeenCalled();
    expect('progress' in (fixture.componentInstance as object)).toBe(false);
  });

  it('registers a passive scroll listener', async () => {
    const add = vi.spyOn(window, 'addEventListener');
    await setup();
    const call = add.mock.calls.find((c) => c[0] === 'scroll');
    expect(call?.[2]).toEqual(expect.objectContaining({ passive: true }));
  });
});
