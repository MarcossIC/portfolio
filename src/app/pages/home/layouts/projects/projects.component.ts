import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AngularIconComponent } from '@app/components/icons/angular-icon.component';
import { Css3IconComponent } from '@app/components/icons/css3-icon.component';
import { ReactIconComponent } from '@app/components/icons/react-icon.component';
import { SassIconComponent } from '@app/components/icons/sass-icon.component';
import { SpringIconComponent } from '@app/components/icons/spring-icon.component';
import { TailwindIconComponent } from '@app/components/icons/tailwind-icon.component';
import { TitleComponent } from '@atoms/title/title.component';
import { PROJECTS_V2 } from '@constants/appConst';
import { ProjectArticleComponent } from '@organism/project-article/project-article.component';

@Component({
  standalone: true,
  selector: 'projects-layout',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TitleComponent,
    ProjectArticleComponent,

    ReactIconComponent,
    SassIconComponent,
    SpringIconComponent,
    Css3IconComponent,
    AngularIconComponent,
    TailwindIconComponent,
  ],
})
export class ProjectsLayoutComponent implements OnInit {
  protected readonly PROJECTS: any = PROJECTS_V2;
  protected readonly titleID: string = 'home-projects-tt';
  constructor() {}

  ngOnInit(): void {}
}
