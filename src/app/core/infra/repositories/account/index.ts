/**
 * Account Repositories Module
 *
 * Exports all account-related repository classes (unified identity abstraction and business domains).
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database, AccountType, AccountStatus } from '../../types';
import { BaseRepository } from '../base.repository';

// ============================================================================
// Account Unified Identity Abstraction Repository (統一身份抽象 Repository)
// ============================================================================

type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

/**
 * Account Repository
 *
 * @deprecated Use UserRepository, BotRepository, or OrganizationRepository instead.
 * This repository provides generic account operations but lacks type safety.
 * For type-specific operations, use the specialized repositories:
 * - UserRepository for type='User'
 * - BotRepository for type='Bot'
 * - OrganizationRepository for type='Organization'
 *
 * 帳戶資料存取層
 * Account data access layer
 *
 * Provides CRUD operations for accounts (User, Organization, Bot).
 * Extends BaseRepository with account-specific query methods.
 */
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
   * @deprecated Use specialized repositories (UserRepository, BotRepository, OrganizationRepository)
   * @param {AccountStatus} status - Account status
   * @returns {Observable<Account[]>} Accounts with specified status
   */
  findByStatus(status: AccountStatus): Observable<Account[]> {
    return this.findAll({
      filters: { status: status as any }
    });
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

// ============================================================================
// Business Domain Repositories (業務域 Repositories - 扁平化導出)
// ============================================================================

// User Repository
export * from './user.repository';

// Bot Repository
export * from './bot.repository';

// Organization Repository and related
export * from './organization.repository';
export * from './organization-member.repository';

// Team Repository and related
export * from './team.repository';
export * from './team-member.repository';
