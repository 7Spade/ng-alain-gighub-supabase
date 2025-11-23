/**
 * Context Switcher Component
 *
 * 帳戶上下文切換器元件 - 企業級實作
 * Account context switcher component - Enterprise implementation
 *
 * Features:
 * - Type-safe implementation with strict TypeScript
 * - Enhanced UX with loading states and transitions
 * - Comprehensive error handling
 * - Accessibility (A11y) compliant
 * - Performance optimized with OnPush and trackBy
 * - Cohesive design following ng-alain patterns
 *
 * Allows users to switch between:
 * - Personal accounts
 * - Organization accounts
 * - Team accounts (grouped by organization)
 *
 * Integrated with WorkspaceContextFacade for centralized state management.
 *
 * @module layout/basic/widgets
 */

import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { WorkspaceContextFacade } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { AccountService } from '@shared';
import type { Account, OrganizationModel, TeamModel } from '@shared';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

/**
 * Context Switcher Component
 *
 * Provides a dropdown interface for switching workspace contexts.
 * Implements enterprise-grade standards with comprehensive type safety and UX enhancements.
 */
@Component({
  selector: 'header-context-switcher',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, NzMenuModule, NzIconModule, NzSpinModule, NzTooltipModule],
  template: `
    <div
      class="context-switcher"
      nz-dropdown
      nzPlacement="bottomRight"
      [nzDropdownMenu]="contextMenu"
      [nzDisabled]="switching() || hasError()"
      [nz-tooltip]="hasError() ? '發生錯誤，請重試' : null"
      nzTooltipPlacement="bottom"
      role="button"
      [attr.aria-label]="'切換工作區: ' + contextLabel()"
      [attr.aria-expanded]="dropdownVisible()"
      [attr.aria-haspopup]="true"
      tabindex="0"
      (keydown.enter)="onContextTriggerKeyPress($event)"
      (keydown.space)="onContextTriggerKeyPress($event)"
    >
      <div class="context-switcher__content">
        @if (switching()) {
          <i nz-icon nzType="loading" class="context-switcher__icon context-switcher__icon--loading"></i>
        } @else if (hasError()) {
          <i nz-icon nzType="exclamation-circle" class="context-switcher__icon context-switcher__icon--error"></i>
        } @else {
          <i nz-icon [nzType]="contextIcon()" class="context-switcher__icon"></i>
        }
        <span class="context-switcher__label">{{ contextLabel() }}</span>
        <i nz-icon nzType="down" class="context-switcher__arrow" [class.context-switcher__arrow--expanded]="dropdownVisible()"></i>
      </div>
    </div>
    <nz-dropdown-menu #contextMenu="nzDropdownMenu">
      <div nz-menu class="context-switcher-menu" role="menu">
        <!-- Application menu: only show when not logged in -->
        @if (!hasToken()) {
          <div
            nz-menu-item
            (click)="handleSwitchToApp()"
            [class.ant-menu-item-selected]="isContextSelected('app', null)"
            role="menuitem"
            [attr.aria-label]="'切換到應用菜單'"
            tabindex="0"
          >
            <i nz-icon nzType="appstore" class="menu-item-icon"></i>
            <span>應用菜單</span>
          </div>
          <li nz-menu-divider></li>
        }

        <!-- Personal account menu -->
        @if (userAccounts().length > 0) {
          <div nz-submenu nzTitle="個人帳戶" nzIcon="user" role="menuitem">
            <ul nz-menu role="menu">
              @for (account of userAccounts(); track account['id']) {
                <li
                  nz-menu-item
                  (click)="handleSwitchToUser(getId(account))"
                  [class.ant-menu-item-selected]="isContextSelected('user', getId(account))"
                  [attr.aria-label]="'切換到個人帳戶: ' + getAccountDisplayName(account)"
                  role="menuitem"
                  tabindex="0"
                >
                  <i nz-icon nzType="user" class="menu-item-icon"></i>
                  <span>{{ getAccountDisplayName(account) }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Organization accounts menu -->
        @if (organizationAccounts().length > 0) {
          <div nz-submenu nzTitle="組織帳戶" nzIcon="team" role="menuitem">
            <ul nz-menu role="menu">
              @for (org of organizationAccounts(); track org['id']) {
                <li
                  nz-menu-item
                  (click)="handleSwitchToOrganization(getId(org))"
                  [class.ant-menu-item-selected]="isContextSelected('organization', getId(org))"
                  [attr.aria-label]="'切換到組織: ' + getAccountDisplayName(org)"
                  role="menuitem"
                  tabindex="0"
                >
                  <i nz-icon nzType="team" class="menu-item-icon"></i>
                  <span>{{ getAccountDisplayName(org) }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Team accounts menu -->
        @if (userTeams().length > 0) {
          <div nz-submenu nzTitle="團隊帳戶" nzIcon="usergroup-add" role="menuitem">
            <ul nz-menu role="menu">
              @for (org of organizationAccounts(); track org['id']) {
                @if (teamsByOrganization().has(getId(org)) && teamsByOrganization().get(getId(org))!.length > 0) {
                  <li nz-submenu [nzTitle]="getAccountDisplayName(org)" nzIcon="team" role="menuitem">
                    <ul nz-menu role="menu">
                      @for (team of teamsByOrganization().get(getId(org))!; track team['id']) {
                        <li
                          nz-menu-item
                          (click)="handleSwitchToTeam(getId(team))"
                          [class.ant-menu-item-selected]="isContextSelected('team', getId(team))"
                          [attr.aria-label]="'切換到團隊: ' + getTeamDisplayName(team)"
                          role="menuitem"
                          tabindex="0"
                        >
                          <i nz-icon nzType="usergroup-add" class="menu-item-icon"></i>
                          <span>{{ getTeamDisplayName(team) }}</span>
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
          <li nz-menu-item nzDisabled role="menuitem" [attr.aria-disabled]="true">
            <i nz-icon nzType="info-circle" class="menu-item-icon"></i>
            <span>暫無可用帳戶</span>
          </li>
        }

        <!-- Error message with retry -->
        @if (hasError()) {
          <li nz-menu-divider></li>
          <li nz-menu-item (click)="handleRetry()" role="menuitem" tabindex="0">
            <i nz-icon nzType="reload" class="menu-item-icon"></i>
            <span class="error-text">發生錯誤，點擊重試</span>
          </li>
        }
      </div>
    </nz-dropdown-menu>
  `,
  styles: [
    `
      .context-switcher {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
        border-radius: 4px;

        &:hover {
          background-color: rgba(0, 0, 0, 0.025);
        }

        &:focus {
          outline: 2px solid #1890ff;
          outline-offset: 2px;
        }

        &[nz-dropdown][disabled] {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      .context-switcher__content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .context-switcher__icon {
        font-size: 16px;
        transition: all 0.3s ease;

        &--loading {
          color: #1890ff;
        }

        &--error {
          color: #ff4d4f;
        }
      }

      .context-switcher__label {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .context-switcher__arrow {
        font-size: 12px;
        transition: transform 0.3s ease;

        &--expanded {
          transform: rotate(180deg);
        }
      }

      .context-switcher-menu {
        min-width: 240px;
        max-width: 320px;
        max-height: 480px;
        overflow-y: auto;
        box-shadow:
          0 3px 6px -4px rgba(0, 0, 0, 0.12),
          0 6px 16px 0 rgba(0, 0, 0, 0.08),
          0 9px 28px 8px rgba(0, 0, 0, 0.05);
      }

      .menu-item-icon {
        margin-right: 8px;
        font-size: 14px;
      }

      .error-text {
        color: #ff4d4f;
      }

      /* Accessibility improvements */
      [nz-menu-item]:focus,
      [nz-submenu]:focus {
        outline: 2px solid #1890ff;
        outline-offset: -2px;
      }

      /* Smooth transitions for menu items */
      [nz-menu-item] {
        transition: all 0.2s ease;
      }

      [nz-menu-item]:hover {
        background-color: #f5f5f5;
      }

      [nz-menu-item].ant-menu-item-selected {
        background-color: #e6f7ff;
        color: #1890ff;
        font-weight: 500;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContextSwitcherComponent {
  private readonly accountService = inject(AccountService);
  private readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // Local state for dropdown visibility
  private readonly dropdownVisibleState = signal<boolean>(false);
  readonly dropdownVisible = this.dropdownVisibleState.asReadonly();

  // Proxy WorkspaceContextFacade signals with type safety
  readonly userAccounts = computed(() => this.accountService.userAccounts() as Account[]);
  readonly organizationAccounts = computed(() => this.workspaceContext.allOrganizations() as OrganizationModel[]);
  readonly userTeams = computed(() => this.workspaceContext.userTeams() as TeamModel[]);
  readonly teamsByOrganization = computed(() => this.workspaceContext.teamsByOrganization() as Map<string, TeamModel[]>);
  readonly contextLabel = computed(() => this.workspaceContext.contextLabel() as string);
  readonly contextIcon = computed(() => this.workspaceContext.contextIcon() as string);
  readonly switching = computed(() => this.workspaceContext.switching() as boolean);

  // Error state
  readonly hasError = computed(() => {
    const dataError = this.workspaceContext.error();
    const serviceError = this.accountService.error() as string | null;
    return !!(dataError || serviceError);
  });

  /**
   * Check if user is logged in
   * Used to control "Application Menu" option visibility
   *
   * @returns True if user has a valid auth token
   */
  readonly hasToken = computed<boolean>(() => {
    const token = this.tokenService.get();
    return !!token?.['user']?.['id'];
  });

  /**
   * Get ID from an entity with proper type safety
   *
   * @param entity - The entity to get ID from
   * @returns The ID as a string
   */
  getId(entity: Record<string, unknown>): string {
    return entity['id'] as string;
  }

  /**
   * Check if the current context matches the given type and ID
   *
   * @param contextType - The context type to check
   * @param contextId - The context ID to check (nullable for 'app' type)
   * @returns True if the context matches
   */
  isContextSelected(contextType: string, contextId: string | null): boolean {
    return this.workspaceContext.contextType() === contextType && this.workspaceContext.contextId() === contextId;
  }

  /**
   * Get display name for an account with proper fallback
   *
   * @param account - The account to get display name for
   * @returns The display name with fallback
   */
  getAccountDisplayName(account: Record<string, unknown>): string {
    if (!account) {
      return '未命名帳戶';
    }
    return (account['name'] || account['email'] || '未命名帳戶') as string;
  }

  /**
   * Get display name for a team with proper fallback
   *
   * @param team - The team to get display name for
   * @returns The display name with fallback
   */
  getTeamDisplayName(team: Record<string, unknown>): string {
    if (!team) {
      return '未命名團隊';
    }
    return (team['name'] || '未命名團隊') as string;
  }

  /**
   * TrackBy function for optimal rendering performance
   *
   * @param id - The unique identifier
   * @returns The tracking identifier
   */
  trackById(id: string): string {
    return id;
  }

  /**
   * Handle keyboard navigation on context trigger
   *
   * @param event - The keyboard event
   */
  onContextTriggerKeyPress(event: Record<string, unknown>): void {
    if (event['key'] === 'Enter' || event['key'] === ' ') {
      if (typeof event['preventDefault'] === 'function') {
        (event['preventDefault'] as () => void)();
      }
      this.dropdownVisibleState.update(v => !v);
    }
  }

  /**
   * Handle switch to application menu
   * Wraps the facade method with error handling
   */
  handleSwitchToApp(): void {
    try {
      this.workspaceContext.switchToApp();
      this.dropdownVisibleState.set(false);
    } catch (error) {
      console.error('[HeaderContextSwitcherComponent] Failed to switch to app:', error);
    }
  }

  /**
   * Handle switch to user context
   * Wraps the facade method with error handling
   *
   * @param userId - The user account ID to switch to
   */
  handleSwitchToUser(userId: string): void {
    try {
      this.workspaceContext.switchToUser(userId);
      this.dropdownVisibleState.set(false);
    } catch (error) {
      console.error('[HeaderContextSwitcherComponent] Failed to switch to user:', error);
    }
  }

  /**
   * Handle switch to organization context
   * Wraps the facade method with error handling
   *
   * @param organizationId - The organization ID to switch to
   */
  handleSwitchToOrganization(organizationId: string): void {
    try {
      this.workspaceContext.switchToOrganization(organizationId);
      this.dropdownVisibleState.set(false);
    } catch (error) {
      console.error('[HeaderContextSwitcherComponent] Failed to switch to organization:', error);
    }
  }

  /**
   * Handle switch to team context
   * Wraps the facade method with error handling
   *
   * @param teamId - The team ID to switch to
   */
  handleSwitchToTeam(teamId: string): void {
    try {
      this.workspaceContext.switchToTeam(teamId);
      this.dropdownVisibleState.set(false);
    } catch (error) {
      console.error('[HeaderContextSwitcherComponent] Failed to switch to team:', error);
    }
  }

  /**
   * Handle retry on error
   * Reloads workspace data if user is authenticated
   */
  async handleRetry(): Promise<void> {
    const token = this.tokenService.get();
    const authUserId = token?.['user']?.['id'];

    if (authUserId) {
      try {
        await this.workspaceContext.loadWorkspaceData(authUserId);
        this.dropdownVisibleState.set(false);
      } catch (error) {
        console.error('[HeaderContextSwitcherComponent] Failed to retry loading workspace data:', error);
      }
    }
  }
}
