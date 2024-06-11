import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from '@app/services/seo.service';
import { HeroLayoutComponent } from './layouts/hero/hero.component';
import { ProjectsLayoutComponent } from './layouts/projects/projects.component';
import { SkillsLayoutComponent } from './layouts/skills/skillsLayout.component';
import { ServiceLayoutComponent } from './layouts/ourService/ourService.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-page',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroLayoutComponent,
    ServiceLayoutComponent,
    ProjectsLayoutComponent,
    SkillsLayoutComponent,
  ],
})
export class HomePageComponent implements OnInit {
  private seo: SeoService = inject(SeoService);
  private title: Title = inject(Title);
  constructor() {}

  ngOnInit(): void {
    let t: string = 'Home - Marcos Lopez Web Portfolio';
    this.title.setTitle(t);
    this.seo.generateTags({
      title: t,
      slug: 'home',
    });
  }
}

export default HomePageComponent;
