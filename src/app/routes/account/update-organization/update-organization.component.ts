/**
 * Update Organization Component
 *
 * 更新組織組件
 * Update organization component
 *
 * Allows users to update an existing organization account.
 * Integrated with WorkspaceContextFacade.
 *
 * @module routes/account
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import { UpdateOrganizationRequest } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { WorkspaceContextFacade } from '@core';
import { Account } from '@shared';

@Component({
  selector: 'app-update-organization',
  templateUrl: './update-organization.component.html',
  styleUrls: ['./update-organization.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class UpdateOrganizationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  organization!: Account;

  // ModalHelper 會將參數注入為組件屬性
  organizationParam?: Account;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    avatar: ['']
  });

  ngOnInit(): void {
    // 從 modal 參數獲取組織資料（ModalHelper 會將參數注入為組件屬性）
    // 嘗試從 getConfig 獲取，如果沒有則使用直接屬性
    const config = this.modal.getConfig() as any;
    const params = config?.nzComponentParams || {};
    const org = params.organization || this.organizationParam;

    if (org) {
      this.organization = org;
      this.form.patchValue({
        name: this.organization['name'] || '',
        email: this.organization['email'] || '',
        avatar: this.organization['avatar'] || ''
      });
      this.cdr.markForCheck();
    } else {
      this.msg.error('缺少組織資料');
      this.cancel();
    }
  }

  /**
   * 提交表單更新組織
   * Submit form to update organization
   */
  async submit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    try {
      const formValue = this.form.value;

      // 更新組織（通過 Facade）
      const request: UpdateOrganizationRequest = {
        name: formValue.name.trim(),
        email: formValue.email?.trim() || undefined,
        avatar: formValue.avatar?.trim() || undefined
      };
      const updatedOrganization = await this.workspaceContext.updateOrganization(this.organization['id'] as string, request);

      this.msg.success('組織更新成功！');

      // 關閉模態框並返回更新的組織
      this.modal.close(updatedOrganization);
    } catch (error: any) {
      // 提取詳細的錯誤信息
      let errorMessage = '更新組織失敗';

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
          case '23505': // 唯一性約束違反
            errorMessage = '組織名稱或電子郵件已存在';
            break;
          case '42501': // 權限不足
            errorMessage = '沒有權限更新組織，請檢查您的登錄狀態';
            break;
          case 'PGRST116': // 找不到資源
            errorMessage = '組織不存在或已被刪除';
            break;
          default:
            errorMessage = error.message || `更新失敗 (錯誤代碼: ${error.code})`;
        }
      }

      this.msg.error(errorMessage);
      console.error('[UpdateOrganizationComponent] Failed to update organization:', {
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
