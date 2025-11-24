/**
 * Organization Repository
 *
 * 組織資料存取層
 * Organization data access layer
 *
 * Provides CRUD operations for organizations.
 * Organizations are stored in accounts table with type='Organization'.
 * This repository enforces type filtering at the query level.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Organization, OrganizationInsert, OrganizationUpdate, AccountType, AccountStatus, OrganizationQueryOptions } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * Organization Repository
 *
 * Extends BaseRepository with Organization-specific query methods.
 * Automatically enforces type='Organization' filter on all queries.
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationRepository extends BaseRepository<Organization, OrganizationInsert, OrganizationUpdate> {
  protected tableName = 'accounts';

  /**
   * Override findAll to enforce type='Organization' filter
   * 查詢所有組織記錄（強制過濾 type='Organization'）
   *
   * @param {any} [options] - Query options
   * @returns {Observable<Organization[]>} Array of organization accounts
   */
  override findAll(options?: any): Observable<Organization[]> {
    const filters = {
      ...options?.filters,
      type: AccountType.ORGANIZATION
    };

    return super.findAll({
      ...options,
      filters
    });
  }

  /**
   * Override findById to enforce type='Organization' filter
   * 根據 ID 查詢組織（強制過濾 type='Organization'）
   *
   * @param {string} id - Organization ID
   * @param {string} [select] - Select clause
   * @returns {Observable<Organization | null>} Organization account or null
   */
  override findById(id: string, select?: string): Observable<Organization | null> {
    return this.findOne({ id }, select);
  }

  /**
   * Override findOne to enforce type='Organization' filter
   * 根據條件查詢單一組織（強制過濾 type='Organization'）
   *
   * @param {Record<string, any>} filters - Filter conditions
   * @param {string} [select] - Select clause
   * @returns {Observable<Organization | null>} Organization account or null
   */
  override findOne(filters: Record<string, any>, select?: string): Observable<Organization | null> {
    const orgFilters = {
      ...filters,
      type: AccountType.ORGANIZATION
    };

    return super.findOne(orgFilters, select);
  }

  /**
   * Override create to enforce type='Organization'
   * 創建組織（強制設定 type='Organization'）
   *
   * @param {OrganizationInsert} data - Organization data to insert
   * @returns {Observable<Organization>} Created organization account
   */
  override create(data: OrganizationInsert): Observable<Organization> {
    const orgData = {
      ...data,
      type: AccountType.ORGANIZATION
    } as any;

    return super.create(orgData);
  }

  /**
   * Override count to enforce type='Organization' filter
   * 計數組織數量（強制過濾 type='Organization'）
   *
   * @param {Record<string, any>} [filters] - Filter conditions
   * @returns {Observable<number>} Organization count
   */
  override count(filters?: Record<string, any>): Observable<number> {
    const orgFilters = {
      ...filters,
      type: AccountType.ORGANIZATION
    };

    return super.count(orgFilters);
  }

  /**
   * 根據組織 ID 列表查詢組織
   * Find organizations by IDs
   *
   * @param {string[]} ids - Organization IDs
   * @returns {Observable<Organization[]>} Organizations
   */
  findByIds(ids: string[]): Observable<Organization[]> {
    return this.findAll({
      filters: {
        id: ids as any
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
  findCreatedByUser(authUserId: string): Observable<Organization[]> {
    return this.findAll({
      filters: {
        createdBy: authUserId,
        status: AccountStatus.ACTIVE
      }
    });
  }

  /**
   * 根據狀態查詢組織
   * Find organizations by status
   *
   * @param {AccountStatus} status - Account status
   * @returns {Observable<Organization[]>} Organizations with specified status
   */
  findByStatus(status: AccountStatus): Observable<Organization[]> {
    return this.findAll({
      filters: { status }
    });
  }

  /**
   * 進階查詢（使用 OrganizationQueryOptions）
   * Advanced query with OrganizationQueryOptions
   *
   * @param {OrganizationQueryOptions} options - Query options
   * @returns {Observable<Organization[]>} Filtered organizations
   */
  findWithOptions(options: OrganizationQueryOptions): Observable<Organization[]> {
    const filters: Record<string, any> = {};

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

    return this.findAll({ filters });
  }

  /**
   * 軟刪除組織（設定狀態為 DELETED）
   * Soft delete organization (set status to DELETED)
   *
   * @param {string} id - Organization ID
   * @returns {Observable<Organization>} Updated organization
   */
  softDelete(id: string): Observable<Organization> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的組織
   * Restore deleted organization
   *
   * @param {string} id - Organization ID
   * @returns {Observable<Organization>} Updated organization
   */
  restore(id: string): Observable<Organization> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }
}
