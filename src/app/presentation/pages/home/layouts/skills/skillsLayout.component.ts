import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SKILLS } from 'src/constants/appConst';
import { SkillsGroupComponent } from './skills-group/skills-group.component';
import { TitleComponent } from 'src/app/presentation/components/title/title.component';


@Component({
  standalone: true,
  imports: [SkillsGroupComponent, TitleComponent],
  selector: 'skills-layout',
  templateUrl: './skillsLayout.component.html',
  styleUrls: ['./skillsLayout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsLayoutComponent implements OnInit {
  protected readonly SKILLS: any = SKILLS;
  protected readonly titleID: string = "b11d-4fa6";
  constructor() { }

  ngOnInit(): void {
  }



}
