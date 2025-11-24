/**
 * User Repository
 *
 * 用戶資料存取層
 * User data access layer
 *
 * Provides CRUD operations for users.
 * Users are stored in accounts table with type='User'.
 * This repository enforces type filtering at the query level.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserAccount, UserAccountInsert, UserAccountUpdate, AccountType, AccountStatus, UserQueryOptions } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * User Repository
 *
 * Extends BaseRepository with User-specific query methods.
 * Automatically enforces type='User' filter on all queries.
 */
@Injectable({
  providedIn: 'root'
})
export class UserRepository extends BaseRepository<UserAccount, UserAccountInsert, UserAccountUpdate> {
  protected tableName = 'accounts';

  /**
   * Override findAll to enforce type='User' filter
   * 查詢所有用戶記錄（強制過濾 type='User'）
   *
   * @param {any} [options] - Query options
   * @returns {Observable<UserAccount[]>} Array of user accounts
   */
  override findAll(options?: any): Observable<UserAccount[]> {
    const filters = {
      ...options?.filters,
      type: AccountType.USER
    };

    return super.findAll({
      ...options,
      filters
    });
  }

  /**
   * Override findById to enforce type='User' filter
   * 根據 ID 查詢用戶（強制過濾 type='User'）
   *
   * @param {string} id - User ID
   * @param {string} [select] - Select clause
   * @returns {Observable<UserAccount | null>} User account or null
   */
  override findById(id: string, select?: string): Observable<UserAccount | null> {
    return this.findOne({ id }, select);
  }

  /**
   * Override findOne to enforce type='User' filter
   * 根據條件查詢單一用戶（強制過濾 type='User'）
   *
   * @param {Record<string, any>} filters - Filter conditions
   * @param {string} [select] - Select clause
   * @returns {Observable<UserAccount | null>} User account or null
   */
  override findOne(filters: Record<string, any>, select?: string): Observable<UserAccount | null> {
    const userFilters = {
      ...filters,
      type: AccountType.USER
    };

    return super.findOne(userFilters, select);
  }

  /**
   * Override create to enforce type='User'
   * 創建用戶（強制設定 type='User'）
   *
   * @param {UserAccountInsert} data - User data to insert
   * @returns {Observable<UserAccount>} Created user account
   */
  override create(data: UserAccountInsert): Observable<UserAccount> {
    const userData = {
      ...data,
      type: AccountType.USER
    } as any;

    return super.create(userData);
  }

  /**
   * Override count to enforce type='User' filter
   * 計數用戶數量（強制過濾 type='User'）
   *
   * @param {Record<string, any>} [filters] - Filter conditions
   * @returns {Observable<number>} User count
   */
  override count(filters?: Record<string, any>): Observable<number> {
    const userFilters = {
      ...filters,
      type: AccountType.USER
    };

    return super.count(userFilters);
  }

  /**
   * 根據 auth_user_id 查詢用戶帳戶
   * Find user account by auth_user_id
   *
   * @param {string} authUserId - Auth user ID from Supabase Auth
   * @returns {Observable<UserAccount | null>} User account or null
   */
  findByAuthUserId(authUserId: string): Observable<UserAccount | null> {
    return this.findOne({ authUserId });
  }

  /**
   * 根據 email 查詢用戶帳戶
   * Find user account by email
   *
   * @param {string} email - Email address
   * @returns {Observable<UserAccount | null>} User account or null
   */
  findByEmail(email: string): Observable<UserAccount | null> {
    return this.findOne({ email });
  }

  /**
   * 根據狀態查詢用戶
   * Find users by status
   *
   * @param {AccountStatus} status - Account status
   * @returns {Observable<UserAccount[]>} Users with specified status
   */
  findByStatus(status: AccountStatus): Observable<UserAccount[]> {
    return this.findAll({
      filters: { status }
    });
  }

  /**
   * 進階查詢（使用 UserQueryOptions）
   * Advanced query with UserQueryOptions
   *
   * @param {UserQueryOptions} options - Query options
   * @returns {Observable<UserAccount[]>} Filtered users
   */
  findWithOptions(options: UserQueryOptions): Observable<UserAccount[]> {
    const filters: Record<string, any> = {};

    if (options.status) {
      filters['status'] = options.status;
    } else if (!options.includeDeleted) {
      // 預設不包含已刪除的用戶
      // By default, exclude deleted users
      filters['status'] = [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED];
    }

    if (options.createdBy) {
      filters['createdBy'] = options.createdBy;
    }

    return this.findAll({ filters });
  }

  /**
   * 軟刪除用戶（設定狀態為 DELETED）
   * Soft delete user (set status to DELETED)
   *
   * @param {string} id - User ID
   * @returns {Observable<UserAccount>} Updated user account
   */
  softDelete(id: string): Observable<UserAccount> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的用戶
   * Restore deleted user
   *
   * @param {string} id - User ID
   * @returns {Observable<UserAccount>} Updated user account
   */
  restore(id: string): Observable<UserAccount> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }
}
