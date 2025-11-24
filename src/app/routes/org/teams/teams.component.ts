import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamFacade, WorkspaceContextFacade } from '@core';
import { SHARED_IMPORTS, TeamBusinessModel } from '@shared';
import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreateTeamComponent } from '../../account/create-team/create-team.component';
import { UpdateTeamComponent } from '../../account/update-team/update-team.component';
import { DeleteTeamComponent } from '../../account/delete-team/delete-team.component';
import { AddTeamMemberComponent } from '../../account/add-team-member/add-team-member.component';

@Component({
  selector: 'app-org-teams',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header />
    <nz-card [nzTitle]="'團隊管理'" [nzExtra]="extraTpl">
      @if (loading()) {
        <nz-spin />
      } @else if (error()) {
        <nz-alert nzType="error" [nzMessage]="error()!" />
      } @else if (teams().length === 0) {
        <nz-empty nzNotFoundContent="暫無團隊" />
      } @else {
        <nz-table [nzData]="teams()" [nzPageSize]="10">
          <thead>
            <tr>
              <th>團隊名稱</th>
              <th>描述</th>
              <th>成員數</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            @for (team of teams(); track team['id']) {
              <tr>
                <td>{{ team['name'] }}</td>
                <td>{{ team['description'] || '-' }}</td>
                <td>{{ team['memberCount'] || 0 }}</td>
                <td>
                  <button nz-button nzType="link" nzSize="small" (click)="addTeamMember(team)"> 添加成員 </button>
                  <nz-divider nzType="vertical"></nz-divider>
                  <a [routerLink]="['/team', team['id'], 'members']" nz-button nzType="link" nzSize="small"> 成員列表 </a>
                  <nz-divider nzType="vertical"></nz-divider>
                  <button nz-button nzType="link" nzSize="small" (click)="editTeam(team)"> 編輯 </button>
                  <nz-divider nzType="vertical"></nz-divider>
                  <button nz-button nzType="link" nzDanger nzSize="small" (click)="deleteTeam(team)"> 刪除 </button>
                </td>
              </tr>
            }
          </tbody>
        </nz-table>
      }
    </nz-card>

    <ng-template #extraTpl>
      <button nz-button nzType="primary" (click)="createTeam()">
        <i nz-icon nzType="plus"></i>
        建立團隊
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgTeamsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly teamFacade = inject(TeamFacade);
  private readonly modal = inject(ModalHelper);
  private readonly msg = inject(NzMessageService);
  private readonly workspaceContext = inject(WorkspaceContextFacade);

  organizationId = signal<string | null>(null);
  teams = signal<TeamBusinessModel[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orgId = params['organizationId'];
      if (orgId) {
        this.organizationId.set(orgId);
        this.loadTeams(orgId);
      }
    });
  }

  async loadTeams(organizationId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const teams = await this.teamFacade.findByOrganization(organizationId);
      this.teams.set(teams);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : '載入團隊失敗');
    } finally {
      this.loading.set(false);
    }
  }

  createTeam(): void {
    this.modal.create(CreateTeamComponent, {}, { size: 'md' }).subscribe(result => {
      if (result && this.organizationId()) {
        this.loadTeams(this.organizationId()!);
      }
    });
  }

  editTeam(team: TeamBusinessModel): void {
    this.modal.create(UpdateTeamComponent, { teamParam: team }, { size: 'md' }).subscribe(result => {
      if (result && this.organizationId()) {
        this.loadTeams(this.organizationId()!);
      }
    });
  }

  deleteTeam(team: TeamBusinessModel): void {
    this.modal.create(DeleteTeamComponent, { teamParam: team }, { size: 'md' }).subscribe(result => {
      if (result && this.organizationId()) {
        this.loadTeams(this.organizationId()!);
      }
    });
  }

  addTeamMember(team: TeamBusinessModel): void {
    this.modal
      .create(
        AddTeamMemberComponent,
        {
          teamId: team['id'],
          organizationId: this.organizationId()
        },
        { size: 'md' }
      )
      .subscribe(result => {
        if (result?.success) {
          this.msg.success('成員添加成功！');
        }
      });
  }
}
