import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TitleComponent } from '@atoms/title/title.component';
import { PROJECTS_V2 } from '@constants/appConst';
import { ProjectArticleComponent } from '@organism/project-article/project-article.component';

@Component({
  standalone: true,
  selector: 'projects-layout',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TitleComponent, ProjectArticleComponent],
})
export class ProjectsLayoutComponent implements OnInit {
  protected readonly PROJECTS: any = PROJECTS_V2;
  protected readonly titleID: string = 'home-projects-tt';
  constructor() {}

  ngOnInit(): void {}
}
