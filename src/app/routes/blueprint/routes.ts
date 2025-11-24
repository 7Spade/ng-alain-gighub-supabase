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
    path: 'create',
    loadComponent: () => import('./create-blueprint/create-blueprint.component').then(m => m.CreateBlueprintComponent),
    data: { title: '建立藍圖' }
  },
  {
    path: 'update/:id',
    loadComponent: () => import('./update-blueprint/update-blueprint.component').then(m => m.UpdateBlueprintComponent),
    data: { title: '編輯藍圖' }
  },
  {
    path: 'delete/:id',
    loadComponent: () => import('./delete-blueprint/delete-blueprint.component').then(m => m.DeleteBlueprintComponent),
    data: { title: '刪除藍圖' }
  },
  {
    path: 'task',
    loadComponent: () => import('./task/task-list.component').then(m => m.TaskListComponent),
    data: { title: '任務管理' }
  },
  {
    path: 'task/create',
    loadComponent: () => import('./task/create-task/create-task.component').then(m => m.CreateTaskComponent),
    data: { title: '建立任務' }
  },
  {
    path: 'task/update/:id',
    loadComponent: () => import('./task/update-task/update-task.component').then(m => m.UpdateTaskComponent),
    data: { title: '編輯任務' }
  },
  {
    path: 'task/delete/:id',
    loadComponent: () => import('./task/delete-task/delete-task.component').then(m => m.DeleteTaskComponent),
    data: { title: '刪除任務' }
  }
];
