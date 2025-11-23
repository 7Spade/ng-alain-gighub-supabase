/**
 * Workspace Context Facade
 *
 * 工作區上下文門面（Core 層）
 * Workspace context facade (Core layer)
 *
 * Provides unified interface for workspace context management.
 * Coordinates between services and integrates with @delon/auth.
 *
 * @module core/facades/account
 */

import { Injectable, computed, effect, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { WorkspaceContextService, WorkspaceDataService, AccountService, OrganizationService, TeamService } from '@shared';
import {
  OrganizationModel,
  TeamModel,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  CreateTeamRequest,
  UpdateTeamRequest
} from '@shared';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextFacade {
  private readonly contextService = inject(WorkspaceContextService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly accountService = inject(AccountService);
  private readonly organizationService = inject(OrganizationService);
  private readonly teamService = inject(TeamService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // Proxy context service signals
  readonly contextType = this.contextService.contextType;
  readonly contextId = this.contextService.contextId;
  readonly switching = this.contextService.switching;
  readonly contextLabel = this.contextService.contextLabel;
  readonly contextIcon = this.contextService.contextIcon;

  // Proxy data service signals
  readonly currentUserAccount = this.dataService.currentUserAccount;
  readonly currentUserAccountId = this.dataService.currentUserAccountId;
  readonly createdOrganizations = this.dataService.createdOrganizations;
  readonly joinedOrganizations = this.dataService.joinedOrganizations;
  readonly loadingOrganizations = this.dataService.loadingOrganizations;
  readonly userTeams = this.dataService.userTeams;
  readonly loadingTeams = this.dataService.loadingTeams;
  readonly error = this.dataService.error;

  // Proxy context service computed signals
  readonly allOrganizations = this.contextService.allOrganizations;
  readonly teamsByOrganization = this.contextService.teamsByOrganization;

  private hasRestoredContext = false;

  constructor() {
    // Monitor auth state and load workspace data
    effect(() => {
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        this.loadWorkspaceData(token['user']['id']).catch(error => {
          console.error('[WorkspaceContextFacade] Failed to load workspace data:', error);
        });
      } else {
        this.reset();
        this.hasRestoredContext = false;
      }
    });

    // Auto-restore context when data is loaded
    effect(() => {
      const dataLoading = this.loadingOrganizations() || this.loadingTeams();
      const token = this.tokenService.get();
      const hasToken = !!token?.['user']?.['id'];
      const userAccountId = this.currentUserAccountId();

      if (this.hasRestoredContext) {
        return;
      }

      if (!dataLoading && hasToken && userAccountId) {
        setTimeout(() => {
          if (!this.hasRestoredContext) {
            this.hasRestoredContext = true;
            this.restoreContext();
          }
        }, 100);
      }
    });
  }

  /**
   * 載入工作區資料
   * Load workspace data
   */
  async loadWorkspaceData(authUserId: string): Promise<void> {
    try {
      await this.dataService.loadWorkspaceData(authUserId);
    } catch (error) {
      console.error('[WorkspaceContextFacade] Failed to load workspace data:', error);
      throw error;
    }
  }

  /**
   * 切換到應用菜單
   * Switch to app menu
   */
  switchToApp(): void {
    this.contextService.switchToApp();
  }

  /**
   * 切換到用戶上下文
   * Switch to user context
   */
  switchToUser(userId: string): void {
    this.contextService.switchToUser(userId);
  }

  /**
   * 切換到組織上下文
   * Switch to organization context
   */
  switchToOrganization(organizationId: string): void {
    this.contextService.switchToOrganization(organizationId);
  }

  /**
   * 切換到團隊上下文
   * Switch to team context
   */
  switchToTeam(teamId: string): void {
    this.contextService.switchToTeam(teamId);
  }

  /**
   * 恢復上下文
   * Restore context
   */
  restoreContext(): void {
    this.contextService.restoreContext();
  }

  /**
   * 重置狀態
   * Reset state
   */
  reset(): void {
    this.dataService.reset();
    this.contextService.switchToApp();
  }

  // ==================== 組織管理方法 ====================

  /**
   * 創建組織
   * Create organization
   *
   * @param {CreateOrganizationRequest} request - Create request
   * @returns {Promise<OrganizationModel>} Created organization
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationModel> {
    try {
      const organization = await this.organizationService.createOrganization(request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.loadWorkspaceData(token['user']['id']);
      }

      return organization;
    } catch (error) {
      console.error('[WorkspaceContextFacade] Failed to create organization:', error);
      throw error;
    }
  }

  /**
   * 更新組織
   * Update organization
   *
   * @param {string} id - Organization ID
   * @param {UpdateOrganizationRequest} request - Update request
   * @returns {Promise<OrganizationModel>} Updated organization
   */
  async updateOrganization(id: string, request: UpdateOrganizationRequest): Promise<OrganizationModel> {
    try {
      const organization = await this.organizationService.updateOrganization(id, request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.loadWorkspaceData(token['user']['id']);
      }

      return organization;
    } catch (error) {
      console.error('[WorkspaceContextFacade] Failed to update organization:', error);
      throw error;
    }
  }

  /**
   * 刪除組織（軟刪除）
   * Delete organization (soft delete)
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationModel>} Deleted organization
   */
  async deleteOrganization(id: string): Promise<OrganizationModel> {
    try {
      const organization = await this.organizationService.softDeleteOrganization(id);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.loadWorkspaceData(token['user']['id']);
      }

      return organization;
    } catch (error) {
      console.error('[WorkspaceContextFacade] Failed to delete organization:', error);
      throw error;
    }
  }

  // ==================== 團隊管理方法 ====================

  /**
   * 創建團隊
   * Create team
   *
   * @param {CreateTeamRequest} request - Create request
   * @returns {Promise<TeamModel>} Created team
   */
  async createTeam(request: CreateTeamRequest): Promise<TeamModel> {
    try {
      const team = await this.teamService.createTeam(request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.loadWorkspaceData(token['user']['id']);
      }

      return team;
    } catch (error) {
      console.error('[WorkspaceContextFacade] Failed to create team:', error);
      throw error;
    }
  }

  /**
   * 更新團隊
   * Update team
   *
   * @param {string} id - Team ID
   * @param {UpdateTeamRequest} request - Update request
   * @returns {Promise<TeamModel>} Updated team
   */
  async updateTeam(id: string, request: UpdateTeamRequest): Promise<TeamModel> {
    try {
      const team = await this.teamService.updateTeam(id, request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.loadWorkspaceData(token['user']['id']);
      }

      return team;
    } catch (error) {
      console.error('[WorkspaceContextFacade] Failed to update team:', error);
      throw error;
    }
  }

  /**
   * 刪除團隊
   * Delete team
   *
   * @param {string} id - Team ID
   * @returns {Promise<void>} Void
   */
  async deleteTeam(id: string): Promise<void> {
    try {
      await this.teamService.deleteTeam(id);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.loadWorkspaceData(token['user']['id']);
      }
    } catch (error) {
      console.error('[WorkspaceContextFacade] Failed to delete team:', error);
      throw error;
    }
  }
}
