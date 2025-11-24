/**
 * User Repository
 *
 * 用戶資料存取層（專用 Repository）
 * User data access layer (Specialized Repository)
 *
 * Provides CRUD operations specifically for User accounts.
 * Enforces type='User' filtering at the repository level to ensure type safety.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserAccount, UserAccountInsert, UserAccountUpdate, AccountType, AccountStatus, QueryOptions } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * User Repository
 *
 * 用戶帳戶資料存取層
 * User account data access layer
 *
 * Extends BaseRepository with user-specific query methods.
 * All queries automatically filter by type='User'.
 *
 * @example
 * ```typescript
 * constructor(private userRepo: UserRepository) {}
 *
 * // Find user by auth user ID
 * const user = await firstValueFrom(this.userRepo.findByAuthUserId(authUserId));
 *
 * // Find user by email
 * const user = await firstValueFrom(this.userRepo.findByEmail(email));
 *
 * // Create new user
 * const newUser = await firstValueFrom(this.userRepo.create({
 *   type: AccountType.USER,
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   authUserId: 'auth-user-id'
 * }));
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class UserRepository extends BaseRepository<UserAccount, UserAccountInsert, UserAccountUpdate> {
  protected tableName = 'accounts';

  /**
   * 查詢所有用戶帳戶（自動過濾 type='User'）
   * Find all user accounts (automatically filters type='User')
   *
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<UserAccount[]>} Array of user accounts
   */
  override findAll(options?: QueryOptions): Observable<UserAccount[]> {
    // Enforce type='User' filter
    const filters = {
      ...options?.filters,
      type: AccountType.USER
    };

    // Apply status filter (exclude deleted by default) if no filters provided
    if (!options?.filters) {
      return super.findAll({
        ...options,
        filters: {
          ...filters,
          status: [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED]
        }
      });
    }

    return super.findAll({ ...options, filters });
  }

  /**
   * 根據 ID 查詢用戶帳戶
   * Find user account by ID
   *
   * @param {string} id - Account ID
   * @returns {Observable<UserAccount | null>} User account or null
   */
  override findById(id: string): Observable<UserAccount | null> {
    return super.findById(id).pipe(
      map(account => {
        // Verify type is User
        if (account && (account as any).type === AccountType.USER) {
          return account;
        }
        return null;
      })
    );
  }

  /**
   * 根據 auth_user_id 查詢用戶帳戶
   * Find user account by auth_user_id
   *
   * @param {string} authUserId - Auth user ID from Supabase Auth
   * @returns {Observable<UserAccount | null>} User account or null
   */
  findByAuthUserId(authUserId: string): Observable<UserAccount | null> {
    return super.findOne({
      authUserId,
      type: AccountType.USER
    });
  }

  /**
   * 根據 email 查詢用戶帳戶
   * Find user account by email
   *
   * @param {string} email - Email address
   * @returns {Observable<UserAccount | null>} User account or null
   */
  findByEmail(email: string): Observable<UserAccount | null> {
    return super.findOne({
      email,
      type: AccountType.USER
    });
  }

  /**
   * 創建用戶帳戶（自動設定 type='User'）
   * Create user account (automatically sets type='User')
   *
   * @param {UserAccountInsert} data - User data
   * @returns {Observable<UserAccount>} Created user account
   */
  override create(data: UserAccountInsert): Observable<UserAccount> {
    // Enforce type='User'
    const userData = {
      ...data,
      type: AccountType.USER,
      status: data['status'] || AccountStatus.ACTIVE
    } as UserAccountInsert;

    return super.create(userData);
  }

  /**
   * 更新用戶帳戶
   * Update user account
   *
   * @param {string} id - Account ID
   * @param {UserAccountUpdate} data - Update data
   * @returns {Observable<UserAccount>} Updated user account
   */
  override update(id: string, data: UserAccountUpdate): Observable<UserAccount> {
    // Prevent type change
    const updateData = { ...data };
    delete (updateData as any).type;

    return super.update(id, updateData);
  }

  /**
   * 軟刪除用戶帳戶（設定狀態為 DELETED）
   * Soft delete user account (set status to DELETED)
   *
   * @param {string} id - Account ID
   * @returns {Observable<UserAccount>} Updated user account
   */
  softDelete(id: string): Observable<UserAccount> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的用戶帳戶
   * Restore deleted user account
   *
   * @param {string} id - Account ID
   * @returns {Observable<UserAccount>} Updated user account
   */
  restore(id: string): Observable<UserAccount> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }

  /**
   * 檢查用戶名稱是否已存在
   * Check if user name exists
   *
   * @param {string} name - User name
   * @returns {Observable<boolean>} True if name exists
   */
  checkNameExists(name: string): Observable<boolean> {
    return super
      .count({
        name,
        type: AccountType.USER,
        status: [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED]
      })
      .pipe(map(count => count > 0));
  }

  /**
   * 檢查電子郵件是否已存在
   * Check if email exists
   *
   * @param {string} email - Email address
   * @returns {Observable<boolean>} True if email exists
   */
  checkEmailExists(email: string): Observable<boolean> {
    return super
      .count({
        email,
        type: AccountType.USER,
        status: [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED]
      })
      .pipe(map(count => count > 0));
  }
}
