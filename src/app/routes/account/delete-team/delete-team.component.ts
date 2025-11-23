/**
 * Delete Team Component
 *
 * 刪除團隊組件
 * Delete team component
 *
 * Allows users to delete an existing team.
 * Integrated with WorkspaceContextFacade.
 *
 * @module routes/account
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TeamFacade, Team } from '@core';

@Component({
  selector: 'app-delete-team',
  templateUrl: './delete-team.component.html',
  styleUrls: ['./delete-team.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class DeleteTeamComponent implements OnInit {
  private readonly teamFacade = inject(TeamFacade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = signal(false);
  team!: Team;

  // ModalHelper 會將參數注入為組件屬性
  teamParam?: Team;

  ngOnInit(): void {
    // 從 modal 參數獲取團隊資料（ModalHelper 會將參數注入為組件屬性）
    const config = this.modal.getConfig() as any;
    const params = config?.nzComponentParams || {};
    const teamData = params.team || this.teamParam;

    if (teamData) {
      this.team = teamData;
      this.cdr.markForCheck();
    } else {
      this.msg.error('缺少團隊資料');
      this.cancel();
    }
  }

  /**
   * 確認刪除團隊
   * Confirm delete team
   */
  async confirmDelete(): Promise<void> {
    this.loading.set(true);
    this.cdr.markForCheck();

    try {
      // 刪除團隊（通過 Facade）
      await this.teamFacade.deleteTeam(this.team['id'] as string);

      this.msg.success('團隊已刪除！');

      // 關閉模態框並返回刪除結果
      this.modal.close({ deleted: true, team: this.team });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '刪除團隊失敗';
      this.msg.error(errorMessage);
      console.error('[DeleteTeamComponent] Failed to delete team:', error);
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }

  /**
   * 取消並關閉模態框
   * Cancel and close modal
   */
  cancel(): void {
    this.modal.destroy();
  }
}

