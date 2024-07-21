import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroLayoutComponent } from './layouts/hero/hero.component';
import { ProjectsLayoutComponent } from './layouts/projects/projects.component';
import { BentoAboutLayout } from '@app/pages/home/layouts/bento-about/bento-about.component';
import { ContactLayoutComponent } from '@app/pages/home/layouts/contact/contact.component';
import { StudiesLayoutComponent } from '@app/pages/home/layouts/studies/studies.component';
import { ToastComponent } from '@app/components/organism/toast/toast.component';

@Component({
  selector: 'home-page',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroLayoutComponent,
    ProjectsLayoutComponent,
    BentoAboutLayout,
    ContactLayoutComponent,
    StudiesLayoutComponent,
  ],
})
export class HomePageComponent {}

export default HomePageComponent;
