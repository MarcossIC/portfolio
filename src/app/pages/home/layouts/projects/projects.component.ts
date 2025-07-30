import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, type Type } from '@angular/core';
import { AngularIconComponent } from '@app/components/icons/angular/angular-icon.component';
import { Css3IconComponent } from '@app/components/icons/css3/css3-icon.component';
import { NextjsIconComponent } from '@app/components/icons/nextjs/nextjs.component';
import { OpenAiIconComponent } from '@app/components/icons/openai/openai.component';
import { ReactIconComponent } from '@app/components/icons/react/react-icon.component';
import { SassIconComponent } from '@app/components/icons/scss/sass-icon.component';
import { SpringIconComponent } from '@app/components/icons/spring/spring-icon.component';
import { TailwindIconComponent } from '@app/components/icons/tailwind-icon.component';
import type { MapIconComponents } from '@app/models/mapIconComponent';
import { I18nService } from '@app/services/i18n.service';
import { TitleComponent } from '@atoms/title/title.component';
import { PROJECTS_TITLE, PROJECTS_V2 } from '@constants/appConst';
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
  ],
})
export class ProjectsLayout {
  protected readonly i18nService = inject(I18nService);
  protected readonly PROJECTS = computed(() => this.i18nService.getConstant('appConst')?.PROJECTS_V2 || PROJECTS_V2);
  protected readonly PROJECTS_TITLE = computed(() => this.i18nService.getConstant('appConst')?.PROJECTS_TITLE || PROJECTS_TITLE);
  protected readonly titleID: string = 'home-projects-tt';
  /*If you need to add more icons, you must create the component and add it to this object*/
  private readonly iconComponents: MapIconComponents = {
    react: ReactIconComponent,
    sass: SassIconComponent,
    angular: AngularIconComponent,
    css3: Css3IconComponent,
    tailwind: TailwindIconComponent,
    spring: SpringIconComponent,
    nextjs: NextjsIconComponent,
    openai: OpenAiIconComponent
  };

  protected getIconComponent(icon: string): Type<unknown> {
    return this.iconComponents[icon] || null;
  }
}
