/**
 * Blueprint Routes
 *
 * Route configuration for Blueprint Container module
 * Following docs/00-順序.md standards
 *
 * @module blueprint.routes
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blueprint-container.component').then(m => m.BlueprintContainerComponent),
    data: { title: '藍圖容器' }
  },
  {
    path: 'task',
    loadComponent: () => import('./task/task-list.component').then(m => m.TaskListComponent),
    data: { title: '任務管理' }
  }
];
