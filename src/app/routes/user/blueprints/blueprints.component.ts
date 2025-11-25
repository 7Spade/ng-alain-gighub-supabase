/**
 * User Blueprints Component
 *
 * User's personal blueprints page
 * Uses app/features/blueprint as the source of truth
 *
 * @module routes/user/blueprints
 */

import { Component, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { WorkspaceContextFacade, ContextType } from '@core';

import { TaskListComponent } from '@features/blueprint';

@Component({
  selector: 'app-user-blueprints',
  standalone: true,
  imports: [SHARED_IMPORTS, TaskListComponent],
  template: `
    <page-header [title]="'我的藍圖'" [breadcrumb]="breadcrumb">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>個人空間</nz-breadcrumb-item>
          <nz-breadcrumb-item>藍圖</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <!-- Task List from Blueprint Feature -->
    <app-task-list></app-task-list>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBlueprintsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workspaceContext = inject(WorkspaceContextFacade);

  constructor() {
    // Ensure context is set to user when navigating here
    effect(() => {
      const userId = this.route.snapshot.paramMap.get('userId');
      const currentType = this.workspaceContext.contextType();
      const currentId = this.workspaceContext.contextId();

      if (userId && (currentType !== ContextType.USER || currentId !== userId)) {
        this.workspaceContext.switchToUser(userId);
      }
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.workspaceContext.switchToUser(userId);
    }
  }
}
