/**
 * Delete Organization Component
 *
 * 刪除組織組件
 * Delete organization component
 *
 * Allows users to delete (soft delete) an existing organization account.
 * Integrated with WorkspaceContextFacade.
 *
 * @module routes/account
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { OrganizationFacade } from '@core';
import { Account } from '@shared';

@Component({
  selector: 'app-delete-organization',
  templateUrl: './delete-organization.component.html',
  styleUrls: ['./delete-organization.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class DeleteOrganizationComponent implements OnInit {
  private readonly organizationFacade = inject(OrganizationFacade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  organization!: Account;

  // ModalHelper 會將參數注入為組件屬性
  organizationParam?: Account;

  ngOnInit(): void {
    // 從 modal 參數獲取組織資料（ModalHelper 會將參數注入為組件屬性）
    const config = this.modal.getConfig() as any;
    const params = config?.nzComponentParams || {};
    const org = params.organization || this.organizationParam;

    if (org) {
      this.organization = org;
      this.cdr.markForCheck();
    } else {
      this.msg.error('缺少組織資料');
      this.cancel();
    }
  }

  /**
   * 確認刪除組織
   * Confirm delete organization
   */
  async confirmDelete(): Promise<void> {
    this.loading = true;
    this.cdr.markForCheck();

    try {
      // 刪除組織（通過 Facade）
      await this.organizationFacade.deleteOrganization(this.organization['id'] as string);

      this.msg.success('組織已刪除！');

      // 關閉模態框並返回刪除結果
      this.modal.close({ deleted: true, organization: this.organization });
    } catch (error: any) {
      // 提取詳細的錯誤信息
      let errorMessage = '刪除組織失敗';

      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // 如果是 Supabase 錯誤，顯示更友好的信息
      if (error?.code) {
        switch (error.code) {
          case '42501': // 權限不足
            errorMessage = '沒有權限刪除組織，請檢查您的登錄狀態';
            break;
          case 'PGRST116': // 找不到資源
            errorMessage = '組織不存在或已被刪除';
            break;
          default:
            errorMessage = error.message || `刪除失敗 (錯誤代碼: ${error.code})`;
        }
      }

      this.msg.error(errorMessage);
      console.error('[DeleteOrganizationComponent] Failed to delete organization:', {
        error,
        message: errorMessage,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
    } finally {
      this.loading = false;
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

