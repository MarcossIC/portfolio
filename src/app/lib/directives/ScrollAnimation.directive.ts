import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'blur-to-sharp';

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.05,
  rootMargin: '20px 0px -40px 0px',
};

// One observer for every instance: avoids N observer objects and, unlike the old
// rAF + getBoundingClientRect, never forces a synchronous layout. The first IO
// callback delivers the initial state (including "already scrolled past").
let sharedObserver: IntersectionObserver | undefined;
const targets = new WeakSet<Element>();

function reveal(el: Element): void {
  el.classList.add('scroll-visible');
  sharedObserver?.unobserve(el);
  targets.delete(el);
}

function getObserver(): IntersectionObserver {
  return (sharedObserver ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      // Past the viewport top (deep-link/refresh mid-page) never intersects
      // again going forward, so reveal it too.
      if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
        reveal(entry.target);
      }
    }
  }, OBSERVER_OPTIONS));
}

/** Test hook: drop the module-level observer. */
export function resetSharedScrollObserver(): void {
  sharedObserver?.disconnect();
  sharedObserver = undefined;
}

@Directive({
  standalone: true,
  selector: '[scrollAnimate]',
  host: {
    '[attr.data-scroll-animate]': 'scrollAnimate()',
    '[style.--scroll-delay]': 'scrollDelay()',
    '[style.--scroll-dur]': 'scrollDuration()',
  },
})
export class ScrollAnimationDirective {
  public scrollAnimate = input.required<ScrollAnimationType>();
  public scrollThreshold = input<number>(0.15);
  public scrollDelay = input<string>('0s');
  public scrollDuration = input<string>('0.7s');

  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const element = this.el.nativeElement as HTMLElement;

    // Registered synchronously while the DestroyRef is alive (NG0911-safe).
    this.destroyRef.onDestroy(() => {
      if (targets.delete(element)) sharedObserver?.unobserve(element);
    });

    afterNextRender(() => {
      targets.add(element);
      getObserver().observe(element);
    });
  }
}
