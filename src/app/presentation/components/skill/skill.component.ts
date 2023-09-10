import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  @Input() public icon: string = '';
  @Input() public caption: string = '';
  @Input() public size: number = 50;

  constructor() { }

  ngOnInit() {
  }

}
