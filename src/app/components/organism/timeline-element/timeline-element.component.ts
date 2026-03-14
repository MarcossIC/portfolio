import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Directions } from '@app/models/types';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-visible]': 'isVisible()',
  },
})
export class TimelineElementComponent {
  protected readonly DIRECTION = {
    LEFT: Directions.LEFT,
    RIGHT: Directions.RIGHT,
  };

  public description = input.required<string>();
  public state = input.required<string>();
  public title = input.required<string>();
  public cardDirection = input.required<string>();
  public tags = input<string[]>([]);
  public time = input<string>('');

  public isVisible = signal(false);
  public isHovered = signal(false);

  private hostEl = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const el = this.hostEl.nativeElement;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        this.isVisible.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.isVisible.set(true);
              observer.disconnect();
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );

      observer.observe(el);

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  onCardMouseEnter() {
    this.isHovered.set(true);
  }

  onCardMouseLeave() {
    this.isHovered.set(false);
  }
}
