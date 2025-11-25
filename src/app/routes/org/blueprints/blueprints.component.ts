/**
 * Organization Blueprints Component
 *
 * Organization blueprints page
 * Uses app/features/blueprint as the source of truth
 *
 * @module routes/org/blueprints
 */

import { Component, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { WorkspaceContextFacade, ContextType } from '@core';

import { TaskListComponent } from '@features/blueprint';

@Component({
  selector: 'app-org-blueprints',
  standalone: true,
  imports: [SHARED_IMPORTS, TaskListComponent],
  template: `
    <page-header [title]="'組織藍圖'" [breadcrumb]="breadcrumb">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>組織空間</nz-breadcrumb-item>
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
export class OrgBlueprintsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workspaceContext = inject(WorkspaceContextFacade);

  constructor() {
    // Ensure context is set to organization when navigating here
    effect(() => {
      const orgId = this.route.snapshot.paramMap.get('organizationId');
      const currentType = this.workspaceContext.contextType();
      const currentId = this.workspaceContext.contextId();

      if (orgId && (currentType !== ContextType.ORGANIZATION || currentId !== orgId)) {
        this.workspaceContext.switchToOrganization(orgId);
      }
    });
  }

  ngOnInit(): void {
    const orgId = this.route.snapshot.paramMap.get('organizationId');
    if (orgId) {
      this.workspaceContext.switchToOrganization(orgId);
    }
  }
}
