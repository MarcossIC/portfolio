import type { Routes } from '@angular/router';

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
