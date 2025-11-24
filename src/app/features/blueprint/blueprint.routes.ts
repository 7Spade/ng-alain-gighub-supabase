/**
 * Blueprint Routes
 *
 * Route configuration for Blueprint feature module
 * Following vertical slice architecture
 *
 * @module features/blueprint/blueprint.routes
 */

import { Routes } from '@angular/router';

export const BLUEPRINT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/blueprint-shell/blueprint-shell.component').then(m => m.BlueprintShellComponent),
    data: { title: '藍圖容器' }
  },
  {
    path: 'task',
    loadComponent: () => import('./ui/task/task-list.component').then(m => m.TaskListComponent),
    data: { title: '任務管理' }
  }
];

export default BLUEPRINT_ROUTES;
