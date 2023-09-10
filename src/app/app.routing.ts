import { Routes, RouterModule } from '@angular/router';
import { SiteModule } from './presentation/site.module';

import { ROUTES } from '../constants/appConst';

const routes: Routes = [
  {  
    path: ROUTES.start,
    component: SiteModule
  }
];

export const AppRoutes = RouterModule.forRoot(routes);
