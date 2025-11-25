/**
 * Team Blueprints Component
 *
 * Team blueprints page
 * Uses app/features/blueprint as the source of truth
 *
 * @module routes/team/blueprints
 */

import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceContextFacade, ContextType } from '@core';
import { TaskListComponent } from '@features/blueprint';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-team-blueprints',
  standalone: true,
  imports: [SHARED_IMPORTS, TaskListComponent],
  template: `
    <page-header [title]="'團隊藍圖'" [breadcrumb]="breadcrumb">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>團隊空間</nz-breadcrumb-item>
          <nz-breadcrumb-item>藍圖</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <!-- Task List from Blueprint Feature -->
    <app-task-list></app-task-list>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamBlueprintsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceContext = inject(WorkspaceContextFacade);

  ngOnInit(): void {
    // Set context to team when navigating here
    const teamId = this.route.snapshot.paramMap.get('teamId');
    const currentType = this.workspaceContext.contextType();
    const currentId = this.workspaceContext.contextId();

    // Only switch if context is different to avoid redundant calls
    if (teamId && (currentType !== ContextType.TEAM || currentId !== teamId)) {
      this.workspaceContext.switchToTeam(teamId);
    }
  }
}
