import { Routes } from '@angular/router';

export const routes: Routes = [
  // Unified dashboard (context-aware)
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: { title: '儀表板' }
  },
  // Unified settings (context-aware)
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    data: { title: '設定' }
  },
  // Legacy routes (for backward compatibility - will be removed in future)
  {
    path: 'user',
    loadChildren: () => import('./user/routes').then(m => m.routes)
  },
  {
    path: 'team',
    loadChildren: () => import('./team/routes').then(m => m.routes)
  },
  {
    path: 'org',
    loadChildren: () => import('./org/routes').then(m => m.routes)
  }
];
