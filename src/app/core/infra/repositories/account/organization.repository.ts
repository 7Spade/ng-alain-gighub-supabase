/**
 * Organization Repository
 *
 * 組織資料存取層
 * Organization data access layer
 *
 * Provides CRUD operations for organizations.
 * Organizations are stored in accounts table with type='Organization'.
 * This repository enforces type='Organization' at the database query level for compile-time type safety.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Organization, OrganizationInsert, OrganizationUpdate, AccountType, AccountStatus } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * Organization Repository
 *
 * Extends BaseRepository with organization-specific query methods.
 * Enforces type='Organization' filter at database query level for type safety.
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationRepository extends BaseRepository<Organization, OrganizationInsert, OrganizationUpdate> {
  protected tableName = 'accounts';

  /**
   * 根據 ID 查詢組織
   * Find organization by ID
   *
   * @param {string} id - Organization ID
   * @returns {Observable<Organization | null>} Organization or null
   */
  override findById(id: string): Observable<Organization | null> {
    return super.findOne({
      id,
      type: AccountType.ORGANIZATION
    });
  }

  /**
   * 查詢所有組織（強制過濾 type='Organization'）
   * Find all organizations (enforces type='Organization' filter)
   *
   * @returns {Observable<Organization[]>} Array of organizations
   */
  override findAll(options?: any): Observable<Organization[]> {
    return super.findAll({
      ...options,
      filters: {
        ...options?.filters,
        type: AccountType.ORGANIZATION
      }
    });
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
   * 根據名稱查詢組織
   * Find organization by name
   *
   * @param {string} name - Organization name
   * @returns {Observable<Organization | null>} Organization or null
   */
  findByName(name: string): Observable<Organization | null> {
    return this.findOne({
      name,
      type: AccountType.ORGANIZATION
    });
  }

  /**
   * 創建組織（強制設定 type='Organization'）
   * Create organization (enforces type='Organization')
   *
   * @param {Partial<OrganizationInsert>} data - Organization data
   * @returns {Observable<Organization>} Created organization
   */
  override create(data: Partial<OrganizationInsert>): Observable<Organization> {
    return super.create({
      ...data,
      type: AccountType.ORGANIZATION
    } as OrganizationInsert);
  }

  /**
   * 更新組織
   * Update organization
   *
   * @param {string} id - Organization ID
   * @param {Partial<OrganizationUpdate>} data - Update data
   * @returns {Observable<Organization>} Updated organization
   */
  override update(id: string, data: Partial<OrganizationUpdate>): Observable<Organization> {
    // Ensure type cannot be changed
    const { type, ...updateData } = data as any;
    return super.update(id, updateData);
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

  /**
   * 查詢活躍組織
   * Find active organizations
   *
   * @returns {Observable<Organization[]>} Active organizations
   */
  findActive(): Observable<Organization[]> {
    return this.findAll({
      filters: {
        status: AccountStatus.ACTIVE
      }
    });
  }
}
