import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TimelineElementComponent } from '../timeline-element/timeline-element.component';
import { Directions, UserExperience, type UserStudies } from '@app/models/types';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';

@Component({
  standalone: true,
  imports: [TimelineElementComponent],
  selector: 'timeline-experiency',
  template: `
      <div class="timeline" #timelineContainer>
        <div
          class="timeline-progress"
          [style.--timeline-scale]="timelineFill()"
        ></div>
        @for (ITEM of ITEMS(); track ITEM.ID) {
          <timeline-element
            [cardDirection]="$index % 2 !== 1 ? DIRECTION.LEFT : DIRECTION.RIGHT"
            [title]="ITEM.ROLE"
            [state]="ITEM.COMPANY"
            [description]="ITEM.DESCRIPTION"
            [tags]="ITEM.STACK"
            [time]="ITEM.TIME"
            [style.width]="'100%'"
          ></timeline-element>
        }
      </div>
  `,
  styleUrls: ['./timeline-experiency.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineExperiencyComponent {
  public ITEMS = input.required<UserExperience[]>();
  protected readonly DIRECTION = {
    LEFT: Directions.LEFT,
    RIGHT: Directions.RIGHT,
  };

  private readonly motionService = inject(ReducedMotionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly timelineContainer = viewChild<ElementRef>('timelineContainer');

  protected readonly timelineFill = signal(0);

  constructor() {
    afterNextRender(() => {
      if (this.motionService.prefersReducedMotion()) {
        this.timelineFill.set(1);
        return;
      }

      let ticking = false;
      const updateFill = () => {
        const container = this.timelineContainer()?.nativeElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;

        if (rect.top > vh) {
          this.timelineFill.set(0);
        } else {
          const fill = Math.min(Math.max((vh - rect.top) / rect.height, 0), 1);
          this.timelineFill.set(fill);
        }
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateFill);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
      onScroll(); // Initial check
    });
  }
}
