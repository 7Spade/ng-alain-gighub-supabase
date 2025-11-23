/**
 * Organization Service
 *
 * 組織管理服務（Shared 層）
 * Organization management service (Shared layer)
 *
 * Provides business logic for organization operations using Signals-based state management.
 * Handles organization CRUD operations and coordinates with AccountRepository.
 *
 * @module shared/services/account
 */

import { Injectable, inject, signal } from '@angular/core';
import { AccountType, AccountStatus, OrganizationMemberRole, OrganizationRepository, OrganizationMemberRepository } from '@core';
import { firstValueFrom } from 'rxjs';

import { OrganizationBusinessModel, CreateOrganizationRequest, UpdateOrganizationRequest } from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly organizationRepo = inject(OrganizationRepository);
  private readonly organizationMemberRepo = inject(OrganizationMemberRepository);

  // State
  private organizationsState = signal<OrganizationBusinessModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Readonly signals
  readonly organizations = this.organizationsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 根據 ID 查詢組織
   * Find organization by ID
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationModel | null>} Organization or null
   */
  async findById(id: string): Promise<OrganizationBusinessModel | null> {
    const account = await firstValueFrom(this.organizationRepo.findById(id));
    if (account && (account as any).type === AccountType.ORGANIZATION) {
      return account as OrganizationBusinessModel;
    }
    return null;
  }

  /**
   * 查詢用戶創建的組織
   * Find organizations created by user
   *
   * @param {string} authUserId - Auth user ID
   * @returns {Promise<OrganizationBusinessModel[]>} Organizations created by user
   */
  async getUserCreatedOrganizations(authUserId: string): Promise<OrganizationBusinessModel[]> {
    const orgs = await firstValueFrom(this.organizationRepo.findCreatedByUser(authUserId));
    return orgs as OrganizationBusinessModel[];
  }

  /**
   * 查詢用戶加入的組織
   * Find organizations user has joined
   *
   * @param {string} accountId - Account ID
   * @returns {Promise<OrganizationBusinessModel[]>} Organizations user has joined
   */
  async getUserJoinedOrganizations(accountId: string): Promise<OrganizationBusinessModel[]> {
    const memberships = await firstValueFrom(this.organizationMemberRepo.findByAccount(accountId));
    const orgIds = memberships.map(m => (m as any).organizationId);

    if (orgIds.length === 0) {
      return [];
    }

    const orgs = await firstValueFrom(this.organizationRepo.findByIds(orgIds));
    return orgs.filter(org => org && (org as any).type === AccountType.ORGANIZATION) as OrganizationBusinessModel[];
  }

  /**
   * 創建組織（僅創建組織實體）
   * Create organization (only creates the organization entity)
   *
   * Note: This method only creates the organization entity.
   * The Facade layer is responsible for coordinating the creation
   * of the organization with its initial owner membership.
   *
   * @param {CreateOrganizationRequest} request - Create request
   * @returns {Promise<OrganizationBusinessModel>} Created organization
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationBusinessModel> {
    const insertData = {
      name: request.name,
      email: request.email || null,
      avatar: request.avatar || null,
      status: request.status || AccountStatus.ACTIVE
    };

    const organization = await firstValueFrom(this.organizationRepo.create(insertData));
    return organization as OrganizationBusinessModel;
  }

  /**
   * 為組織添加成員
   * Add member to organization
   *
   * @param {string} organizationId - Organization ID
   * @param {string} accountId - Account ID to add
   * @param {OrganizationMemberRole} role - Member role
   * @returns {Promise<void>}
   */
  async addOrganizationMember(organizationId: string, accountId: string, role: OrganizationMemberRole): Promise<void> {
    await firstValueFrom(
      this.organizationMemberRepo.create({
        organizationId,
        accountId,
        role
      } as any)
    );
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
    const account = await firstValueFrom(this.organizationRepo.update(id, request as any));
    return account as OrganizationBusinessModel;
  }

  /**
   * 軟刪除組織（設定狀態為 DELETED）
   * Soft delete organization (set status to DELETED)
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationBusinessModel>} Updated organization
   */
  async softDeleteOrganization(id: string): Promise<OrganizationBusinessModel> {
    const account = await firstValueFrom(this.organizationRepo.softDelete(id));
    return account as OrganizationBusinessModel;
  }

  /**
   * 恢復已刪除的組織
   * Restore deleted organization
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationBusinessModel>} Updated organization
   */
  async restoreOrganization(id: string): Promise<OrganizationBusinessModel> {
    const account = await firstValueFrom(this.organizationRepo.restore(id));
    return account as OrganizationBusinessModel;
  }

  /**
   * 載入用戶創建的組織列表
   * Load organizations created by user
   *
   * @param {string} authUserId - Auth user ID
   */
  async loadUserCreatedOrganizations(authUserId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const orgs = await this.getUserCreatedOrganizations(authUserId);
      this.organizationsState.set(orgs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load organizations';
      this.errorState.set(errorMessage);
      console.error('[OrganizationService] Failed to load organizations:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }
}
