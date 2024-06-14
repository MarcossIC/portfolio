import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { DIRECTION } from 'src/constants/appConst';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineElementComponent {
  protected DIRECTION: any = DIRECTION;
  @ViewChild('titleElement', { static: true })
  titleElement!: ElementRef<HTMLHeadingElement>;

  @Input({ required: true }) public description: string = '';
  @Input({ required: true }) public state: string = '';
  @Input({ required: true }) public title: string = '';
  @Input({ required: true }) public strong: string = '';
  @Input({ required: true }) public strongStyle: string = '';
  @Input({ required: true }) public cardDirection: string = '';
}
