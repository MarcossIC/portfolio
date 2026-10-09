import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, type Type } from '@angular/core';
import { AngularIconComponent } from '@app/components/icons/angular/angular-icon.component';
import { Css3IconComponent } from '@app/components/icons/css3/css3-icon.component';
import { DockerIconComponent } from '@app/components/icons/docker/docker.component';
import { NestjsIconComponent } from '@app/components/icons/nestjs/nestjs.component';
import { NextjsIconComponent } from '@app/components/icons/nextjs/nextjs.component';
import { NuxtIconComponent } from '@app/components/icons/nuxt/nuxt.component';
import { OpenAiIconComponent } from '@app/components/icons/openai/openai.component';
import { PlaywrightIconComponent } from '@app/components/icons/playwright/playwright.component';
import { ReactIconComponent } from '@app/components/icons/react/react-icon.component';
import { RustIconComponent } from '@app/components/icons/rust/rust.component';
import { SassIconComponent } from '@app/components/icons/scss/sass-icon.component';
import { SpringIconComponent } from '@app/components/icons/spring/spring-icon.component';
import { SqlServerIconComponent } from '@app/components/icons/sqlserver/sqlserver.component';
import { TailwindIconComponent } from '@app/components/icons/tailwind-icon.component';
import { TauriIconComponent } from '@app/components/icons/tauri/tauri.component';
import type { MapIconComponents } from '@app/models/mapIconComponent';
import { I18nService } from '@app/services/i18n.service';
import { TitleComponent } from '@atoms/title/title.component';
import { PROJECTS_TITLE, PROJECTS_V2 } from '@constants/appConst';
import { ProjectArticleComponent } from '@organism/project-article/project-article.component';
import { ScrollAnimationDirective } from '@lib/directives/ScrollAnimation.directive';

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
    ScrollAnimationDirective,
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
    nuxt: NuxtIconComponent,
    nestjs: NestjsIconComponent,
    sqlserver: SqlServerIconComponent,
    playwright: PlaywrightIconComponent,
    tauri: TauriIconComponent,
    rust: RustIconComponent,
    docker: DockerIconComponent,
    openai: OpenAiIconComponent
  };

  protected getIconComponent(icon: string): Type<unknown> {
    return this.iconComponents[icon] || null;
  }
}
