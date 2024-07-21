import { Routes } from '@angular/router';
import { ToastService } from '@app/lib/toast/Toast.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
    title:
      'Marcos Lopez Portfolio - Website to see projects and experiences of Marcos Lopez',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/home/home.component'),
    title:
      'Marcos Lopez Portfolio - Website to see projects and experiences of Marcos Lopez',
  },
];
