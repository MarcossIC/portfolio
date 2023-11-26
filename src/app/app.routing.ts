import { Routes, RouterModule } from '@angular/router';
import { ToastService } from 'src/app/data/services/toast/Toast.service';

const routes: Routes = [
  {  
    path: '',
    loadChildren: () =>import('./presentation/pages/home/home.module').then(m => m.HomeModule)
  },
  {  
    path: 'about',
    loadChildren: () =>import('./presentation/pages/about/about.module').then(m => m.AboutModule),
  },
  {  
    path: 'contact',
    loadChildren: () =>import('./presentation/pages/contact/contact.module').then(m => m.ContactModule),
    providers: [ToastService],
  },
  { 
    path: '**', 
    loadChildren: () =>import('./presentation/pages/home/home.module').then(m => m.HomeModule),
  }
];

export const AppRoutes = RouterModule.forRoot(routes);
