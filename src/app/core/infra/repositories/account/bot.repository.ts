/**
 * Bot Repository
 *
 * 機器人資料存取層（專用 Repository）
 * Bot data access layer (Specialized Repository)
 *
 * Provides CRUD operations specifically for Bot accounts.
 * Enforces type='Bot' filtering at the repository level to ensure type safety.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Bot, BotInsert, BotUpdate, AccountType, AccountStatus, QueryOptions } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * Bot Repository
 *
 * 機器人帳戶資料存取層
 * Bot account data access layer
 *
 * Extends BaseRepository with bot-specific query methods.
 * All queries automatically filter by type='Bot'.
 *
 * @example
 * ```typescript
 * constructor(private botRepo: BotRepository) {}
 *
 * // Find all active bots
 * const bots = await firstValueFrom(this.botRepo.findAll({ filters: { status: 'active' } }));
 *
 * // Find bot by ID
 * const bot = await firstValueFrom(this.botRepo.findById(botId));
 *
 * // Create new bot
 * const newBot = await firstValueFrom(this.botRepo.create({
 *   type: AccountType.BOT,
 *   name: 'My Bot',
 *   email: 'bot@example.com',
 *   createdBy: 'auth-user-id'
 * }));
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BotRepository extends BaseRepository<Bot, BotInsert, BotUpdate> {
  protected tableName = 'accounts';

  /**
   * 查詢所有機器人帳戶（自動過濾 type='Bot'）
   * Find all bot accounts (automatically filters type='Bot')
   *
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Bot[]>} Array of bot accounts
   */
  override findAll(options?: QueryOptions): Observable<Bot[]> {
    // Enforce type='Bot' filter
    const filters = {
      ...options?.filters,
      type: AccountType.BOT
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
   * 根據 ID 查詢機器人帳戶
   * Find bot account by ID
   *
   * @param {string} id - Account ID
   * @returns {Observable<Bot | null>} Bot account or null
   */
  override findById(id: string): Observable<Bot | null> {
    return super.findById(id).pipe(
      map(account => {
        // Verify type is Bot
        if (account && (account as any).type === AccountType.BOT) {
          return account;
        }
        return null;
      })
    );
  }

  /**
   * 根據名稱查詢機器人帳戶
   * Find bot account by name
   *
   * @param {string} name - Bot name
   * @returns {Observable<Bot | null>} Bot account or null
   */
  findByName(name: string): Observable<Bot | null> {
    return super.findOne({
      name,
      type: AccountType.BOT
    });
  }

  /**
   * 查詢用戶創建的機器人
   * Find bots created by user
   *
   * @param {string} authUserId - Auth user ID
   * @returns {Observable<Bot[]>} Bots created by user
   */
  findByCreator(authUserId: string): Observable<Bot[]> {
    return this.findAll({
      filters: {
        createdBy: authUserId,
        type: AccountType.BOT
      }
    });
  }

  /**
   * 創建機器人帳戶（自動設定 type='Bot'）
   * Create bot account (automatically sets type='Bot')
   *
   * @param {BotInsert} data - Bot data
   * @returns {Observable<Bot>} Created bot account
   */
  override create(data: BotInsert): Observable<Bot> {
    // Enforce type='Bot'
    const botData = {
      ...data,
      type: AccountType.BOT,
      status: data['status'] || AccountStatus.ACTIVE
    } as BotInsert;

    return super.create(botData);
  }

  /**
   * 更新機器人帳戶
   * Update bot account
   *
   * @param {string} id - Account ID
   * @param {BotUpdate} data - Update data
   * @returns {Observable<Bot>} Updated bot account
   */
  override update(id: string, data: BotUpdate): Observable<Bot> {
    // Prevent type change
    const updateData = { ...data };
    delete (updateData as any).type;

    return super.update(id, updateData);
  }

  /**
   * 軟刪除機器人帳戶（設定狀態為 DELETED）
   * Soft delete bot account (set status to DELETED)
   *
   * @param {string} id - Account ID
   * @returns {Observable<Bot>} Updated bot account
   */
  softDelete(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的機器人帳戶
   * Restore deleted bot account
   *
   * @param {string} id - Account ID
   * @returns {Observable<Bot>} Updated bot account
   */
  restore(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }

  /**
   * 檢查機器人名稱是否已存在
   * Check if bot name exists
   *
   * @param {string} name - Bot name
   * @returns {Observable<boolean>} True if name exists
   */
  checkNameExists(name: string): Observable<boolean> {
    return super
      .count({
        name,
        type: AccountType.BOT,
        status: [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED]
      })
      .pipe(map(count => count > 0));
  }

  /**
   * 啟用機器人
   * Activate bot
   *
   * @param {string} id - Account ID
   * @returns {Observable<Bot>} Updated bot account
   */
  activate(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }

  /**
   * 停用機器人
   * Deactivate bot
   *
   * @param {string} id - Account ID
   * @returns {Observable<Bot>} Updated bot account
   */
  deactivate(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.INACTIVE } as any);
  }

  /**
   * 暫停機器人
   * Suspend bot
   *
   * @param {string} id - Account ID
   * @returns {Observable<Bot>} Updated bot account
   */
  suspend(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.SUSPENDED } as any);
  }
}
