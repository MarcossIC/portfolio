import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { NavigationService } from '@app/services/NavigationService.service';
import { HeroLayout } from './layouts/hero/hero.component';
import { ProjectsLayout } from './layouts/projects/projects.component';
import { ContactLayout } from '@app/pages/home/layouts/contact/contact.component';
import { ExperiencyComponent } from '@app/pages/home/layouts/experiency/experiency.component';
import { AboutMeLayout } from '@app/pages/home/layouts/about-me/about-me.component';
import { ProjectSkeletonComponent } from '@app/components/atoms/skeleton/project-skeleton.component';
import { ContactSkeletonComponent } from '@app/components/atoms/skeleton/contact-skeleton.component';

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
    ProjectSkeletonComponent,
    ContactSkeletonComponent,
  ],
})
export class HomePage {
  private readonly navigation = inject(NavigationService);

  constructor() {
    // Deep link (/#contact): browser only, after hydration. The sections behind
    // @defer carry their ids on skeletons, so the target exists before it renders.
    afterNextRender(() => void this.navigation.scrollToHash());
  }
}

export default HomePage;
