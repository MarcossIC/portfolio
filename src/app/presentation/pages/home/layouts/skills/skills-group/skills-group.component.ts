import { Component, OnInit } from '@angular/core';
import { TECHNOLOGIES } from 'src/constants/technologiesConst';

@Component({
  selector: 'skills-group',
  templateUrl: './skills-group.component.html',
  styleUrls: ['./skills-group.component.css']
})
export class SkillsGroupComponent implements OnInit {
  TECHNOLOGIES: any = TECHNOLOGIES;

  aosNum: number = 1000;

  constructor() { }

  ngOnInit(): void {
  }

}
