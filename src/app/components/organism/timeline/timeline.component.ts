import { CommonModule, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DIRECTION } from 'src/constants/appConst';
import { TimelineElementComponent } from '../timeline-element/timeline-element.component';

@Component({
  standalone: true,
  imports: [NgFor, TimelineElementComponent],
  selector: 'timeline',
  template: `
    <ul class="timeline">
      @for (ITEM of ITEMS; track ITEM.ID) {
      <timeline-element
        [cardDirection]="$index % 2 !== 1 ? DIRECTION.LEFT : DIRECTION.RIGHT"
        [title]="ITEM.DEGREE"
        [strong]="ITEM.STRONG"
        strongStyle="text-red-700"
        [state]="ITEM.STATE"
        [description]="ITEM.DESCRIPTION"
      ></timeline-element>
      }
    </ul>
  `,
  styleUrls: ['./timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit {
  @Input({ required: true }) public ITEMS: any[] = [];
  protected DIRECTION: any = DIRECTION;

  constructor() {}

  ngOnInit(): void {}
}
