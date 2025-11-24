/**
 * User Repository
 *
 * 用戶資料存取層
 * User data access layer
 *
 * Provides CRUD operations for user accounts.
 * Users are stored in accounts table with type='User'.
 * This repository enforces type='User' at the database query level for compile-time type safety.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserAccount, UserAccountInsert, UserAccountUpdate, AccountType, AccountStatus } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * User Repository
 *
 * Extends BaseRepository with user-specific query methods.
 * Enforces type='User' filter at database query level for type safety.
 */
@Injectable({
  providedIn: 'root'
})
export class UserRepository extends BaseRepository<UserAccount, UserAccountInsert, UserAccountUpdate> {
  protected tableName = 'accounts';

  /**
   * 根據 ID 查詢用戶
   * Find user by ID
   *
   * @param {string} id - User ID
   * @returns {Observable<UserAccount | null>} User or null
   */
  override findById(id: string): Observable<UserAccount | null> {
    return super.findOne({
      id,
      type: AccountType.USER
    });
  }

  /**
   * 查詢所有用戶（強制過濾 type='User'）
   * Find all users (enforces type='User' filter)
   *
   * @returns {Observable<UserAccount[]>} Array of users
   */
  override findAll(options?: any): Observable<UserAccount[]> {
    return super.findAll({
      ...options,
      filters: {
        ...options?.filters,
        type: AccountType.USER
      }
    });
  }

  /**
   * 根據 auth_user_id 查詢用戶帳戶
   * Find user account by auth_user_id
   *
   * @param {string} authUserId - Auth user ID from Supabase Auth
   * @returns {Observable<UserAccount | null>} User account or null
   */
  findByAuthUserId(authUserId: string): Observable<UserAccount | null> {
    return this.findOne({
      authUserId,
      type: AccountType.USER
    });
  }

  /**
   * 根據 email 查詢用戶
   * Find user by email
   *
   * @param {string} email - Email address
   * @returns {Observable<UserAccount | null>} User or null
   */
  findByEmail(email: string): Observable<UserAccount | null> {
    return this.findOne({
      email,
      type: AccountType.USER
    });
  }

  /**
   * 創建用戶帳戶（強制設定 type='User'）
   * Create user account (enforces type='User')
   *
   * @param {Partial<UserAccountInsert>} data - User data
   * @returns {Observable<UserAccount>} Created user
   */
  override create(data: Partial<UserAccountInsert>): Observable<UserAccount> {
    return super.create({
      ...data,
      type: AccountType.USER
    } as UserAccountInsert);
  }

  /**
   * 更新用戶帳戶
   * Update user account
   *
   * @param {string} id - User ID
   * @param {Partial<UserAccountUpdate>} data - Update data
   * @returns {Observable<UserAccount>} Updated user
   */
  override update(id: string, data: Partial<UserAccountUpdate>): Observable<UserAccount> {
    // Ensure type cannot be changed
    const { type, ...updateData } = data as any;
    return super.update(id, updateData);
  }

  /**
   * 軟刪除用戶（設定狀態為 DELETED）
   * Soft delete user (set status to DELETED)
   *
   * @param {string} id - User ID
   * @returns {Observable<UserAccount>} Updated user
   */
  softDelete(id: string): Observable<UserAccount> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的用戶
   * Restore deleted user
   *
   * @param {string} id - User ID
   * @returns {Observable<UserAccount>} Updated user
   */
  restore(id: string): Observable<UserAccount> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }

  /**
   * 查詢活躍用戶
   * Find active users
   *
   * @returns {Observable<UserAccount[]>} Active users
   */
  findActive(): Observable<UserAccount[]> {
    return this.findAll({
      filters: {
        status: AccountStatus.ACTIVE
      }
    });
  }
}
