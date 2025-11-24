/**
 * Create Team Component
 *
 * 建立團隊組件
 * Create team component
 *
 * Allows users to create a new team within an organization.
 * Integrated with TeamFacade and WorkspaceContextFacade.
 *
 * @module routes/account
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamFacade, WorkspaceContextFacade } from '@core';
import { SHARED_IMPORTS, CreateTeamRequest } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class CreateTeamComponent {
  private readonly fb = inject(FormBuilder);
  private readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly teamFacade = inject(TeamFacade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);

  loading = signal(false);
  form: FormGroup = this.fb.group({
    organizationId: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
    avatar: ['']
  });

  readonly organizations = this.workspaceContext.allOrganizations;
  readonly loadingOrganizations = this.workspaceContext.loadingOrganizations;

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
    try {
      const formValue = this.form.value;
      const request: CreateTeamRequest = {
        organizationId: formValue.organizationId,
        name: formValue.name.trim(),
        description: formValue.description?.trim() || undefined,
        avatar: formValue.avatar?.trim() || undefined
      };

      const team = await this.teamFacade.createTeam(request);
      this.msg.success('團隊創建成功！');
      this.modal.close(team);
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '創建團隊失敗');
    } finally {
      this.loading.set(false);
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
