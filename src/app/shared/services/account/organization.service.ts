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
import {
  AccountStatus,
  OrganizationMemberRole,
  UserRepository,
  SupabaseService,
  OrganizationRepository,
  OrganizationMemberRepository
} from '@core';
import { firstValueFrom } from 'rxjs';

import { OrganizationBusinessModel, CreateOrganizationRequest, UpdateOrganizationRequest } from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly organizationRepo = inject(OrganizationRepository);
  private readonly organizationMemberRepo = inject(OrganizationMemberRepository);
  private readonly userRepo = inject(UserRepository);
  private readonly supabaseService = inject(SupabaseService);

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
    return account as OrganizationBusinessModel | null;
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
    return orgs as OrganizationBusinessModel[];
  }

  /**
   * 創建組織
   * Create organization
   *
   * @param {CreateOrganizationRequest} request - Create request
   * @returns {Promise<OrganizationModel>} Created organization
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationBusinessModel> {
    // 1. 獲取當前用戶的 auth_user_id
    const user = await this.supabaseService.getUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    // 2. 獲取當前用戶的 account_id
    const userAccount = await firstValueFrom(this.userRepo.findByAuthUserId(user.id));
    if (!userAccount) {
      throw new Error('User account not found');
    }
    const userAccountId = userAccount['id'] as string;

    // 3. 創建組織
    const insertData = {
      name: request.name,
      email: request.email || null,
      avatar: request.avatar || null,
      status: request.status || AccountStatus.ACTIVE
    };

    const organization = await firstValueFrom(this.organizationRepo.create(insertData));
    const organizationId = organization['id'] as string;

    // 4. 創建 organization_members 記錄，將創建者設為 owner
    // 這必須在創建組織後立即執行，因為 RLS 策略要求組織還沒有任何成員
    // 如果創建成員記錄失敗，組織將無法使用（沒有 owner），所以我們必須拋出異常
    try {
      await firstValueFrom(
        this.organizationMemberRepo.create({
          organizationId,
          accountId: userAccountId,
          role: OrganizationMemberRole.OWNER
        } as any)
      );
    } catch (error) {
      // 如果創建成員記錄失敗，嘗試軟刪除剛創建的組織
      try {
        await firstValueFrom(this.organizationRepo.softDelete(organizationId));
        console.warn(`[OrganizationService] Rolled back organization creation due to member creation failure: ${organizationId}`);
      } catch (rollbackError) {
        console.error('[OrganizationService] Failed to rollback organization creation:', rollbackError);
      }

      // 拋出異常，讓調用者知道創建失敗
      const errorMessage = error instanceof Error ? error.message : 'Failed to create organization member';
      console.error('[OrganizationService] Failed to create organization member:', error);
      throw new Error(`Failed to create organization: ${errorMessage}`);
    }

    return organization as OrganizationBusinessModel;
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
