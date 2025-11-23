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
import { OrganizationMemberRole, SupabaseService } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import {
  OrganizationService,
  UserService,
  WorkspaceDataService,
  OrganizationBusinessModel,
  CreateOrganizationRequest,
  UpdateOrganizationRequest
} from '@shared';

@Injectable({
  providedIn: 'root'
})
export class OrganizationFacade {
  private readonly organizationService = inject(OrganizationService);
  private readonly userService = inject(UserService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly supabaseService = inject(SupabaseService);

  // Proxy organization service signals
  readonly organizations = this.organizationService.organizations;
  readonly loading = this.organizationService.loading;
  readonly error = this.organizationService.error;

  /**
   * 創建組織（協調完整的組織創建流程）
   * Create organization (coordinates the full organization creation flow)
   *
   * This method orchestrates:
   * 1. Getting the current authenticated user
   * 2. Getting the user's account ID
   * 3. Creating the organization
   * 4. Adding the creator as owner
   * 5. Handling rollback if member creation fails
   * 6. Reloading workspace data
   *
   * @param {CreateOrganizationRequest} request - Create request
   * @returns {Promise<OrganizationBusinessModel>} Created organization
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationBusinessModel> {
    try {
      // Step 1: Get current authenticated user
      const user = await this.supabaseService.getUser();
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      // Step 2: Get user's account ID
      const userAccount = await this.userService.findByAuthUserId(user.id);
      if (!userAccount || !userAccount['id']) {
        throw new Error('User account not found');
      }
      const userAccountId = userAccount['id'] as string;

      // Step 3: Create organization
      const organization = await this.organizationService.createOrganization(request);
      const organizationId = organization['id'] as string;

      // Step 4: Add creator as owner
      // This must be done immediately after organization creation because
      // RLS policies require the organization to have no members yet.
      // If this fails, the organization will be unusable (no owner).
      try {
        await this.organizationService.addOrganizationMember(organizationId, userAccountId, OrganizationMemberRole.OWNER);
      } catch (memberError) {
        // Step 5: Rollback - soft delete the organization if member creation fails
        try {
          await this.organizationService.softDeleteOrganization(organizationId);
          console.warn(`[OrganizationFacade] Rolled back organization creation due to member creation failure: ${organizationId}`);
        } catch (rollbackError) {
          console.error('[OrganizationFacade] Failed to rollback organization creation:', rollbackError);
        }

        // Throw error to inform caller
        const errorMessage = memberError instanceof Error ? memberError.message : 'Failed to create organization member';
        console.error('[OrganizationFacade] Failed to create organization member:', memberError);
        throw new Error(`Failed to create organization: ${errorMessage}`);
      }

      // Step 6: Reload workspace data to reflect the new organization
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
