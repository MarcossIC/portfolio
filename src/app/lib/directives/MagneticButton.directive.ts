import {
  afterNextRender,
  Directive,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';

@Directive({
  standalone: true,
  selector: '[magneticButton]',
  host: {
    '[style.transition]': '"transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"',
    '[style.will-change]': '"transform"',
  },
})
export class MagneticButtonDirective {
  private readonly el = inject(ElementRef);
  private readonly platform = inject(PLATFORM_ID);
  private readonly motionService = inject(ReducedMotionService);
  private enabled = false;
  private readonly strength = 0.3;

  constructor() {
    afterNextRender(() => {
      this.enabled = isPlatformBrowser(this.platform) && !this.motionService.prefersReducedMotion();
    });
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.enabled) return;

    const el = this.el.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (event.clientX - centerX) * this.strength;
    const dy = (event.clientY - centerY) * this.strength;

    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    if (!this.enabled) return;
    (this.el.nativeElement as HTMLElement).style.transform = 'translate(0, 0)';
  }
}
