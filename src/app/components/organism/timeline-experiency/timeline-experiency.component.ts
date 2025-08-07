import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimelineElementComponent } from '../timeline-element/timeline-element.component';
import { Directions, UserExperience, type UserStudies } from '@app/models/types';

@Component({
  standalone: true,
  imports: [TimelineElementComponent],
  selector: 'timeline-experiency',
  template: `
      <ul class="timeline">
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
      </ul>
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
}
