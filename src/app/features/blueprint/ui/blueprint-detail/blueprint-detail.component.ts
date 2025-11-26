/**
 * Blueprint Detail Component
 *
 * 藍圖詳情元件 - 顯示和編輯單個藍圖
 * View and edit single blueprint page
 *
 * Supports both view and edit modes based on route parameters
 * Integrates with AuthContextService for permission control
 *
 * @module features/blueprint/ui/blueprint-detail
 */

import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthContextService } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Subject, takeUntil } from 'rxjs';

import { BlueprintStore } from '../../data-access';
import { BlueprintModel, BlueprintStatusEnum, BlueprintVisibilityEnum } from '../../domain';
import { BlueprintFormDialogComponent, BlueprintDeleteConfirmDialogComponent } from '../../shell';

/**
 * Status badge configuration
 */
const STATUS_CONFIG: Record<string, { text: string; color: string }> = {
  [BlueprintStatusEnum.DRAFT]: { text: '草稿', color: 'default' },
  [BlueprintStatusEnum.PUBLISHED]: { text: '已發佈', color: 'success' },
  [BlueprintStatusEnum.ARCHIVED]: { text: '已封存', color: 'warning' }
};

/**
 * Visibility badge configuration
 */
const VISIBILITY_CONFIG: Record<string, { text: string; color: string }> = {
  [BlueprintVisibilityEnum.PRIVATE]: { text: '私有', color: 'default' },
  [BlueprintVisibilityEnum.PUBLIC]: { text: '公開', color: 'blue' },
  [BlueprintVisibilityEnum.ORGANIZATION]: { text: '組織', color: 'purple' },
  [BlueprintVisibilityEnum.TEAM]: { text: '團隊', color: 'cyan' }
};

/**
 * Category labels
 */
const CATEGORY_LABELS: Record<string, string> = {
  software_development: '軟體開發',
  marketing: '行銷',
  sales: '銷售',
  hr: '人力資源',
  operations: '營運',
  custom: '自訂'
};

