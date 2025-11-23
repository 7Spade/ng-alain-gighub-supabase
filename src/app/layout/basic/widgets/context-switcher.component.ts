/**
 * Context Switcher Component
 *
 * 帳戶上下文切換器元件
 * Account context switcher component
 *
 * Allows users to switch between personal account, organizations, and teams.
 * Integrated with WorkspaceContextFacade for state management.
 *
 * @module layout/basic/widgets
 */

import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { WorkspaceContextFacade, AccountService } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'header-context-switcher',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, NzMenuModule, NzIconModule],
  template: `
    <div
      class="alain-default__nav-item d-flex align-items-center px-sm"
      nz-dropdown
      nzPlacement="bottomRight"
      [nzDropdownMenu]="contextMenu"
      [nzDisabled]="switching()"
    >
      @if (switching()) {
        <i nz-icon nzType="loading" class="mr-sm"></i>
      } @else {
        <i nz-icon [nzType]="contextIcon()" class="mr-sm"></i>
      }
      <span>{{ contextLabel() }}</span>
    </div>
    <nz-dropdown-menu #contextMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <!-- Application menu: only show when not logged in -->
        @if (!hasToken()) {
          <div
            nz-menu-item
            (click)="workspaceContext.switchToApp()"
            [class.ant-menu-item-selected]="workspaceContext.contextType() === 'app'"
          >
            <i nz-icon nzType="appstore" class="mr-sm"></i>
            <span>應用菜單</span>
          </div>
          <li nz-menu-divider></li>
        }

        <!-- Personal account menu -->
        @if (userAccounts().length > 0) {
          <div nz-submenu nzTitle="個人帳戶" nzIcon="user">
            <ul nz-menu>
              @for (account of userAccounts(); track account.id) {
                <li
                  nz-menu-item
                  (click)="workspaceContext.switchToUser(account.id)"
                  [class.ant-menu-item-selected]="workspaceContext.contextType() === 'user' && workspaceContext.contextId() === account.id"
                >
                  <i nz-icon nzType="user" class="mr-sm"></i>
                  <span>{{ getAccountName(account) }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Organization accounts menu -->
        @if (organizationAccounts().length > 0) {
          <div nz-submenu nzTitle="組織帳戶" nzIcon="team">
            <ul nz-menu>
              @for (account of organizationAccounts(); track account.id) {
                <li
                  nz-menu-item
                  (click)="workspaceContext.switchToOrganization(account.id)"
                  [class.ant-menu-item-selected]="
                    workspaceContext.contextType() === 'organization' && workspaceContext.contextId() === account.id
                  "
                >
                  <i nz-icon nzType="team" class="mr-sm"></i>
                  <span>{{ getAccountName(account) }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Team accounts menu -->
        @if (userTeams().length > 0) {
          <div nz-submenu nzTitle="團隊帳戶" nzIcon="usergroup-add">
            <ul nz-menu>
              @for (org of organizationAccounts(); track org.id) {
                @if (teamsByOrganization().has(org.id) && teamsByOrganization().get(org.id)!.length > 0) {
                  <li nz-submenu [nzTitle]="getAccountName(org)" nzIcon="team">
                    <ul nz-menu>
                      @for (team of teamsByOrganization().get(org.id)!; track team.id) {
                        <li
                          nz-menu-item
                          (click)="workspaceContext.switchToTeam(team.id)"
                          [class.ant-menu-item-selected]="
                            workspaceContext.contextType() === 'team' && workspaceContext.contextId() === team.id
                          "
                        >
                          <i nz-icon nzType="usergroup-add" class="mr-sm"></i>
                          <span>{{ getTeamName(team) }}</span>
                        </li>
                      }
                    </ul>
                  </li>
                }
              }
            </ul>
          </div>
        }

        <!-- No accounts message -->
        @if (userAccounts().length === 0 && organizationAccounts().length === 0 && userTeams().length === 0) {
          <li nz-menu-item nzDisabled>
            <i nz-icon nzType="info-circle" class="mr-sm"></i>
            <span>暫無可用帳戶</span>
          </li>
        }
      </div>
    </nz-dropdown-menu>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .width-sm {
        min-width: 200px;
        max-width: 300px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContextSwitcherComponent {
  readonly accountService = inject(AccountService);
  readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // Use WorkspaceContextFacade signals
  readonly userAccounts = computed(() => this.accountService.userAccounts());
  readonly organizationAccounts = this.workspaceContext.allOrganizations;
  readonly userTeams = this.workspaceContext.userTeams;
  readonly teamsByOrganization = this.workspaceContext.teamsByOrganization;
  readonly contextLabel = this.workspaceContext.contextLabel;
  readonly contextIcon = this.workspaceContext.contextIcon;
  readonly switching = this.workspaceContext.switching;

  /**
   * Check if user is logged in
   * Used to control "Application Menu" option visibility
   */
  readonly hasToken = computed(() => {
    const token = this.tokenService.get();
    return !!token?.['user']?.['id'];
  });

  /**
   * Get account name with fallback
   */
  getAccountName(account: any): string {
    return account.name || account.email || '未命名帳戶';
  }

  /**
   * Get team name with fallback
   */
  getTeamName(team: any): string {
    return team.name || '未命名團隊';
  }
}
