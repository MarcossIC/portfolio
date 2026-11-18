import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomCursorComponent } from './custom-cursor.component';

interface SetupOptions {
  coarse?: boolean;
  reduced?: boolean;
}

describe('CustomCursorComponent', () => {
  let fixture: ComponentFixture<CustomCursorComponent>;
  let host: HTMLElement;
  let target: HTMLElement | undefined;
  let coarseState = false;
  const coarseListeners = new Set<() => void>();

  async function setup({ coarse = false, reduced = false }: SetupOptions = {}): Promise<void> {
    // jsdom does not implement matchMedia
    coarseState = coarse;
    coarseListeners.clear();
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => {
        const isCoarse = query.includes('pointer: coarse');
        return {
          get matches() {
            return (isCoarse && coarseState) || (query.includes('prefers-reduced-motion') && reduced);
          },
          addEventListener: (_: string, cb: () => void) => isCoarse && coarseListeners.add(cb),
          removeEventListener: (_: string, cb: () => void) => isCoarse && coarseListeners.delete(cb),
        };
      })
    );
    // Async rAF (macrotask): a sync one would re-enter Angular's zoneless scheduler (NG0100)
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0) as unknown as number
    );
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));

    await TestBed.configureTestingModule({ imports: [CustomCursorComponent] }).compileComponents();
    fixture = TestBed.createComponent(CustomCursorComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    host = fixture.nativeElement as HTMLElement;
  }

  afterEach(() => {
    target?.remove();
    target = undefined;
    fixture?.destroy();
    vi.unstubAllGlobals();
  });

  const wait = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));

  function move(el: Element, x = 0, y = 0): void {
    el.dispatchEvent(new MouseEvent('pointerover', { bubbles: true, clientX: x, clientY: y }));
    el.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y }));
  }

  async function moveOver(el: HTMLElement, x = 0, y = 0): Promise<void> {
    move(el, x, y);
    await wait();
    await fixture.whenStable();
  }

  function make<K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    document.body.appendChild(el);
    target = el;
    return el;
  }

  const dot = () => host.querySelector('.cursor-dot') as HTMLElement;
  const ring = () => host.querySelector('.cursor-ring') as HTMLElement;

  it('should create', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start hidden and reveal on first pointermove', async () => {
    await setup();
    expect(host.classList.contains('is-visible')).toBe(false);

    await moveOver(make('div'), 10, 10);

    expect(host.classList.contains('is-visible')).toBe(true);
  });

  it('should write position directly to the element transform', async () => {
    await setup();
    await moveOver(make('div'), 120, 45);

    // No detectChanges after the move: the transform must not depend on change detection
    expect(dot().style.transform).toBe('translate3d(120px, 45px, 0)');
    expect(ring().style.transform).toBe('translate3d(120px, 45px, 0)');
  });

  it('should trail the ring with a lerp and idle once converged', async () => {
    await setup();
    const el = make('div');
    await moveOver(el, 0, 0);
    el.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 500, clientY: 0 }));
    await wait(1);

    expect(dot().style.transform).toBe('translate3d(500px, 0px, 0)');
    const match = /translate3d\(([\d.]+)px/.exec(ring().style.transform);
    expect(Number(match?.[1])).toBeLessThan(500);

    await wait(1500);
    expect(ring().style.transform).toBe('translate3d(500px, 0px, 0)');

    // Idle: nothing is scheduled while the pointer is still
    const raf = vi.fn((cb: FrameRequestCallback) => setTimeout(cb, 0) as unknown as number);
    vi.stubGlobal('requestAnimationFrame', raf);
    await wait(50);
    expect(raf).not.toHaveBeenCalled();
  });

  it('should snap the ring with reduced motion', async () => {
    await setup({ reduced: true });
    const el = make('div');
    await moveOver(el, 0, 0);
    await moveOver(el, 300, 200);

    expect(ring().style.transform).toBe('translate3d(300px, 200px, 0)');
  });

  it('should activate hover state over anchors', async () => {
    await setup();
    await moveOver(make('a'));
    expect(host.classList.contains('cursor-hover')).toBe(true);
  });

  it('should activate hover state over elements opted in via data-cursor-interactive', async () => {
    await setup();
    const el = make('div');
    el.setAttribute('data-cursor-interactive', '');
    await moveOver(el);
    expect(host.classList.contains('cursor-hover')).toBe(true);
  });

  it('should not activate hover state over plain elements', async () => {
    await setup();
    await moveOver(make('div'));
    expect(host.classList.contains('cursor-hover')).toBe(false);
  });

  it('should show the localized label over projects', async () => {
    await setup();
    const el = make('div');
    el.className = 'project-card-container';
    await moveOver(el);
    fixture.detectChanges();

    expect(host.classList.contains('cursor-project')).toBe(true);
    expect(host.classList.contains('cursor-hover')).toBe(false);
    expect(host.querySelector('.cursor-label')?.textContent?.trim()).toMatch(/^(Ver|View)$/);
  });

  it('should only touch classes when the state changes', async () => {
    await setup();
    const link = make('a');
    await moveOver(link);

    const spy = vi.spyOn(host.classList, 'toggle');
    await moveOver(link, 5, 5);
    await moveOver(link, 9, 9);

    expect(spy).not.toHaveBeenCalled();

    await moveOver(make('div'), 20, 20);
    expect(spy).toHaveBeenCalledWith('cursor-hover', false);
  });

  it('should toggle the pressed state on pointerdown/up', async () => {
    await setup();
    await moveOver(make('div'));

    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(host.classList.contains('cursor-pressed')).toBe(true);
    document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    expect(host.classList.contains('cursor-pressed')).toBe(false);
  });

  it('should hide over text inputs and textareas to expose the native cursor', async () => {
    await setup();
    await moveOver(make('div'));
    expect(host.classList.contains('is-visible')).toBe(true);

    await moveOver(make('textarea'));
    expect(host.classList.contains('is-visible')).toBe(false);

    await moveOver(make('input'));
    expect(host.classList.contains('is-visible')).toBe(false);

    await moveOver(make('div'));
    expect(host.classList.contains('is-visible')).toBe(true);
  });

  it('should hide when the pointer leaves the window and return on move', async () => {
    await setup();
    const el = make('div');
    await moveOver(el);

    document.documentElement.dispatchEvent(
      new MouseEvent('mouseout', { bubbles: true, relatedTarget: null })
    );
    expect(host.classList.contains('is-visible')).toBe(false);

    await moveOver(el, 3, 3);
    expect(host.classList.contains('is-visible')).toBe(true);
  });

  it('should stay inactive on coarse pointers', async () => {
    await setup({ coarse: true });
    await moveOver(make('a'), 10, 10);

    expect(host.classList.contains('is-visible')).toBe(false);
    expect(document.getElementById('custom-cursor-hide')).toBeNull();
  });

  it('should remove the injected style on destroy', async () => {
    await setup();
    await moveOver(make('div'));
    expect(document.getElementById('custom-cursor-hide')).not.toBeNull();

    fixture.destroy();
    expect(document.getElementById('custom-cursor-hide')).toBeNull();
  });

  it('releases the native cursor when the primary pointer turns coarse, and re-engages when it returns', async () => {
    await setup();
    await moveOver(make('div'), 5, 5);
    expect(document.getElementById('custom-cursor-hide')).toBeTruthy();

    coarseState = true;
    coarseListeners.forEach((cb) => cb());
    expect(document.getElementById('custom-cursor-hide')).toBeNull();
    expect(host.classList.contains('is-visible')).toBe(false);

    coarseState = false;
    coarseListeners.forEach((cb) => cb());
    await moveOver(make('div'), 8, 8);
    expect(document.getElementById('custom-cursor-hide')).toBeTruthy();
    expect(host.classList.contains('is-visible')).toBe(true);
  });

  it('removes the media-query listener on destroy', async () => {
    await setup();
    expect(coarseListeners.size).toBe(1);
    fixture.destroy();
    expect(coarseListeners.size).toBe(0);
  });
});
