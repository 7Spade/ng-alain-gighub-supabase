/**
 * Workspace Context Service
 *
 * 工作區上下文狀態管理服務（Shared 層）
 * Workspace context state management service (Shared layer)
 *
 * Manages workspace context state (app/user/organization/team) and switching logic.
 *
 * @module shared/services/account
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { ContextType, ContextState } from '@core';

import { WorkspaceDataService } from './workspace-data.service';
import { TeamModel } from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextService {
  private readonly dataService = inject(WorkspaceDataService);

  // Context state - 預設為 USER 上下文而非 APP，避免閃現
  private contextTypeState = signal<ContextType>(ContextType.USER);
  private contextIdState = signal<string | null>(null);
  private switchingState = signal<boolean>(false);

  // Readonly signals
  readonly contextType = this.contextTypeState.asReadonly();
  readonly contextId = this.contextIdState.asReadonly();
  readonly switching = this.switchingState.asReadonly();

  // Proxy data service signals
  readonly currentUserAccount = this.dataService.currentUserAccount;
  readonly currentUserAccountId = this.dataService.currentUserAccountId;
  readonly createdOrganizations = this.dataService.createdOrganizations;
  readonly joinedOrganizations = this.dataService.joinedOrganizations;
  readonly loadingOrganizations = this.dataService.loadingOrganizations;
  readonly userTeams = this.dataService.userTeams;
  readonly loadingTeams = this.dataService.loadingTeams;
  readonly error = this.dataService.error;

  // Computed signals
  readonly allOrganizations = computed(() => {
    const created = this.createdOrganizations();
    const joined = this.joinedOrganizations();

    if (created.length === 0) return joined;
    if (joined.length === 0) return created;

    const createdIds = new Set(created.map(org => org['id']));
    const uniqueJoined = joined.filter(org => !createdIds.has(org['id']));

    return [...created, ...uniqueJoined];
  });

  readonly teamsByOrganization = computed(() => {
    const teams = this.userTeams();
    const orgs = this.allOrganizations();
    const teamsMap = new Map<string, TeamModel[]>();

    orgs.forEach(org => {
      teamsMap.set(org['id'] as string, []);
    });

    teams.forEach(team => {
      const orgId = (team as any).organizationId;
      if (orgId && teamsMap.has(orgId)) {
        teamsMap.get(orgId)!.push(team);
      }
    });

    return teamsMap;
  });

  readonly contextLabel = computed(() => {
    const type = this.contextType();
    const id = this.contextId();

    switch (type) {
      case ContextType.APP:
        return '應用菜單';
      case ContextType.USER: {
        const account = this.currentUserAccount();
        return account ? (account as any).name || '個人工作區' : '個人工作區';
      }
      case ContextType.ORGANIZATION: {
        const org = this.allOrganizations().find(o => o['id'] === id);
        return org ? (org as any).name || '組織工作區' : '組織工作區';
      }
      case ContextType.TEAM: {
        const team = this.userTeams().find(t => t['id'] === id);
        return team ? (team as any).name || '團隊工作區' : '團隊工作區';
      }
      case ContextType.BOT:
        return '機器人';
      default:
        return '個人工作區';
    }
  });

  readonly contextIcon = computed(() => {
    const type = this.contextType();

    switch (type) {
      case ContextType.APP:
        return 'appstore';
      case ContextType.USER:
        return 'user';
      case ContextType.ORGANIZATION:
        return 'team';
      case ContextType.TEAM:
        return 'usergroup-add';
      case ContextType.BOT:
        return 'robot';
      default:
        return 'question';
    }
  });

  /**
   * 切換到應用菜單
   * Switch to app menu
   */
  switchToApp(): void {
    this.switchingState.set(true);
    this.contextTypeState.set(ContextType.APP);
    this.contextIdState.set(null);
    this.persistContext();
    this.switchingState.set(false);
  }

  /**
   * 切換到用戶上下文
   * Switch to user context
   */
  switchToUser(userId: string): void {
    this.switchingState.set(true);
    this.contextTypeState.set(ContextType.USER);
    this.contextIdState.set(userId);
    this.persistContext();
    this.switchingState.set(false);
  }

  /**
   * 切換到組織上下文
   * Switch to organization context
   */
  switchToOrganization(organizationId: string): void {
    this.switchingState.set(true);
    this.contextTypeState.set(ContextType.ORGANIZATION);
    this.contextIdState.set(organizationId);
    this.persistContext();
    this.switchingState.set(false);
  }

  /**
   * 切換到團隊上下文
   * Switch to team context
   */
  switchToTeam(teamId: string): void {
    this.switchingState.set(true);
    this.contextTypeState.set(ContextType.TEAM);
    this.contextIdState.set(teamId);
    this.persistContext();
    this.switchingState.set(false);
  }

  /**
   * 恢復上下文（從 localStorage）
   * Restore context from localStorage
   */
  restoreContext(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const saved = localStorage.getItem('workspace_context');
      if (saved) {
        const context = JSON.parse(saved) as ContextState;
        this.contextTypeState.set(context.type);
        this.contextIdState.set(context.id);
      }
    } catch (error) {
      console.error('[WorkspaceContextService] Failed to restore context:', error);
    }
  }

  /**
   * 持久化上下文（到 localStorage）
   * Persist context to localStorage
   */
  private persistContext(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const context: ContextState = {
        type: this.contextType(),
        id: this.contextId(),
        label: this.contextLabel(),
        icon: this.contextIcon()
      };

      localStorage.setItem('workspace_context', JSON.stringify(context));
    } catch (error) {
      console.error('[WorkspaceContextService] Failed to persist context:', error);
    }
  }
}
