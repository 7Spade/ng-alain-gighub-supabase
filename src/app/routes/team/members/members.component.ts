import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamMemberRepository } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [SHARED_IMPORTS, DatePipe, FormsModule],
  template: `
    <page-header />
    <nz-card [nzTitle]="'團隊成員'" [nzExtra]="extraTpl">
      @if (loading()) {
        <nz-spin />
      } @else if (error()) {
        <nz-alert nzType="error" [nzMessage]="error()!" />
      } @else if (members().length === 0) {
        <nz-empty nzNotFoundContent="暫無成員" />
      } @else {
        <nz-table [nzData]="members()" [nzPageSize]="10">
          <thead>
            <tr>
              <th>成員名稱</th>
              <th>角色</th>
              <th>加入時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            @for (member of members(); track member.id) {
              <tr>
                <td>{{ member.account_id }}</td>
                <td>
                  <nz-select [ngModel]="member.role" (ngModelChange)="updateMemberRole(member, $event)" style="width: 120px">
                    <nz-option nzValue="leader" nzLabel="隊長"></nz-option>
                    <nz-option nzValue="member" nzLabel="成員"></nz-option>
                  </nz-select>
                </td>
                <td>{{ member.joined_at | date: 'yyyy-MM-dd HH:mm' }}</td>
                <td>
                  @if (member.role !== 'leader') {
                    <button nz-button nzType="link" nzDanger nzSize="small" (click)="removeMember(member)"> 移除 </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </nz-table>
      }
    </nz-card>

    <ng-template #extraTpl>
      <button nz-button nzType="primary" (click)="addMember()">
        <i nz-icon nzType="plus"></i>
        添加成員
      </button>
    </ng-template>

    <!-- Add Member Modal -->
    <nz-modal
      [(nzVisible)]="addMemberModalVisible"
      nzTitle="添加團隊成員"
      (nzOnCancel)="cancelAddMember()"
      (nzOnOk)="confirmAddMember()"
      [nzOkLoading]="addingMember()"
    >
      <ng-container *nzModalContent>
        <nz-form-item>
          <nz-form-label nzRequired>選擇成員</nz-form-label>
          <nz-form-control>
            <input nz-input placeholder="輸入帳戶 ID" [(ngModel)]="selectedAccountId" />
            <p style="color: #999; margin-top: 4px; font-size: 12px;"> 提示：從組織成員中選擇（暫時需要手動輸入 account_id） </p>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzRequired>角色</nz-form-label>
          <nz-form-control>
            <nz-select [(ngModel)]="selectedRole" style="width: 100%">
              <nz-option nzValue="leader" nzLabel="隊長"></nz-option>
              <nz-option nzValue="member" nzLabel="成員"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </ng-container>
    </nz-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMembersComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly memberRepo = inject(TeamMemberRepository);
  private readonly msg = inject(NzMessageService);

  teamId = signal<string | null>(null);
  members = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  addMemberModalVisible = false;
  addingMember = signal<boolean>(false);
  selectedAccountId = '';
  selectedRole = 'member';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const tId = params['teamId'];
      if (tId) {
        this.teamId.set(tId);
        this.loadMembers(tId);
      }
    });
  }

  async loadMembers(teamId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const members = await firstValueFrom(this.memberRepo.findByTeam(teamId));
      this.members.set(members);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : '載入成員失敗');
    } finally {
      this.loading.set(false);
    }
  }

  addMember(): void {
    this.selectedAccountId = '';
    this.selectedRole = 'member';
    this.addMemberModalVisible = true;
  }

  cancelAddMember(): void {
    this.addMemberModalVisible = false;
  }

  async confirmAddMember(): Promise<void> {
    if (!this.selectedAccountId || !this.teamId()) {
      this.msg.error('請輸入帳戶 ID');
      return;
    }

    this.addingMember.set(true);
    try {
      await firstValueFrom(
        this.memberRepo.create({
          team_id: this.teamId()!,
          account_id: this.selectedAccountId,
          role: this.selectedRole
        } as any)
      );
      this.msg.success('成員添加成功！');
      this.addMemberModalVisible = false;
      await this.loadMembers(this.teamId()!);
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '添加成員失敗');
    } finally {
      this.addingMember.set(false);
    }
  }

  async updateMemberRole(member: any, newRole: string): Promise<void> {
    try {
      await firstValueFrom(this.memberRepo.update(member.id, { role: newRole } as any));
      this.msg.success('角色更新成功！');
      await this.loadMembers(this.teamId()!);
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '更新角色失敗');
    }
  }

  async removeMember(member: any): Promise<void> {
    try {
      await firstValueFrom(this.memberRepo.delete(member.id));
      this.msg.success('成員已移除！');
      await this.loadMembers(this.teamId()!);
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '移除成員失敗');
    }
  }

  getRoleName(role: string): string {
    const roleMap: Record<string, string> = {
      leader: '隊長',
      member: '成員'
    };
    return roleMap[role] || role;
  }
}
