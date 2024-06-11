import { Routes } from '@angular/router';

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
