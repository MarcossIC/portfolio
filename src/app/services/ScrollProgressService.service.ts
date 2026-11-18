import { inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReducedMotionService } from './ReducedMotion.service';

@Injectable({ providedIn: 'root' })
export class ScrollProgressService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly reducedMotion = inject(ReducedMotionService);

  ngOnDestroy(): void {
    this.destroy();
  }

  /** Cancels the in-flight programmatic scroll (set while an animation runs). */
  private cancelScroll: (() => void) | null = null;

  /**
   * Programmatic smooth scroll to a live element. The target is re-read every
   * frame so it converges even if content above reflows (defer/images).
   * Duration scales with distance (450-1000ms) unless given explicitly.
   */
  scrollToElement(element: HTMLElement, offset = 0, duration?: number): Promise<void> {
    return this.animateScroll(
      () => Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset),
      duration
    );
  }

  /** Programmatic smooth scroll to an absolute Y. */
  scrollTo(target: number, duration?: number): Promise<void> {
    return this.animateScroll(() => target, duration);
  }

  private animateScroll(getTarget: () => number, explicitDuration?: number): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();
    this.cancelScroll?.();

    const jump = (top: number) => window.scrollTo({ top, left: 0, behavior: 'instant' });

    if (this.reducedMotion.prefersReducedMotion()) {
      jump(getTarget());
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const start = window.scrollY;
      const duration =
        explicitDuration ?? Math.min(1000, Math.max(450, 400 + Math.abs(getTarget() - start) * 0.2));
      const startTime = performance.now();
      let rafId = 0;

      const userEvents = ['wheel', 'touchstart', 'keydown'] as const;
      const finish = () => {
        cancelAnimationFrame(rafId);
        for (const e of userEvents) window.removeEventListener(e, finish);
        if (this.cancelScroll === finish) this.cancelScroll = null;
        resolve();
      };
      // The user takes over: stop fighting their input.
      for (const e of userEvents) window.addEventListener(e, finish, { passive: true });
      this.cancelScroll = finish;

      const step = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
        const target = getTarget();
        if (p < 1) {
          jump(start + (target - start) * eased);
          rafId = requestAnimationFrame(step);
        } else {
          jump(target); // final snap in case something reflowed in the last frame
          finish();
        }
      };
      rafId = requestAnimationFrame(step);
    });
  }

  destroy() {
    this.cancelScroll?.();
  }
}
