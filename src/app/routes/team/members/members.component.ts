import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamMemberRepository } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header />
    <nz-card [nzTitle]="'團隊成員'">
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
                <td>{{ getRoleName(member.role) }}</td>
                <td>{{ member.joined_at | date:'yyyy-MM-dd HH:mm' }}</td>
                <td>
                  @if (member.role !== 'leader') {
                    <button nz-button nzType="link" nzDanger nzSize="small">
                      移除
                    </button>
                  }
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
export class TeamMembersComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly memberRepo = inject(TeamMemberRepository);

  teamId = signal<string | null>(null);
  members = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

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

  getRoleName(role: string): string {
    const roleMap: Record<string, string> = {
      'leader': '隊長',
      'member': '成員'
    };
    return roleMap[role] || role;
  }
}
