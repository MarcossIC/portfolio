import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ScrollAnimationDirective,
  resetSharedScrollObserver,
} from './ScrollAnimation.directive';

class FakeIO {
  static instances: FakeIO[] = [];
  observed = new Set<Element>();
  disconnected = false;
  constructor(
    public cb: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {
    FakeIO.instances.push(this);
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }
  fire(target: Element, isIntersecting: boolean, bottom = 100) {
    this.cb(
      [{ target, isIntersecting, boundingClientRect: { bottom } } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

@Component({
  standalone: true,
  imports: [ScrollAnimationDirective],
  template: `
    @for (i of items; track i) {
      <div class="item" scrollAnimate="fade-up"></div>
    }
  `,
})
class HostComponent {
  items = [1, 2, 3];
}

describe('ScrollAnimationDirective', () => {
  beforeEach(() => {
    FakeIO.instances = [];
    resetSharedScrollObserver();
    vi.stubGlobal('IntersectionObserver', FakeIO);
  });
  afterEach(() => {
    resetSharedScrollObserver();
    vi.unstubAllGlobals();
  });

  async function render() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    // Zoneless: whenStable() alone can resolve before afterNextRender hooks run
    // (the scheduler's tick races under load). TestBed.tick() runs them deterministically.
    TestBed.tick();
    await fixture.whenStable();
    const els = Array.from(
      fixture.nativeElement.querySelectorAll('.item')
    ) as HTMLElement[];
    return { fixture, els };
  }

  it('uses ONE shared observer for all instances and does not read layout', async () => {
    const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    const { els } = await render();
    expect(FakeIO.instances.length).toBe(1);
    expect(FakeIO.instances[0].observed.size).toBe(els.length);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('adds scroll-visible and unobserves when intersecting', async () => {
    const { els } = await render();
    const io = FakeIO.instances[0];
    io.fire(els[0], true);
    expect(els[0].classList.contains('scroll-visible')).toBe(true);
    expect(io.observed.has(els[0])).toBe(false);
    expect(els[1].classList.contains('scroll-visible')).toBe(false);
  });

  it('reveals elements already scrolled past (bottom < 0)', async () => {
    const { els } = await render();
    const io = FakeIO.instances[0];
    io.fire(els[1], false, -50);
    expect(els[1].classList.contains('scroll-visible')).toBe(true);
    expect(io.observed.has(els[1])).toBe(false);
  });

  it('keeps hidden elements below the viewport pending', async () => {
    const { els } = await render();
    const io = FakeIO.instances[0];
    io.fire(els[2], false, 900);
    expect(els[2].classList.contains('scroll-visible')).toBe(false);
    expect(io.observed.has(els[2])).toBe(true);
  });

  it('unobserves on destroy', async () => {
    const { fixture, els } = await render();
    const io = FakeIO.instances[0];
    expect(io.observed.size).toBe(els.length);
    fixture.destroy();
    expect(io.observed.size).toBe(0);
  });
});
