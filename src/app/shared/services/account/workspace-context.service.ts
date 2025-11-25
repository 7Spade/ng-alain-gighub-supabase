/**
 * Workspace Context Service
 *
 * 統一的工作區上下文管理服務
 * Unified workspace context management service
 *
 * 整合了資料載入、狀態管理和上下文切換邏輯
 * Integrates data loading, state management, and context switching logic
 *
 * @module core/services
 */

import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ContextType, ContextState } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { AccountService, OrganizationService, TeamService } from '@shared';
import type { Account, OrganizationModel, TeamModel } from '@shared';

const STORAGE_KEY = 'workspace_context';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextService {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly accountService = inject(AccountService);
  private readonly organizationService = inject(OrganizationService);
  private readonly teamService = inject(TeamService);

  // === 上下文狀態 Context State ===
  private readonly contextTypeState = signal<ContextType>(ContextType.APP);
  private readonly contextIdState = signal<string | null>(null);
  private readonly switchingState = signal<boolean>(false);

  readonly contextType = this.contextTypeState.asReadonly();
  readonly contextId = this.contextIdState.asReadonly();
  readonly switching = this.switchingState.asReadonly();

  // === 資料狀態 Data State ===
  private readonly currentUserState = signal<Account | null>(null);
  private readonly organizationsState = signal<OrganizationModel[]>([]);
  private readonly teamsState = signal<TeamModel[]>([]);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly currentUser = this.currentUserState.asReadonly();
  readonly organizations = this.organizationsState.asReadonly();
  readonly teams = this.teamsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // === Computed Signals ===
  readonly contextLabel = computed(() => {
    const type = this.contextType();
    const id = this.contextId();

    switch (type) {
      case ContextType.USER:
        return (this.currentUser() as any)?.name || '個人帳戶';
      case ContextType.ORGANIZATION:
        return this.organizations().find(o => o['id'] === id)?.['name'] || '組織';
      case ContextType.TEAM:
        return this.teams().find(t => t['id'] === id)?.['name'] || '團隊';
      case ContextType.BOT:
        return '機器人';
      case ContextType.APP:
      default:
        return '應用選單';
    }
  });

  readonly contextIcon = computed(() => {
    const iconMap = {
      [ContextType.APP]: 'appstore',
      [ContextType.USER]: 'user',
      [ContextType.ORGANIZATION]: 'team',
      [ContextType.TEAM]: 'usergroup-add',
      [ContextType.BOT]: 'robot'
    };
    return iconMap[this.contextType()] || 'question';
  });

  readonly teamsByOrganization = computed(() => {
    const teams = this.teams();
    const orgs = this.organizations();
    const map = new Map<string, TeamModel[]>();

    orgs.forEach(org => map.set(org['id'] as string, []));
    teams.forEach(team => {
      const orgId = (team as any).organization_id;
      if (orgId && map.has(orgId)) {
        map.get(orgId)!.push(team);
      }
    });

    return map;
  });

  private hasRestored = false;

  constructor() {
    // 監聽認證狀態並自動載入資料
    effect(() => {
      const token = this.tokenService.get();
      const authUserId = token?.['user']?.['id'];

      if (authUserId) {
        this.loadWorkspaceData(authUserId);
      } else {
        this.reset();
      }
    });

    // 資料載入完成後自動恢復上下文
    effect(() => {
      const isLoading = this.loading();
      const userId = this.currentUser()?.['id'];

      if (!isLoading && userId && !this.hasRestored) {
        this.hasRestored = true;
        this.restoreContext();
      }
    });
  }

  // === 資料載入 Data Loading ===

  async loadWorkspaceData(authUserId: string): Promise<void> {
    if (this.loadingState()) return; // 防止重複載入

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 並行載入所有資料
      const [userAccount, createdOrgs, joinedOrgs, teams] = await Promise.allSettled([
        this.accountService.findByAuthUserId(authUserId),
        this.organizationService.getUserCreatedOrganizations(authUserId),
        this.accountService
          .findByAuthUserId(authUserId)
          .then(user => (user ? this.organizationService.getUserJoinedOrganizations(user['id'] as string) : [])),
        this.accountService.findByAuthUserId(authUserId).then(user => (user ? this.accountService.getUserTeams(user['id'] as string) : []))
      ]);

      // 處理用戶帳戶
      if (userAccount.status === 'fulfilled' && userAccount.value) {
        this.currentUserState.set(userAccount.value);
      } else {
        throw new Error('User account not found');
      }

      // 合併組織列表（去重）
      const allOrgs = [
        ...(createdOrgs.status === 'fulfilled' ? createdOrgs.value : []),
        ...(joinedOrgs.status === 'fulfilled' ? joinedOrgs.value : [])
      ];
      const uniqueOrgs = Array.from(new Map(allOrgs.map(org => [org['id'], org])).values());
      this.organizationsState.set(uniqueOrgs);

      // 處理團隊
      if (teams.status === 'fulfilled') {
        this.teamsState.set(teams.value);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load workspace data';
      this.errorState.set(message);
      console.error('[WorkspaceContextService] Load failed:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  // === 上下文切換 Context Switching ===

  switchToApp(): void {
    this.switchContext(ContextType.APP, null);
  }

  switchToUser(userId: string): void {
    this.switchContext(ContextType.USER, userId);
  }

  switchToOrganization(organizationId: string): void {
    this.switchContext(ContextType.ORGANIZATION, organizationId);
  }

  switchToTeam(teamId: string): void {
    this.switchContext(ContextType.TEAM, teamId);
  }

  switchToBot(botId: string): void {
    this.switchContext(ContextType.BOT, botId);
  }

  /**
   * 切換上下文（內部方法，Facade 可調用）
   * Switch context (internal method, callable by Facade)
   */
  switchContext(type: ContextType, id: string | null): void {
    this.switchingState.set(true);
    this.contextTypeState.set(type);
    this.contextIdState.set(id);
    this.persistContext();
    this.switchingState.set(false);
  }

  // === 持久化 Persistence ===

  /**
   * 恢復上下文（從 localStorage）
   * Restore context from localStorage
   */
  restoreContext(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const context = JSON.parse(saved) as ContextState;
        if (context.type && context.id) {
          this.contextTypeState.set(context.type);
          this.contextIdState.set(context.id);
          return;
        }
      }

      // 預設使用用戶上下文
      const userId = this.currentUser()?.['id'];
      if (userId) {
        this.switchToUser(userId as string);
      }
    } catch (error) {
      console.error('[WorkspaceContextService] Restore failed:', error);
    }
  }

  private persistContext(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const context: ContextState = {
        type: this.contextType(),
        id: this.contextId(),
        label: this.contextLabel(),
        icon: this.contextIcon()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    } catch (error) {
      console.error('[WorkspaceContextService] Persist failed:', error);
    }
  }

  // === 重置 Reset ===

  reset(): void {
    this.currentUserState.set(null);
    this.organizationsState.set([]);
    this.teamsState.set([]);
    this.errorState.set(null);
    this.switchToApp();
    this.hasRestored = false;
  }
}
