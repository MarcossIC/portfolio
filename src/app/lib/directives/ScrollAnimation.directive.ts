import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'blur-to-sharp';

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
  private readonly motionService = inject(ReducedMotionService);

  constructor() {
    afterNextRender(() => {
      const element = this.el.nativeElement as HTMLElement;

      // Wait for layout to settle before setting up observer
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();

        // Already scrolled past → show without animation
        if (rect.bottom < 0) {
          element.classList.add('scroll-visible');
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                element.classList.add('scroll-visible');
                observer.disconnect();
              }
            }
          },
          {
            threshold: 0.05,
            rootMargin: '20px 0px -40px 0px',
          }
        );

        observer.observe(element);
        this.destroyRef.onDestroy(() => observer.disconnect());
      });
    });
  }
}
