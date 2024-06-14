import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SkillComponent } from '@app/components/molecules/skill/skill.component';
import { TECHNOLOGIES } from 'src/constants/technologiesConst';

@Component({
  standalone: true,
  imports: [CommonModule, SkillComponent],
  selector: 'skills-group',
  templateUrl: './skills-group.component.html',
  styleUrls: ['./skills-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsGroupComponent implements OnInit {
  TECHNOLOGIES: any = TECHNOLOGIES;

  aosNum: number = 1000;

  constructor() {}

  ngOnInit(): void {}

  protected trackByFn(index: number, data: any): number | string {
    return data.ID;
  }
}
