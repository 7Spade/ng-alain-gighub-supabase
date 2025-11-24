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
import { TeamService, TeamBusinessModel, CreateTeamRequest, UpdateTeamRequest } from '@shared';

import { BaseAccountCrudFacade } from './base-account-crud.facade';

@Injectable({
  providedIn: 'root'
})
export class TeamFacade extends BaseAccountCrudFacade<TeamBusinessModel, CreateTeamRequest, UpdateTeamRequest> {
  private readonly teamService = inject(TeamService);

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
    return this.executeCreate(request, req => this.teamService.createTeam(req), '團隊');
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
    return this.executeUpdate(id, request, (id, req) => this.teamService.updateTeam(id, req), '團隊');
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
      await this.reloadWorkspaceData();
    } catch (error) {
      const errorMessage = this.errorHandler.getErrorMessage(error, 'delete', '團隊');
      this.errorHandler.logError(this.constructor.name, 'delete team', error);
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
