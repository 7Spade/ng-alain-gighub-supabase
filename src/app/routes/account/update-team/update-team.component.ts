/**
 * Update Team Component
 *
 * 更新團隊組件
 * Update team component
 *
 * Allows users to update an existing team within an organization.
 * Integrated with WorkspaceContextFacade.
 *
 * @module routes/account
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import { UpdateTeamRequest, Team } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TeamFacade } from '@core';

@Component({
  selector: 'app-update-team',
  templateUrl: './update-team.component.html',
  styleUrls: ['./update-team.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class UpdateTeamComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly teamFacade = inject(TeamFacade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = signal(false);
  team!: Team;

  // ModalHelper 會將參數注入為組件屬性
  teamParam?: Team;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
    avatar: ['']
  });

  ngOnInit(): void {
    // 從 modal 參數獲取團隊資料（ModalHelper 會將參數注入為組件屬性）
    const config = this.modal.getConfig() as any;
    const params = config?.nzComponentParams || {};
    const teamData = params.team || this.teamParam;

    if (teamData) {
      this.team = teamData;
      this.form.patchValue({
        name: (this.team as any)['name'] || '',
        description: (this.team as any)['description'] || '',
        avatar: (this.team as any)['avatar'] || ''
      });
      this.cdr.markForCheck();
    } else {
      this.msg.error('缺少團隊資料');
      this.cancel();
    }
  }

  /**
   * 提交表單更新團隊
   * Submit form to update team
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

      // 更新團隊請求
      const request: UpdateTeamRequest = {
        name: formValue.name.trim(),
        description: formValue.description?.trim() || undefined,
        avatar: formValue.avatar?.trim() || undefined
      };

      // 更新團隊（通過 Facade）
      const updatedTeam = await this.teamFacade.updateTeam(this.team['id'] as string, request);

      this.msg.success('團隊更新成功！');

      // 關閉模態框並返回更新的團隊
      this.modal.close(updatedTeam);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新團隊失敗';
      this.msg.error(errorMessage);
      console.error('[UpdateTeamComponent] Failed to update team:', error);
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

