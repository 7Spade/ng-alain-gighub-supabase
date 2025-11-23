/**
 * Create Team Component
 *
 * 建立團隊組件
 * Create team component
 *
 * Allows users to create a new team within an organization.
 * Integrated with TeamRepository and WorkspaceContextFacade.
 *
 * @module routes/account
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SHARED_IMPORTS } from '@shared';
import { TeamRepository } from '@core';
import { CreateTeamRequest } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SupabaseAuthService } from '@core';
import { WorkspaceContextFacade } from '@core';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class CreateTeamComponent {
  private readonly fb = inject(FormBuilder);
  private readonly teamRepo = inject(TeamRepository);
  private readonly supabaseAuth = inject(SupabaseAuthService);
  private readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = signal(false);
  form: FormGroup = this.fb.group({
    organizationId: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
    avatar: ['']
  });

  // 獲取所有組織列表
  readonly organizations = this.workspaceContext.allOrganizations;
  readonly loadingOrganizations = this.workspaceContext.loadingOrganizations;

  // 計算組織選項（用於下拉選單）
  readonly organizationOptions = computed(() => {
    const orgs = this.organizations();
    return orgs.map(org => ({
      value: org['id'] as string,
      label: (org as any).name || '未命名組織'
    }));
  });

  /**
   * 提交表單創建團隊
   * Submit form to create team
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

    this.loading.set(true);
    this.cdr.markForCheck();

    try {
      const formValue = this.form.value;

      // 創建團隊請求
      const request: CreateTeamRequest = {
        organizationId: formValue.organizationId,
        name: formValue.name.trim(),
        description: formValue.description?.trim() || undefined,
        avatar: formValue.avatar?.trim() || undefined
      };

      // 創建團隊
      const team = await firstValueFrom(
        this.teamRepo.create({
          organizationId: request.organizationId,
          name: request.name,
          description: request.description || null,
          avatar: request.avatar || null
        } as any)
      );

      this.msg.success('團隊創建成功！');

      // 重新載入工作區數據以更新團隊列表
      const currentUser = await firstValueFrom(this.supabaseAuth.getUser());
      if (currentUser?.id) {
        await this.workspaceContext.loadWorkspaceData(currentUser.id);
      }

      // 關閉模態框並返回創建的團隊
      this.modal.close(team);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '創建團隊失敗';
      this.msg.error(errorMessage);
      console.error('[CreateTeamComponent] Failed to create team:', error);
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
