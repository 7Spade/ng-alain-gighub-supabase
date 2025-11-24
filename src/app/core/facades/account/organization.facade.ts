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
import { OrganizationService, OrganizationBusinessModel, CreateOrganizationRequest, UpdateOrganizationRequest } from '@shared';

import { BaseAccountCrudFacade } from './base-account-crud.facade';

@Injectable({
  providedIn: 'root'
})
export class OrganizationFacade extends BaseAccountCrudFacade<
  OrganizationBusinessModel,
  CreateOrganizationRequest,
  UpdateOrganizationRequest
> {
  private readonly organizationService = inject(OrganizationService);

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
   * @throws {Error} User-friendly error message
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationBusinessModel> {
    return this.executeCreate(request, req => this.organizationService.createOrganization(req), '組織');
  }

  /**
   * 更新組織
   * Update organization
   *
   * @param {string} id - Organization ID
   * @param {UpdateOrganizationRequest} request - Update request
   * @returns {Promise<OrganizationBusinessModel>} Updated organization
   * @throws {Error} User-friendly error message
   */
  async updateOrganization(id: string, request: UpdateOrganizationRequest): Promise<OrganizationBusinessModel> {
    return this.executeUpdate(id, request, (id, req) => this.organizationService.updateOrganization(id, req), '組織');
  }

  /**
   * 刪除組織（軟刪除）
   * Delete organization (soft delete)
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationBusinessModel>} Deleted organization
   * @throws {Error} User-friendly error message
   */
  async deleteOrganization(id: string): Promise<OrganizationBusinessModel> {
    return this.executeDelete(id, id => this.organizationService.softDeleteOrganization(id), '組織');
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
