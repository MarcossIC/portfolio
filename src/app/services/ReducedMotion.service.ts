import {
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ReducedMotionService {
  private readonly platform = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _prefersReducedMotion = signal(false);
  public readonly prefersReducedMotion = this._prefersReducedMotion.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this._prefersReducedMotion.set(mediaQuery.matches);

      const listener = (event: MediaQueryListEvent) => {
        this._prefersReducedMotion.set(event.matches);
      };

      mediaQuery.addEventListener('change', listener);
      this.destroyRef.onDestroy(() => {
        mediaQuery.removeEventListener('change', listener);
      });
    }
  }
}
