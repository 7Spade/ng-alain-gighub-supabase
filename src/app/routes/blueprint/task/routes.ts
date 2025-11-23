import { Routes } from '@angular/router';

import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: ':taskId', component: TaskDetailComponent }
];
