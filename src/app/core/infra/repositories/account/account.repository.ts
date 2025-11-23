/**
 * Account Repository
 *
 * 帳戶資料存取層
 * Account data access layer
 *
 * Provides CRUD operations for accounts (User, Organization, Bot).
 * Extends BaseRepository with account-specific query methods.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database, AccountType, AccountStatus, AccountQueryOptions } from '../../types';
import { BaseRepository } from '../base.repository';

type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

@Injectable({
  providedIn: 'root'
})
export class AccountRepository extends BaseRepository<Account, AccountInsert, AccountUpdate> {
  protected tableName = 'accounts';

  /**
   * 根據類型查詢帳戶
   * Find accounts by type
   *
   * @param {AccountType} type - Account type
   * @returns {Observable<Account[]>} Accounts of specified type
   */
  findByType(type: AccountType): Observable<Account[]> {
    return this.findAll({
      filters: { type: type as any }
    });
  }

  /**
   * 根據狀態查詢帳戶
   * Find accounts by status
   *
   * @param {AccountStatus} status - Account status
   * @returns {Observable<Account[]>} Accounts with specified status
   */
  findByStatus(status: AccountStatus): Observable<Account[]> {
    return this.findAll({
      filters: { status: status as any }
    });
  }

  /**
   * 根據 auth_user_id 查詢用戶帳戶
   * Find user account by auth_user_id
   *
   * @param {string} authUserId - Auth user ID from Supabase Auth
   * @returns {Observable<Account | null>} User account or null
   */
  findByAuthUserId(authUserId: string): Observable<Account | null> {
    return this.findOne({ authUserId });
  }

  /**
   * 根據 email 查詢帳戶
   * Find account by email
   *
   * @param {string} email - Email address
   * @returns {Observable<Account | null>} Account or null
   */
  findByEmail(email: string): Observable<Account | null> {
    return this.findOne({ email });
  }

  /**
   * 查詢用戶創建的組織
   * Find organizations created by user
   *
   * @param {string} authUserId - Auth user ID
   * @returns {Observable<Account[]>} Organizations created by user
   */
  findCreatedOrganizations(authUserId: string): Observable<Account[]> {
    return this.findAll({
      filters: {
        type: AccountType.ORGANIZATION,
        createdBy: authUserId,
        status: AccountStatus.ACTIVE
      }
    });
  }

  /**
   * 進階查詢（使用 AccountQueryOptions）
   * Advanced query with AccountQueryOptions
   *
   * @param {AccountQueryOptions} options - Query options
   * @returns {Observable<Account[]>} Filtered accounts
   */
  findWithOptions(options: AccountQueryOptions): Observable<Account[]> {
    const filters: Record<string, any> = {};

    if (options.type) {
      filters['type'] = options.type;
    }

    if (options.status) {
      filters['status'] = options.status;
    } else if (!options.includeDeleted) {
      // 預設不包含已刪除的帳戶
      // By default, exclude deleted accounts
      filters['status'] = [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED];
    }

    if (options.createdBy) {
      filters['createdBy'] = options.createdBy;
    }

    return this.findAll({ filters });
  }

  /**
   * 檢查帳戶名稱是否已存在
   * Check if account name exists
   *
   * @param {string} name - Account name
   * @param {AccountType} [type] - Account type (optional filter)
   * @returns {Observable<boolean>} True if name exists
   */
  checkNameExists(name: string, type?: AccountType): Observable<boolean> {
    const filters: Record<string, any> = { name };
    if (type) {
      filters['type'] = type;
    }

    return this.count(filters).pipe(map(count => count > 0));
  }

  /**
   * 軟刪除帳戶（設定狀態為 DELETED）
   * Soft delete account (set status to DELETED)
   *
   * @param {string} id - Account ID
   * @returns {Observable<Account>} Updated account
   */
  softDelete(id: string): Observable<Account> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的帳戶
   * Restore deleted account
   *
   * @param {string} id - Account ID
   * @returns {Observable<Account>} Updated account
   */
  restore(id: string): Observable<Account> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }
}
