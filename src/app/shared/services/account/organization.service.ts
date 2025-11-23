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
import { firstValueFrom } from 'rxjs';
import { AccountRepository, AccountType, AccountStatus } from '@core';
import { OrganizationBusinessModel, CreateOrganizationRequest, UpdateOrganizationRequest } from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly accountRepo = inject(AccountRepository);

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
    const account = await firstValueFrom(this.accountRepo.findById(id));
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
    const orgs = await firstValueFrom(this.accountRepo.findCreatedOrganizations(authUserId));
    return orgs as OrganizationBusinessModel[];
  }

  /**
   * 查詢用戶加入的組織
   * Find organizations user has joined
   *
   * @param {string} accountId - Account ID
   * @returns {Promise<OrganizationModel[]>} Organizations user has joined
   */
  async getUserJoinedOrganizations(accountId: string): Promise<OrganizationBusinessModel[]> {
    // TODO: Implement when organization_members repository is ready
    return [];
  }

  /**
   * 創建組織
   * Create organization
   *
   * @param {CreateOrganizationRequest} request - Create request
   * @returns {Promise<OrganizationModel>} Created organization
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationBusinessModel> {
    const insertData = {
      type: AccountType.ORGANIZATION,
      name: request.name,
      email: request.email || null,
      avatar: request.avatar || null,
      status: request.status || AccountStatus.ACTIVE
    };

    const account = await firstValueFrom(this.accountRepo.create(insertData as any));
      return account as OrganizationBusinessModel;
  }

  /**
   * 更新組織
   * Update organization
   *
   * @param {string} id - Organization ID
   * @param {UpdateOrganizationRequest} request - Update request
   * @returns {Promise<OrganizationModel>} Updated organization
   */
  async updateOrganization(id: string, request: UpdateOrganizationRequest): Promise<OrganizationBusinessModel> {
    const account = await firstValueFrom(this.accountRepo.update(id, request as any));
      return account as OrganizationBusinessModel;
  }

  /**
   * 軟刪除組織（設定狀態為 DELETED）
   * Soft delete organization (set status to DELETED)
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationModel>} Updated organization
   */
  async softDeleteOrganization(id: string): Promise<OrganizationBusinessModel> {
    const account = await firstValueFrom(this.accountRepo.softDelete(id));
      return account as OrganizationBusinessModel;
  }

  /**
   * 恢復已刪除的組織
   * Restore deleted organization
   *
   * @param {string} id - Organization ID
   * @returns {Promise<OrganizationModel>} Updated organization
   */
  async restoreOrganization(id: string): Promise<OrganizationBusinessModel> {
    const account = await firstValueFrom(this.accountRepo.restore(id));
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
