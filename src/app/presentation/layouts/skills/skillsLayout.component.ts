import { Component, OnInit } from '@angular/core';
import { SKILLS } from 'src/constants/appConst';
import AOS from 'aos';

@Component({
  selector: 'skills-layout',
  templateUrl: './skillsLayout.component.html',
  styleUrls: ['./skillsLayout.component.css']
})
export class SkillsLayoutComponent implements OnInit {
  SKILLS: any = SKILLS;
  constructor() { }

  ngOnInit() {
    AOS.init();
  }

}
