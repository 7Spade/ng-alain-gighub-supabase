/**
 * Create Organization Component
 *
 * 建立組織組件
 * Create organization component
 *
 * Allows users to create a new organization account.
 * Uses OrganizationFacade for all business operations.
 *
 * @module routes/account
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationFacade } from '@core';
import { SHARED_IMPORTS, CreateOrganizationRequest } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class CreateOrganizationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly organizationFacade = inject(OrganizationFacade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    avatar: ['']
  });

  /**
   * 提交表單創建組織
   * Submit form to create organization
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

      // 創建組織（通過 Facade）
      const request: CreateOrganizationRequest = {
        name: formValue.name.trim(),
        email: formValue.email?.trim() || undefined,
        avatar: formValue.avatar?.trim() || undefined
      };
      const organization = await this.organizationFacade.createOrganization(request);

      this.msg.success('組織創建成功！');

      // 關閉模態框並返回創建的組織
      this.modal.close(organization);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '創建組織失敗';
      this.msg.error(errorMessage);
      console.error('[CreateOrganizationComponent] Failed to create organization:', error);
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
