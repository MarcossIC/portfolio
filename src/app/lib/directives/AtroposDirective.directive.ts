import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  InjectionToken,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import Atropos, { type AtroposInstance, type AtroposOptions } from 'atropos';

/**
 * Seam for the Atropos factory so tests can swap it via DI (the Angular
 * unit-test system does not reliably support `vi.mock` across the full suite).
 */
export const ATROPOS_FACTORY = new InjectionToken<(options: AtroposOptions) => AtroposInstance>(
  'ATROPOS_FACTORY',
  { providedIn: 'root', factory: () => (options) => Atropos(options) },
);

/**
 * 3D tilt effect. Only runs on fine-pointer hover devices,
 * and only while the element is near the viewport (instance is destroyed when away).
 * Atropos attaches native listeners; zoneless, so no change detection per pointer event.
 */
@Directive({
  selector: '[useAtropos]',
  standalone: true,
})
export class AtroposDirective {
  private readonly platform = inject(PLATFORM_ID);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly createAtropos = inject(ATROPOS_FACTORY);

  private instance: AtroposInstance | null = null;
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (!isPlatformBrowser(this.platform)) return;

    afterNextRender(() => {
      // Optional call: jsdom (unit tests of host components) has no matchMedia.
      const canTilt = !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
      if (!canTilt || typeof IntersectionObserver === 'undefined') return;

      this.observer = new IntersectionObserver(
        ([entry]) => (entry?.isIntersecting ? this.create() : this.teardown()),
        { rootMargin: '200px' },
      );
      this.observer.observe(this.el.nativeElement);
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.observer = null;
      this.teardown();
    });
  }

  private create(): void {
    if (this.instance) return;
    this.instance = this.createAtropos({
      el: this.el.nativeElement,
      alwaysActive: false,
      activeOffset: 30,
      rotateXMax: 10,
      rotateYMax: 10,
      shadow: false,
      highlight: false,
      duration: 250,
    });
  }

  private teardown(): void {
    this.instance?.destroy();
    this.instance = null;
  }
}
