import { Routes } from '@angular/router';

import { BlueprintDetailComponent } from './blueprint-detail/blueprint-detail.component';
import { BlueprintListComponent } from './blueprint-list/blueprint-list.component';

export const routes: Routes = [
  { path: '', component: BlueprintListComponent },
  { path: ':id', component: BlueprintDetailComponent },
  {
    path: ':id/tasks',
    loadChildren: () => import('./task/routes').then(m => m.routes)
  }
];