@Component({
  selector: 'app-blueprint-detail',
  standalone: true,
  imports: [SHARED_IMPORTS, DatePipe, NzTagModule, NzDescriptionsModule, NzStatisticModule, NzSkeletonModule],
  template: `
    <page-header [title]="pageTitle()" [action]="actionTpl">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>
            <a routerLink="/blueprint/list">藍圖列表</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>藍圖詳情</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <ng-template #actionTpl>
      @if (blueprint() && canEdit()) {
        <button nz-button nzType="default" class="mr-sm" (click)="goBack()">
          <i nz-icon nzType="arrow-left" nzTheme="outline"></i>
          返回列表
        </button>
        <button nz-button nzType="primary" class="mr-sm" (click)="editBlueprint()">
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          編輯
        </button>
        @if (blueprint()?.status === 'draft') {
          <button nz-button nzType="default" class="mr-sm" (click)="publishBlueprint()">
            <i nz-icon nzType="cloud-upload" nzTheme="outline"></i>
            發佈
          </button>
        }
        <button nz-button nzType="default" nzDanger (click)="deleteBlueprint()">
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          刪除
        </button>
      } @else {
        <button nz-button nzType="default" (click)="goBack()">
          <i nz-icon nzType="arrow-left" nzTheme="outline"></i>
          返回列表
        </button>
      }
    </ng-template>

    <!-- Loading State -->
    @if (loading()) {
      <nz-card>
        <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 6 }"></nz-skeleton>
      </nz-card>
    }

    <!-- Error State -->
    @if (error()) {
      <nz-alert nzType="error" nzShowIcon [nzMessage]="'載入失敗'" [nzDescription]="error()" class="mb-md"></nz-alert>
    }

    <!-- Blueprint Detail -->
    @if (!loading() && blueprint()) {
      <!-- Basic Information -->
      <nz-card nzTitle="基本資訊" class="mb-md">
        <nz-descriptions nzBordered [nzColumn]="{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }">
          <nz-descriptions-item nzTitle="藍圖名稱" [nzSpan]="2">
            {{ blueprint()!.name }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="狀態">
            <nz-tag [nzColor]="getStatusConfig(blueprint()!.status).color">
              {{ getStatusConfig(blueprint()!.status).text }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="可見性">
            <nz-tag [nzColor]="getVisibilityConfig(blueprint()!.visibility).color">
              {{ getVisibilityConfig(blueprint()!.visibility).text }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="分類">
            {{ getCategoryLabel(blueprint()!.category) }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="版本"> v{{ blueprint()!.version }} </nz-descriptions-item>
          <nz-descriptions-item nzTitle="描述" [nzSpan]="3">
            {{ blueprint()!.description || '無描述' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="標籤" [nzSpan]="3">
            @if (blueprint()!.tags && blueprint()!.tags.length > 0) {
              @for (tag of blueprint()!.tags; track tag) {
                <nz-tag>{{ tag }}</nz-tag>
              }
            } @else {
              <span class="text-muted">無標籤</span>
            }
          </nz-descriptions-item>
        </nz-descriptions>
      </nz-card>

      <!-- Statistics -->
      <nz-card nzTitle="統計資訊" class="mb-md">
        <div nz-row [nzGutter]="16">
          <div nz-col [nzSpan]="6">
            <nz-statistic [nzValue]="blueprint()!.usageCount" nzTitle="使用次數" [nzPrefix]="usageIcon"></nz-statistic>
            <ng-template #usageIcon><i nz-icon nzType="deployment-unit" nzTheme="outline"></i></ng-template>
          </div>
          <div nz-col [nzSpan]="6">
            <nz-statistic [nzValue]="blueprint()!.rating || 0" nzTitle="評分" [nzSuffix]="'/5'" [nzPrefix]="ratingIcon"></nz-statistic>
            <ng-template #ratingIcon><i nz-icon nzType="star" nzTheme="outline"></i></ng-template>
          </div>
          <div nz-col [nzSpan]="6">
            <nz-statistic [nzValue]="blueprint()!.version" nzTitle="版本" [nzPrefix]="versionIcon"></nz-statistic>
            <ng-template #versionIcon><i nz-icon nzType="branches" nzTheme="outline"></i></ng-template>
          </div>
          <div nz-col [nzSpan]="6">
            <nz-statistic [nzValue]="formatDate(blueprint()!.createdAt)" nzTitle="建立日期" [nzPrefix]="dateIcon"></nz-statistic>
            <ng-template #dateIcon><i nz-icon nzType="calendar" nzTheme="outline"></i></ng-template>
          </div>
        </div>
      </nz-card>

      <!-- Timestamps -->
      <nz-card nzTitle="時間戳記" class="mb-md">
        <nz-descriptions nzBordered [nzColumn]="3">
          <nz-descriptions-item nzTitle="建立時間">
            {{ blueprint()!.createdAt | date: 'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="更新時間">
            {{ blueprint()!.updatedAt | date: 'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="發佈時間">
            {{ blueprint()!.publishedAt ? (blueprint()!.publishedAt | date: 'yyyy-MM-dd HH:mm:ss') : '尚未發佈' }}
          </nz-descriptions-item>
        </nz-descriptions>
      </nz-card>

      <!-- Blueprint Structure Preview -->
      <nz-card nzTitle="藍圖結構預覽">
        <pre class="code-preview">{{ blueprint()!.structure | json }}</pre>
      </nz-card>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .code-preview {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        overflow-x: auto;
        max-height: 400px;
        font-size: 12px;
        font-family: 'Consolas', 'Monaco', monospace;
      }

      .text-muted {
        color: rgba(0, 0, 0, 0.45);
      }
    `
  ]
})
export class BlueprintDetailComponent implements OnInit, OnDestroy {
  private readonly blueprintStore = inject(BlueprintStore);
  private readonly authContext = inject(AuthContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  private readonly destroy$ = new Subject<void>();

  // Blueprint ID from route
  readonly blueprintId = signal<string | null>(null);

  // Store state
  readonly blueprint = this.blueprintStore.selectedBlueprint;
  readonly loading = this.blueprintStore.blueprintLoading;
  readonly error = this.blueprintStore.blueprintError;

  // Context state
  readonly contextType = this.authContext.contextType;
  readonly contextId = this.authContext.contextId;

  // Computed values
  readonly pageTitle = computed(() => {
    const bp = this.blueprint();
    return bp ? `藍圖：${bp.name}` : '藍圖詳情';
  });

  // Check if current user can edit this blueprint
  readonly canEdit = computed(() => {
    const bp = this.blueprint();
    const ctxId = this.contextId();

    if (!bp || !ctxId) return false;

    // Can edit if owner matches current context
    return bp.ownerId === ctxId;
  });

  constructor() {
    // Effect to load blueprint when ID changes
    effect(() => {
      const id = this.blueprintId();
      if (id) {
        this.loadBlueprint(id);
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to route params to get blueprint ID
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      if (id) {
        this.blueprintId.set(id);
      } else {
        this.message.error('缺少藍圖 ID');
        this.router.navigate(['/blueprint/list']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Clear selection when leaving
    this.blueprintStore.clearBlueprintSelection();
  }

  /**
   * Load blueprint by ID
   */
  private async loadBlueprint(id: string): Promise<void> {
    try {
      await this.blueprintStore.getBlueprint(id);
    } catch (error) {
      console.error('[BlueprintDetail] Failed to load blueprint:', error);
      this.message.error('載入藍圖失敗');
    }
  }

  /**
   * Get status configuration
   */
  getStatusConfig(status: string): { text: string; color: string } {
    return STATUS_CONFIG[status] || { text: status, color: 'default' };
  }

  /**
   * Get visibility configuration
   */
  getVisibilityConfig(visibility: string): { text: string; color: string } {
    return VISIBILITY_CONFIG[visibility] || { text: visibility, color: 'default' };
  }

  /**
   * Get category label
   */
  getCategoryLabel(category: string): string {
    return CATEGORY_LABELS[category] || category;
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  /**
   * Go back to list
   */
  goBack(): void {
    this.router.navigate(['/blueprint/list']);
  }

  /**
   * Edit blueprint
   */
  editBlueprint(): void {
    const bp = this.blueprint();
    if (!bp) return;

    const modalRef = this.modal.create({
      nzTitle: '編輯藍圖',
      nzContent: BlueprintFormDialogComponent,
      nzWidth: 600,
      nzData: {
        mode: 'edit',
        blueprint: bp
      },
      nzFooter: null
    });

    modalRef.afterClose.subscribe((result: BlueprintModel | undefined) => {
      if (result) {
        this.message.success('藍圖更新成功');
        // Reload to refresh data
        this.loadBlueprint(bp.id);
      }
    });
  }

  /**
   * Publish blueprint
   */
  async publishBlueprint(): Promise<void> {
    const bp = this.blueprint();
    if (!bp) return;

    this.modal.confirm({
      nzTitle: '確認發佈',
      nzContent: `確定要發佈藍圖「${bp.name}」嗎？發佈後將可被其他用戶查看和使用。`,
      nzOkText: '發佈',
      nzOkType: 'primary',
      nzOnOk: async () => {
        try {
          await this.blueprintStore.publishBlueprint(bp.id);
          this.message.success('藍圖已發佈');
          this.loadBlueprint(bp.id);
        } catch (error) {
          this.message.error('發佈失敗');
        }
      }
    });
  }

  /**
   * Delete blueprint
   */
  deleteBlueprint(): void {
    const bp = this.blueprint();
    if (!bp) return;

    const modalRef = this.modal.create({
      nzTitle: '確認刪除',
      nzContent: BlueprintDeleteConfirmDialogComponent,
      nzWidth: 400,
      nzData: { blueprint: bp },
      nzFooter: null
    });

    modalRef.afterClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.message.success('藍圖已刪除');
        this.router.navigate(['/blueprint/list']);
      }
    });
  }
}
