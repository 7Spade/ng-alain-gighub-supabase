/**
 * Team Blueprints Component
 *
 * Display team blueprints list with navigation to blueprint container
 * Following docs/00-順序.md Component layer standards
 *
 * Features:
 * - List team blueprints
 * - Navigate to blueprint container
 * - Create new blueprint (team level)
 * - Filter and search blueprints
 *
 * @module team-blueprints.component
 */

import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlueprintFacade } from '@core';
import { SHARED_IMPORTS, BlueprintModel } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-team-blueprints',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'團隊藍圖'">
      <ng-template #action>
        <button nz-button nzType="primary" (click)="onCreateBlueprint()">
          <i nz-icon nzType="plus" nzTheme="outline"></i>
          新增團隊藍圖
        </button>
      </ng-template>
    </page-header>

    <!-- Loading State -->
    @if (loading()) {
      <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
    }

    <!-- Error State -->
    @if (error()) {
      <nz-alert
        nzType="error"
        [nzMessage]="'載入失敗'"
        [nzDescription]="error()"
        nzShowIcon
        [nzCloseable]="true"
        (nzOnClose)="clearError()"
      ></nz-alert>
    }

    <!-- Blueprint List -->
    <nz-card [nzTitle]="'團隊藍圖列表'">
      <!-- Search and Filter -->
      <div class="mb-md">
        <nz-input-group [nzPrefix]="prefixIconSearch">
          <input type="text" nz-input placeholder="搜尋藍圖..." [(ngModel)]="searchTerm" (ngModelChange)="onSearch($event)" />
        </nz-input-group>
        <ng-template #prefixIconSearch>
          <i nz-icon nzType="search"></i>
        </ng-template>
      </div>

      <!-- Empty State -->
      @if (!loading() && filteredBlueprints().length === 0) {
        <nz-empty [nzNotFoundContent]="'尚無團隊藍圖'" [nzNotFoundFooter]="emptyFooter">
          <ng-template #emptyFooter>
            <button nz-button nzType="primary" (click)="onCreateBlueprint()"> 建立第一個團隊藍圖 </button>
          </ng-template>
        </nz-empty>
      }

      <!-- Blueprint Cards -->
      @if (!loading() && filteredBlueprints().length > 0) {
        <nz-row [nzGutter]="[16, 16]">
          @for (blueprint of filteredBlueprints(); track blueprint.id) {
            <nz-col [nzSpan]="8">
              <nz-card
                nzHoverable
                [nzTitle]="blueprint.name"
                [nzExtra]="extraTemplate"
                class="blueprint-card"
                (click)="onSelectBlueprint()"
              >
                <ng-template #extraTemplate>
                  <nz-badge [nzStatus]="getBadgeStatus(blueprint.status)" [nzText]="getStatusText(blueprint.status)"></nz-badge>
                </ng-template>

                <p class="blueprint-description">{{ blueprint.description || '無描述' }}</p>

                <nz-divider></nz-divider>

                <div class="blueprint-meta">
                  <nz-tag [nzColor]="'blue'">{{ blueprint.category }}</nz-tag>
                  <nz-tag [nzColor]="'cyan'">{{ blueprint.visibility }}</nz-tag>
                  @if (blueprint.tags && blueprint.tags.length > 0) {
                    @for (tag of blueprint.tags.slice(0, 2); track tag) {
                      <nz-tag>{{ tag }}</nz-tag>
                    }
                  }
                </div>

                <div class="blueprint-actions mt-md">
                  <button nz-button nzType="primary" nzSize="small" (click)="onOpenBlueprint(blueprint); $event.stopPropagation()">
                    <i nz-icon nzType="folder-open" nzTheme="outline"></i>
                    開啟
                  </button>
                  <button nz-button nzType="default" nzSize="small" (click)="onEditBlueprint(blueprint); $event.stopPropagation()">
                    <i nz-icon nzType="edit" nzTheme="outline"></i>
                    編輯
                  </button>
                </div>
              </nz-card>
            </nz-col>
          }
        </nz-row>
      }
    </nz-card>
  `,
  styles: [
    `
      .blueprint-card {
        cursor: pointer;
        transition: all 0.3s;
        height: 100%;
      }

      .blueprint-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .blueprint-description {
        min-height: 60px;
        color: rgba(0, 0, 0, 0.65);
        margin-bottom: 12px;
      }

      .blueprint-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .blueprint-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-start;
      }

      .mb-md {
        margin-bottom: 16px;
      }

      .mt-md {
        margin-top: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamBlueprintsComponent implements OnInit {
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);

  // Facade state
  readonly blueprints = this.blueprintFacade.blueprints;
  readonly loading = this.blueprintFacade.blueprintLoading;
  readonly error = this.blueprintFacade.blueprintError;

  // Local state
  searchTerm = '';
  private readonly searchTermSignal = signal<string>('');

  // Computed
  readonly filteredBlueprints = computed(() => {
    const blueprints = this.blueprints();
    const term = this.searchTermSignal().toLowerCase();

    if (!term) return blueprints;

    return blueprints.filter(
      blueprint =>
        blueprint.name.toLowerCase().includes(term) ||
        blueprint.description?.toLowerCase().includes(term) ||
        blueprint.category.toLowerCase().includes(term) ||
        blueprint.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.loadBlueprints();
  }

  /**
   * Load team blueprints
   */
  private async loadBlueprints(): Promise<void> {
    try {
      // Get teamId from route params
      const teamId = this.route.snapshot.paramMap.get('teamId');
      if (teamId) {
        await this.blueprintFacade.loadOwnerBlueprints(teamId);
      }
    } catch (error) {
      console.error('Failed to load blueprints:', error);
    }
  }

  /**
   * Handle search input
   */
  onSearch(term: string): void {
    this.searchTermSignal.set(term);
  }

  /**
   * Handle blueprint selection
   */
  onSelectBlueprint(): void {
    // Placeholder - currently no action
    // Future: Could show preview or quick actions
  }

  /**
   * Open blueprint in container
   */
  onOpenBlueprint(blueprint: BlueprintModel): void {
    // Navigate to blueprint container with blueprint ID
    this.router.navigate(['/blueprint', blueprint.id]);
  }

  /**
   * Handle create blueprint
   */
  onCreateBlueprint(): void {
    this.message.info('新增團隊藍圖功能即將推出');
    // Placeholder for future implementation
  }

  /**
   * Handle edit blueprint
   */
  onEditBlueprint(blueprint: BlueprintModel): void {
    // Future: Open edit dialog with blueprint data
    console.log('Edit blueprint:', blueprint.id);
    this.message.info('編輯藍圖功能即將推出');
    // Placeholder for future implementation
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.blueprintFacade.clearBlueprintError();
  }

  /**
   * Get badge status
   */
  getBadgeStatus(status: string): 'success' | 'processing' | 'default' | 'error' | 'warning' {
    const statusMap: Record<string, 'success' | 'processing' | 'default' | 'error' | 'warning'> = {
      published: 'success',
      draft: 'default',
      archived: 'error'
    };
    return statusMap[status] || 'default';
  }

  /**
   * Get status text
   */
  getStatusText(status: string): string {
    const textMap: Record<string, string> = {
      published: '已發布',
      draft: '草稿',
      archived: '已封存'
    };
    return textMap[status] || status;
  }
}
