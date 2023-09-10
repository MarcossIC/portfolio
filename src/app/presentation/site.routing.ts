import { Routes, RouterModule } from '@angular/router';
import { SiteComponent } from './site.component';
import { HomePageComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about/about.component';

import { ROUTES } from '../../constants/appConst';
import { ContactPageComponent } from './pages/contact/contact.component';

const routes: Routes = [
  {  
    path: ROUTES.start,
    component: SiteComponent,
    children: [
      {
        path: ROUTES.start,
        component: HomePageComponent
      },
      {
        path: ROUTES.home,
        component: HomePageComponent
      },
      {
        path: ROUTES.about,
        component: AboutPageComponent
      },
      {
        path: ROUTES.contact,
        component: ContactPageComponent
      }
    ]
  },
];

export const SiteRoutes = RouterModule.forChild(routes);
