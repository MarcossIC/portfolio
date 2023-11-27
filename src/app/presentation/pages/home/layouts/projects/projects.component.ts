import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProjectCardComponent } from 'src/app/presentation/components/project-card/project-card.component';
import { TitleComponent } from 'src/app/presentation/components/title/title.component';
import { PROJECTS } from 'src/constants/appConst';

@Component({
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, TitleComponent],
  selector: 'projects-layout',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsLayoutComponent implements OnInit {
  protected PROJECTS: any = PROJECTS;
  constructor() { }

  ngOnInit(): void {
  }

  protected trackByFn(index: number, data: any): number | string{
    return data.ID;
  }
}
