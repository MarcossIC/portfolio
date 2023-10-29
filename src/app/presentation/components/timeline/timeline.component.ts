import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DIRECTION } from 'src/constants/appConst';
import { TimelineElementComponent } from '../timeline-element/timeline-element.component';

@Component({
  standalone: true,
  imports: [CommonModule, TimelineElementComponent],
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() public ITEMS: any[] = [];

  protected DIRECTION: any = DIRECTION;
  constructor() { }

  ngOnInit(): void {
  }

}
