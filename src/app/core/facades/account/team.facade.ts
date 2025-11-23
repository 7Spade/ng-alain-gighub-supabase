/**
 * Team Facade
 *
 * 團隊業務域門面（Core 層）
 * Team business domain facade (Core layer)
 *
 * Provides unified interface for team operations.
 * Coordinates between TeamService and WorkspaceDataService.
 *
 * @module core/facades/account
 */

import { Injectable, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { TeamService, WorkspaceDataService, TeamBusinessModel, CreateTeamRequest, UpdateTeamRequest } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class TeamFacade {
  private readonly teamService = inject(TeamService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // Proxy team service signals
  readonly teams = this.teamService.teams;
  readonly loading = this.teamService.loading;
  readonly error = this.teamService.error;

  /**
   * 創建團隊
   * Create team
   *
   * @param {CreateTeamRequest} request - Create request
   * @returns {Promise<TeamBusinessModel>} Created team
   */
  async createTeam(request: CreateTeamRequest): Promise<TeamBusinessModel> {
    try {
      const team = await this.teamService.createTeam(request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return team;
    } catch (error) {
      console.error('[TeamFacade] Failed to create team:', error);
      throw error;
    }
  }

  /**
   * 更新團隊
   * Update team
   *
   * @param {string} id - Team ID
   * @param {UpdateTeamRequest} request - Update request
   * @returns {Promise<TeamBusinessModel>} Updated team
   */
  async updateTeam(id: string, request: UpdateTeamRequest): Promise<TeamBusinessModel> {
    try {
      const team = await this.teamService.updateTeam(id, request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return team;
    } catch (error) {
      console.error('[TeamFacade] Failed to update team:', error);
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
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }
    } catch (error) {
      console.error('[TeamFacade] Failed to delete team:', error);
      throw error;
    }
  }

  /**
   * 根據 ID 查詢團隊
   * Find team by ID
   *
   * @param {string} id - Team ID
   * @returns {Promise<TeamBusinessModel | null>} Team or null
   */
  async findById(id: string): Promise<TeamBusinessModel | null> {
    return this.teamService.findById(id);
  }

  /**
   * 查詢組織下的團隊
   * Find teams by organization ID
   *
   * @param {string} organizationId - Organization ID
   * @returns {Promise<TeamBusinessModel[]>} Teams in organization
   */
  async findByOrganization(organizationId: string): Promise<TeamBusinessModel[]> {
    return this.teamService.findByOrganization(organizationId);
  }
}
