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
import { TeamService, WorkspaceDataService, ErrorHandlerService, TeamBusinessModel, CreateTeamRequest, UpdateTeamRequest } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class TeamFacade {
  private readonly teamService = inject(TeamService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly errorHandler = inject(ErrorHandlerService);

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
   * @throws {Error} User-friendly error message
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
      const errorMessage = this.errorHandler.getErrorMessage(error, 'create', '團隊');
      this.errorHandler.logError('TeamFacade', 'create team', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 更新團隊
   * Update team
   *
   * @param {string} id - Team ID
   * @param {UpdateTeamRequest} request - Update request
   * @returns {Promise<TeamBusinessModel>} Updated team
   * @throws {Error} User-friendly error message
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
      const errorMessage = this.errorHandler.getErrorMessage(error, 'update', '團隊');
      this.errorHandler.logError('TeamFacade', 'update team', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 刪除團隊
   * Delete team
   *
   * @param {string} id - Team ID
   * @returns {Promise<void>} Void
   * @throws {Error} User-friendly error message
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
      const errorMessage = this.errorHandler.getErrorMessage(error, 'delete', '團隊');
      this.errorHandler.logError('TeamFacade', 'delete team', error);
      throw new Error(errorMessage);
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
