import { Routes, RouterModule } from '@angular/router';
import { AboutPageComponent } from './about.component';

const routes: Routes = [
  {  
    path: '',
    component: AboutPageComponent
  },
];

export const AboutRoutes = RouterModule.forChild(routes);
