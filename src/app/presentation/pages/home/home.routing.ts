import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home.component';

const routes: Routes = [
  {  
    path: '',
    component: HomePageComponent
  },
];

export const HomeRoutes = RouterModule.forChild(routes);
