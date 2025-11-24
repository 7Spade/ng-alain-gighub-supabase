import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlueprintFacade } from '@core';
import { ModalHelper } from '@delon/theme';
import { SHARED_IMPORTS, BlueprintModel } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { CreateBlueprintComponent } from '../../blueprint/create-blueprint';
import { UpdateBlueprintComponent } from '../../blueprint/update-blueprint';

@Component({
  selector: 'app-team-blueprints',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'團隊藍圖'">
      <ng-template #action>
        <button nz-button nzType="primary" (click)="onCreateBlueprint()">
          <i nz-icon nzType="plus" nzTheme="outline"></i>
          新增藍圖
        </button>
      </ng-template>
    </page-header>

    <nz-card>
      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      }

      @if (error()) {
        <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="error()" nzShowIcon></nz-alert>
      }

      @if (!loading() && !error()) {
        <nz-table #basicTable [nzData]="blueprints()" [nzPageSize]="10">
          <thead>
            <tr>
              <th>名稱</th>
              <th>類別</th>
              <th>可見性</th>
              <th>狀態</th>
              <th>標籤</th>
              <th>建立時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            @for (blueprint of basicTable.data; track blueprint.id) {
              <tr>
                <td>{{ blueprint.name }}</td>
                <td>{{ blueprint.category }}</td>
                <td>
                  <nz-badge
                    [nzStatus]="blueprint.visibility === 'public' ? 'success' : 'default'"
                    [nzText]="blueprint.visibility"
                  ></nz-badge>
                </td>
                <td>
                  <nz-badge [nzStatus]="getStatusColor(blueprint.status)" [nzText]="getStatusText(blueprint.status)"></nz-badge>
                </td>
                <td>
                  @for (tag of blueprint.tags; track tag) {
                    <nz-tag>{{ tag }}</nz-tag>
                  }
                </td>
                <td>{{ blueprint.createdAt | date: 'short' }}</td>
                <td>
                  <button nz-button nzType="link" nzSize="small" (click)="onEditBlueprint(blueprint)">
                    <i nz-icon nzType="edit" nzTheme="outline"></i>
                    編輯
                  </button>
                  <nz-divider nzType="vertical"></nz-divider>
                  <button nz-button nzType="link" nzSize="small" nzDanger (click)="onDeleteBlueprint(blueprint)">
                    <i nz-icon nzType="delete" nzTheme="outline"></i>
                    刪除
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </nz-table>
      }
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamBlueprintsComponent implements OnInit {
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly modal = inject(ModalHelper);
  private readonly message = inject(NzMessageService);
  private readonly modalService = inject(NzModalService);
  private readonly route = inject(ActivatedRoute);

  // Facade state
  readonly blueprints = this.blueprintFacade.blueprints;
  readonly loading = this.blueprintFacade.blueprintLoading;
  readonly error = this.blueprintFacade.blueprintError;

  // Local state
  readonly teamId = signal<string>('');

  ngOnInit(): void {
    // Get teamId from route params
    this.route.params.subscribe(params => {
      if (params['teamId']) {
        this.teamId.set(params['teamId']);
        this.loadBlueprints(params['teamId']);
      }
    });
  }

  /**
   * Load blueprints for team
   */
  private async loadBlueprints(teamId: string): Promise<void> {
    try {
      await this.blueprintFacade.loadOwnerBlueprints(teamId);
    } catch (error) {
      console.error('Failed to load blueprints:', error);
    }
  }

  /**
   * Handle blueprint creation
   */
  onCreateBlueprint(): void {
    const teamId = this.teamId();
    if (!teamId) {
      this.message.error('無效的團隊 ID');
      return;
    }

    this.modal.createStatic(CreateBlueprintComponent, { ownerId: teamId, ownerType: 'team' }, { size: 'md' }).subscribe(result => {
      if (result) {
        this.message.success('藍圖建立成功');
        // Reload blueprints
        this.loadBlueprints(teamId);
      }
    });
  }

  /**
   * Handle blueprint edit
   */
  onEditBlueprint(blueprint: BlueprintModel): void {
    this.modal.createStatic(UpdateBlueprintComponent, { blueprint }, { size: 'md' }).subscribe(result => {
      if (result) {
        this.message.success('藍圖更新成功');
        // Reload blueprints
        const teamId = this.teamId();
        if (teamId) {
          this.loadBlueprints(teamId);
        }
      }
    });
  }

  /**
   * Handle blueprint delete
   */
  onDeleteBlueprint(blueprint: BlueprintModel): void {
    this.modalService.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除藍圖「${blueprint.name}」嗎？此操作無法復原。`,
      nzOkText: '刪除',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: async () => {
        try {
          await this.blueprintFacade.deleteBlueprint(blueprint.id);
          this.message.success('藍圖刪除成功');

          // Reload blueprints
          const teamId = this.teamId();
          if (teamId) {
            this.loadBlueprints(teamId);
          }
        } catch (error) {
          console.error('Failed to delete blueprint:', error);
          this.message.error(`刪除藍圖失敗：${(error as Error).message}`);
        }
      }
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      draft: 'default',
      published: 'processing',
      archived: 'error'
    };
    return colorMap[status] || 'default';
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    const textMap: Record<string, string> = {
      draft: '草稿',
      published: '已發布',
      archived: '已封存'
    };
    return textMap[status] || status;
  }
}
