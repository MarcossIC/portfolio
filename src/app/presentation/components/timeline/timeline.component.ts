import { Component, Input, OnInit } from '@angular/core';
import { DIRECTION } from 'src/constants/appConst';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() public ITEMS: any[] = [];

  protected DIRECTION: any = DIRECTION;
  constructor() { }

  ngOnInit() {
  }

}
