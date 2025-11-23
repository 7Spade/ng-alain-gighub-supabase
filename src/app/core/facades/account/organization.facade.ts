/**
 * Organization Facade
 *
 * 組織業務域門面（Core 層）
 * Organization business domain facade (Core layer)
 *
 * Provides unified interface for organization operations.
 * Coordinates between OrganizationService and WorkspaceDataService.
 *
 * @module core/facades/account
 */

import { Injectable, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { OrganizationService, WorkspaceDataService } from '@shared';
import { OrganizationBusinessModel, CreateOrganizationRequest, UpdateOrganizationRequest } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class OrganizationFacade {
  private readonly organizationService = inject(OrganizationService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // Proxy organization service signals
  readonly organizations = this.organizationService.organizations;
  readonly loading = this.organizationService.loading;
  readonly error = this.organizationService.error;

  /**
   * 創建組織
   * Create organization
   *
   * @param {CreateOrganizationRequest} request - Create request
   * @returns {Promise<OrganizationBusinessModel>} Created organization
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationBusinessModel> {
    try {
      const organization = await this.organizationService.createOrganization(request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return organization;
    } catch (error) {
      console.error('[OrganizationFacade] Failed to create organization:', error);
      throw error;
    }
  }

  /**
   * 更新組織
   * Update organization
   *
   * @param {string} id - Organization ID
   * @param {UpdateOrganizationRequest} request - Update request
   * @returns {Promise<OrganizationBusinessModel>} Updated organization
   */
  async updateOrganization(id: string, request: UpdateOrganizationRequest): Promise<OrganizationBusinessModel> {
    try {
      const organization = await this.organizationService.updateOrganization(id, request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return organization;
    } catch (error) {
      console.error('[OrganizationFacade] Failed to update organization:', error);
      throw error;
    }
  }

  /**
   * 刪除組織（軟刪除）
   * Delete organization (soft delete)
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationBusinessModel>} Deleted organization
   */
  async deleteOrganization(id: string): Promise<OrganizationBusinessModel> {
    try {
      const organization = await this.organizationService.softDeleteOrganization(id);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return organization;
    } catch (error) {
      console.error('[OrganizationFacade] Failed to delete organization:', error);
      throw error;
    }
  }

  /**
   * 根據 ID 查詢組織
   * Find organization by ID
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationBusinessModel | null>} Organization or null
   */
  async findById(id: string): Promise<OrganizationBusinessModel | null> {
    return this.organizationService.findById(id);
  }

  /**
   * 查詢用戶創建的組織
   * Find organizations created by user
   *
   * @param {string} authUserId - Auth user ID
   * @returns {Promise<OrganizationBusinessModel[]>} Organizations created by user
   */
  async getUserCreatedOrganizations(authUserId: string): Promise<OrganizationBusinessModel[]> {
    return this.organizationService.getUserCreatedOrganizations(authUserId);
  }

  /**
   * 查詢用戶加入的組織
   * Find organizations user has joined
   *
   * @param {string} accountId - Account ID
   * @returns {Promise<OrganizationBusinessModel[]>} Organizations user has joined
   */
  async getUserJoinedOrganizations(accountId: string): Promise<OrganizationBusinessModel[]> {
    return this.organizationService.getUserJoinedOrganizations(accountId);
  }
}
