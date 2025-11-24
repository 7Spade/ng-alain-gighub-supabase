import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationFacade } from '@core';
import { SHARED_IMPORTS, OrganizationBusinessModel, AccountStatus } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-org-settings',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header />

    @if (loading()) {
      <nz-card>
        <nz-spin nzTip="載入中..."></nz-spin>
      </nz-card>
    } @else if (error()) {
      <nz-alert nzType="error" [nzMessage]="error()!" nzShowIcon></nz-alert>
    } @else if (organization()) {
      <!-- 基本資訊設定 -->
      <nz-card nzTitle="基本資訊" class="mb-3">
        <form nz-form [formGroup]="settingsForm" [nzLayout]="'vertical'">
          <nz-form-item>
            <nz-form-label nzRequired>組織名稱</nz-form-label>
            <nz-form-control nzErrorTip="請輸入組織名稱（2-50 字元）">
              <input nz-input formControlName="name" placeholder="請輸入組織名稱" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>電子郵件</nz-form-label>
            <nz-form-control nzErrorTip="請輸入有效的電子郵件地址">
              <input nz-input formControlName="email" type="email" placeholder="organization@example.com" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>頭像 URL</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="avatar" placeholder="https://example.com/avatar.png" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>狀態</nz-form-label>
            <nz-form-control>
              <nz-select formControlName="status" nzPlaceHolder="請選擇組織狀態">
                <nz-option nzValue="active" nzLabel="啟用"></nz-option>
                <nz-option nzValue="inactive" nzLabel="停用"></nz-option>
                <nz-option nzValue="suspended" nzLabel="暫停"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control>
              <button
                nz-button
                nzType="primary"
                [nzLoading]="saving()"
                [disabled]="!settingsForm.valid || !settingsForm.dirty"
                (click)="saveSettings()"
              >
                <i nz-icon nzType="save"></i>
                儲存變更
              </button>
              <button
                nz-button
                class="ml-2"
                [disabled]="!settingsForm.dirty"
                (click)="resetForm()"
              >
                <i nz-icon nzType="undo"></i>
                重置
              </button>
            </nz-form-control>
          </nz-form-item>
        </form>
      </nz-card>

      <!-- 組織統計資訊 -->
      <nz-card nzTitle="組織統計" class="mb-3">
        <nz-descriptions nzBordered [nzColumn]="2">
          <nz-descriptions-item nzTitle="組織 ID">
            {{ organization()?.id }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="創建時間">
            {{ organization()?.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="最後更新">
            {{ organization()?.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="成員數量">
            {{ organization()?.memberCount || 0 }} 人
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="團隊數量">
            {{ organization()?.teamCount || 0 }} 個
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="當前狀態">
            @switch (organization()?.status) {
              @case ('active') {
                <nz-tag nzColor="success">啟用</nz-tag>
              }
              @case ('inactive') {
                <nz-tag nzColor="default">停用</nz-tag>
              }
              @case ('suspended') {
                <nz-tag nzColor="warning">暫停</nz-tag>
              }
              @case ('deleted') {
                <nz-tag nzColor="error">已刪除</nz-tag>
              }
            }
          </nz-descriptions-item>
        </nz-descriptions>
      </nz-card>

      <!-- 危險區域 -->
      <nz-card nzTitle="危險區域" class="danger-zone">
        <nz-alert
          nzType="warning"
          nzMessage="警告"
          nzDescription="以下操作將對組織造成重大影響，請謹慎操作。刪除組織後，所有相關數據將無法恢復。"
          nzShowIcon
          class="mb-3"
        ></nz-alert>

        <button
          nz-button
          nzType="default"
          nzDanger
          [nzLoading]="deleting()"
          (click)="confirmDeleteOrganization()"
        >
          <i nz-icon nzType="delete"></i>
          刪除組織
        </button>
      </nz-card>
    }
  `,
  styles: [
    `
      .mb-3 {
        margin-bottom: 24px;
      }
      .ml-2 {
        margin-left: 8px;
      }
      .danger-zone {
        border: 1px solid #ff4d4f;
      }
      .danger-zone ::ng-deep .ant-card-head {
        background-color: #fff2f0;
        border-bottom: 1px solid #ffccc7;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgSettingsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly orgFacade = inject(OrganizationFacade);
  private readonly msg = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  organizationId = signal<string | null>(null);
  organization = signal<OrganizationBusinessModel | null>(null);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  deleting = signal<boolean>(false);
  error = signal<string | null>(null);

  settingsForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    avatar: [''],
    status: ['active', [Validators.required]]
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orgId = params['organizationId'];
      if (orgId) {
        this.organizationId.set(orgId);
        this.loadOrganization(orgId);
      }
    });
  }

  async loadOrganization(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const org = await this.orgFacade.findById(id);
      if (org) {
        this.organization.set(org);
        this.settingsForm.patchValue({
          name: org.name,
          email: org.email || '',
          avatar: org.avatar || '',
          status: org.status
        });
        this.settingsForm.markAsPristine();
      } else {
        this.error.set('找不到組織資訊');
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : '載入組織資訊失敗');
      console.error('Load organization error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async saveSettings(): Promise<void> {
    if (!this.settingsForm.valid || !this.organizationId()) {
      return;
    }

    this.saving.set(true);

    try {
      const formValue = this.settingsForm.value;
      const updateData = {
        name: formValue.name,
        email: formValue.email || undefined,
        avatar: formValue.avatar || undefined,
        status: formValue.status as AccountStatus
      };

      const updatedOrg = await this.orgFacade.updateOrganization(this.organizationId()!, updateData);
      this.organization.set(updatedOrg);
      this.settingsForm.markAsPristine();
      this.msg.success('組織設定已更新！');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '更新組織設定失敗';
      this.msg.error(errorMsg);
      console.error('Update organization error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  resetForm(): void {
    const org = this.organization();
    if (org) {
      this.settingsForm.patchValue({
        name: org.name,
        email: org.email || '',
        avatar: org.avatar || '',
        status: org.status
      });
      this.settingsForm.markAsPristine();
      this.msg.info('表單已重置');
    }
  }

  confirmDeleteOrganization(): void {
    const org = this.organization();
    if (!org) return;

    this.modal.confirm({
      nzTitle: '確認刪除組織',
      nzContent: `您確定要刪除組織「${org.name}」嗎？此操作將軟刪除組織（可在資料庫層級恢復），但會影響所有相關的團隊、成員和數據。`,
      nzOkText: '確定刪除',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: () => this.deleteOrganization()
    });
  }

  async deleteOrganization(): Promise<void> {
    if (!this.organizationId()) return;

    this.deleting.set(true);

    try {
      await this.orgFacade.deleteOrganization(this.organizationId()!);
      this.msg.success('組織已刪除');
      // 導航回組織列表或首頁
      this.router.navigate(['/']);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '刪除組織失敗';
      this.msg.error(errorMsg);
      console.error('Delete organization error:', err);
    } finally {
      this.deleting.set(false);
    }
  }
}

