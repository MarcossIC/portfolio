import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  isBright: boolean;
}

@Component({
  standalone: true,
  selector: 'cosmic-background',
  templateUrl: './cosmic-background.component.html',
  styleUrl: './cosmic-background.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosmicBackgroundComponent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly parallaxLayer = viewChild<ElementRef<HTMLDivElement>>('parallaxLayer');

  protected readonly stars: Star[] = Array.from({ length: 80 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.6 + 0.2,
    isBright: Math.random() * 2.5 + 0.5 > 2,
  }));

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const layer = this.parallaxLayer()?.nativeElement;
      if (!layer) return;

      const handleMouse = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        layer.style.transform = `translate(${x}px, ${y}px)`;
      };

      window.addEventListener('mousemove', handleMouse, { passive: true });
    });
  }
}
