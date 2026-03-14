import {
  Directive,
  ElementRef,
  inject,
  afterNextRender,
  DestroyRef,
} from '@angular/core';
import VanillaTilt from 'vanilla-tilt';

@Directive({
  selector: '[useVanillaTilt]',
})
export class VanillaTiltDirective {
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (window.innerWidth >= 768) {
        const tiltContainer = this.el.nativeElement;
        VanillaTilt.init(tiltContainer, {
          max: 20,
          scale: 1.1,
          speed: 250,
          perspective: 1000,
          transition: true,
          reset: true,
          gyroscope: true,
        });

        this.destroyRef.onDestroy(() => {
          tiltContainer?.vanillaTilt?.destroy();
        });
      }
    });
  }
}
