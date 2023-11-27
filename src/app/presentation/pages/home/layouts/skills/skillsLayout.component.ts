import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SKILLS } from 'src/constants/appConst';
import { SkillsGroupComponent } from './skills-group/skills-group.component';
import { CommonModule } from '@angular/common';
import { TitleComponent } from 'src/app/presentation/components/title/title.component';


@Component({
  standalone: true,
  imports: [CommonModule, SkillsGroupComponent, TitleComponent],
  selector: 'skills-layout',
  templateUrl: './skillsLayout.component.html',
  styleUrls: ['./skillsLayout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsLayoutComponent implements OnInit {
  SKILLS: any = SKILLS;
  constructor() { }

  ngOnInit(): void {
  }



}
