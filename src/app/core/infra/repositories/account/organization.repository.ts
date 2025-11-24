/**
 * Organization Repository
 *
 * 組織資料存取層
 * Organization data access layer
 *
 * Provides CRUD operations for organizations.
 * Organizations are stored in accounts table with type='Organization'.
 *
 * @module core/infra/repositories/account
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountRepository } from './index';
import { AccountType, AccountStatus, OrganizationQueryOptions } from '../../types';

/**
 * Organization Repository
 *
 * Extends AccountRepository with organization-specific query methods.
 * Since organizations are stored in accounts table, this repository
 * provides a specialized interface for organization operations.
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationRepository {
  private readonly accountRepo = inject(AccountRepository);

  /**
   * 根據 ID 查詢組織
   * Find organization by ID
   *
   * @param {string} id - Organization ID
   * @returns {Observable<Organization | null>} Organization or null
   */
  findById(id: string): Observable<any> {
    return this.accountRepo.findById(id);
    // Note: Type checking should be done at service layer
  }

  /**
   * 根據組織 ID 列表查詢組織
   * Find organizations by IDs
   *
   * @param {string[]} ids - Organization IDs
   * @returns {Observable<Organization[]>} Organizations
   */
  findByIds(ids: string[]): Observable<any[]> {
    return this.accountRepo.findAll({
      filters: {
        id: ids as any,
        type: AccountType.ORGANIZATION as any
      }
    });
  }

  /**
   * 查詢用戶創建的組織
   * Find organizations created by user
   *
   * @param {string} authUserId - Auth user ID
   * @returns {Observable<Organization[]>} Organizations created by user
   */
  findCreatedByUser(authUserId: string): Observable<any[]> {
    return this.accountRepo.findCreatedOrganizations(authUserId);
  }

  /**
   * 進階查詢（使用 OrganizationQueryOptions）
   * Advanced query with OrganizationQueryOptions
   *
   * @param {OrganizationQueryOptions} options - Query options
   * @returns {Observable<Organization[]>} Filtered organizations
   */
  findWithOptions(options: OrganizationQueryOptions): Observable<any[]> {
    const filters: Record<string, any> = {
      type: AccountType.ORGANIZATION
    };

    if (options.status) {
      filters['status'] = options.status;
    } else if (!options.includeDeleted) {
      // 預設不包含已刪除的組織
      // By default, exclude deleted organizations
      filters['status'] = [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED];
    }

    if (options.createdBy) {
      filters['createdBy'] = options.createdBy;
    }

    return this.accountRepo.findAll({ filters });
  }

  /**
   * 創建組織
   * Create organization
   *
   * @param {OrganizationInsert} data - Organization data
   * @returns {Observable<Organization>} Created organization
   */
  create(data: any): Observable<any> {
    const insertData = {
      ...data,
      type: AccountType.ORGANIZATION
    };
    return this.accountRepo.create(insertData);
  }

  /**
   * 更新組織
   * Update organization
   *
   * @param {string} id - Organization ID
   * @param {OrganizationUpdate} data - Update data
   * @returns {Observable<Organization>} Updated organization
   */
  update(id: string, data: any): Observable<any> {
    return this.accountRepo.update(id, data);
  }

  /**
   * 軟刪除組織（設定狀態為 DELETED）
   * Soft delete organization (set status to DELETED)
   *
   * @param {string} id - Organization ID
   * @returns {Observable<Organization>} Updated organization
   */
  softDelete(id: string): Observable<any> {
    return this.accountRepo.softDelete(id);
  }

  /**
   * 恢復已刪除的組織
   * Restore deleted organization
   *
   * @param {string} id - Organization ID
   * @returns {Observable<Organization>} Updated organization
   */
  restore(id: string): Observable<any> {
    return this.accountRepo.restore(id);
  }
}
