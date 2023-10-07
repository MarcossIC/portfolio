import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {  
    path: 'home',
    loadChildren: () =>import('./presentation/pages/home/home.module').then(m => m.HomeModule)
  },
  {  
    path: 'about',
    loadChildren: () =>import('./presentation/pages/about/about.module').then(m => m.AboutModule),
  },
  {  
    path: 'contact',
    loadChildren: () =>import('./presentation/pages/contact/contact.module').then(m => m.ContactModule),
  },
  { 
    path: '**', 
    loadChildren: () =>import('./presentation/pages/home/home.module').then(m => m.HomeModule),
  }
];

export const AppRoutes = RouterModule.forRoot(routes);
