import { Routes } from '@angular/router';

export const routes: Routes = [
  // User routes
  {
    path: 'user',
    loadChildren: () => import('./user/routes').then(m => m.routes)
  },
  // Team routes
  {
    path: 'team',
    loadChildren: () => import('./team/routes').then(m => m.routes)
  },
  // Organization routes
  {
    path: 'org',
    loadChildren: () => import('./org/routes').then(m => m.routes)
  }
];
