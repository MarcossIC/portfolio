import { Routes } from '@angular/router';
import { ToastService } from '@app/lib/toast/Toast.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactModule),
    providers: [ToastService],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/home/home.component'),
  },
];
