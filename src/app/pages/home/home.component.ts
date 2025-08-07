import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroLayout } from './layouts/hero/hero.component';
import { ProjectsLayout } from './layouts/projects/projects.component';
import { ContactLayout } from '@app/pages/home/layouts/contact/contact.component';
import { ExperiencyComponent } from '@app/pages/home/layouts/experiency/experiency.component';
import { AboutMeLayout } from '@app/pages/home/layouts/about-me/about-me.component';

@Component({
  selector: 'home-page',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroLayout,
    ProjectsLayout,
    ContactLayout,
    ExperiencyComponent,
    AboutMeLayout,
  ],
})
export class HomePage {}

export default HomePage;
