import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
} from '@angular/core';
import { DIRECTION } from 'src/constants/appConst';
import { TimelineElementComponent } from '../timeline-element/timeline-element.component';
import { UserStudies } from '@app/models/types';

@Component({
  standalone: true,
  imports: [NgFor, TimelineElementComponent],
  selector: 'timeline',
  template: `
    <ul class="timeline">
      @for (ITEM of ITEMS(); track ITEM.ID) {
      <timeline-element
        [cardDirection]="$index % 2 !== 1 ? DIRECTION.LEFT : DIRECTION.RIGHT"
        [title]="ITEM.DEGREE"
        [state]="ITEM.STATE"
        [description]="ITEM.DESCRIPTION"
      ></timeline-element>
      }
    </ul>
  `,
  styleUrls: ['./timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  public ITEMS = input.required<UserStudies[]>();
  protected readonly DIRECTION = DIRECTION;
}
