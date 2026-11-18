import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    // Flush afterNextRender (scroll listener registration) before tests tweak scrollY.
    TestBed.tick();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.documentElement.style.overflow = '';
  });

  const toggle = () => el.querySelector<HTMLButtonElement>('.mobile-toggle')!;
  const panel = () => el.querySelector<HTMLElement>('.mobile-nav')!;
  const open = () => {
    toggle().click();
    fixture.detectChanges();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps one constant glass class regardless of scroll (no backdrop-filter swap)', () => {
    const header = el.querySelector('header')!;
    expect(header.classList.contains('glass')).toBe(true);
    expect(header.classList.contains('glass-strong')).toBe(false);
  });

  it('flips the scrolled state only when the threshold is crossed, throttled by rAF', () => {
    const queue: FrameRequestCallback[] = [];
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      queue.push(cb);
      return queue.length;
    });
    const flush = () => queue.splice(0).forEach((cb) => cb(0));
    const header = el.querySelector('header')!;

    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    const callsAfterBurst = raf.mock.calls.length;
    window.dispatchEvent(new Event('scroll'));
    expect(raf.mock.calls.length).toBe(callsAfterBurst); // burst coalesced: no extra rAF requests while one is pending
    flush();
    fixture.detectChanges();
    expect(header.classList.contains('is-scrolled')).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    flush();
    fixture.detectChanges();
    expect(header.classList.contains('is-scrolled')).toBe(false);
  });

  it('exposes aria-expanded/aria-controls on the toggle and keeps the closed panel inert', () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(toggle().getAttribute('aria-controls')).toBe(panel().id);
    expect(panel().hasAttribute('inert')).toBe(true);

    open();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(panel().hasAttribute('inert')).toBe(false);
    expect(panel().classList.contains('is-open')).toBe(true);
  });

  it('closes on Escape and returns focus to the toggle', () => {
    open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle());
  });

  it('closes on outside pointerdown but not on inside pointerdown', () => {
    open();
    panel().dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('locks html scroll while open and releases it on close', () => {
    open();
    expect(document.documentElement.style.overflow).toBe('hidden');
    toggle().click();
    fixture.detectChanges();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('releases the scroll lock when destroyed while open', () => {
    open();
    fixture.destroy();
    expect(document.documentElement.style.overflow).toBe('');
  });
});
