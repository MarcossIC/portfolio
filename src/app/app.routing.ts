import { Routes } from '@angular/router';
import { ToastService } from '@app/lib/toast/Toast.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/home/home.component'),
  },
];
