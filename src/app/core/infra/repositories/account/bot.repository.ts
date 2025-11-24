/**
 * Bot Repository
 *
 * 機器人資料存取層
 * Bot data access layer
 *
 * Provides CRUD operations for bots.
 * Bots are stored in accounts table with type='Bot'.
 * This repository enforces type filtering at the query level.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Bot, BotInsert, BotUpdate, AccountType, AccountStatus, BotQueryOptions } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * Bot Repository
 *
 * Extends BaseRepository with Bot-specific query methods.
 * Automatically enforces type='Bot' filter on all queries.
 */
@Injectable({
  providedIn: 'root'
})
export class BotRepository extends BaseRepository<Bot, BotInsert, BotUpdate> {
  protected tableName = 'accounts';

  /**
   * Override findAll to enforce type='Bot' filter
   * 查詢所有機器人記錄（強制過濾 type='Bot'）
   *
   * @param {any} [options] - Query options
   * @returns {Observable<Bot[]>} Array of bot accounts
   */
  override findAll(options?: any): Observable<Bot[]> {
    const filters = {
      ...options?.filters,
      type: AccountType.BOT
    };

    return super.findAll({
      ...options,
      filters
    });
  }

  /**
   * Override findById to enforce type='Bot' filter
   * 根據 ID 查詢機器人（強制過濾 type='Bot'）
   *
   * @param {string} id - Bot ID
   * @param {string} [select] - Select clause
   * @returns {Observable<Bot | null>} Bot account or null
   */
  override findById(id: string, select?: string): Observable<Bot | null> {
    return this.findOne({ id }, select);
  }

  /**
   * Override findOne to enforce type='Bot' filter
   * 根據條件查詢單一機器人（強制過濾 type='Bot'）
   *
   * @param {Record<string, any>} filters - Filter conditions
   * @param {string} [select] - Select clause
   * @returns {Observable<Bot | null>} Bot account or null
   */
  override findOne(filters: Record<string, any>, select?: string): Observable<Bot | null> {
    const botFilters = {
      ...filters,
      type: AccountType.BOT
    };

    return super.findOne(botFilters, select);
  }

  /**
   * Override create to enforce type='Bot'
   * 創建機器人（強制設定 type='Bot'）
   *
   * @param {BotInsert} data - Bot data to insert
   * @returns {Observable<Bot>} Created bot account
   */
  override create(data: BotInsert): Observable<Bot> {
    const botData = {
      ...data,
      type: AccountType.BOT
    } as any;

    return super.create(botData);
  }

  /**
   * Override count to enforce type='Bot' filter
   * 計數機器人數量（強制過濾 type='Bot'）
   *
   * @param {Record<string, any>} [filters] - Filter conditions
   * @returns {Observable<number>} Bot count
   */
  override count(filters?: Record<string, any>): Observable<number> {
    const botFilters = {
      ...filters,
      type: AccountType.BOT
    };

    return super.count(botFilters);
  }

  /**
   * 根據名稱查詢機器人
   * Find bot by name
   *
   * @param {string} name - Bot name
   * @returns {Observable<Bot | null>} Bot account or null
   */
  findByName(name: string): Observable<Bot | null> {
    return this.findOne({ name });
  }

  /**
   * 根據創建者查詢機器人
   * Find bots created by user
   *
   * @param {string} createdBy - Creator's auth_user_id
   * @returns {Observable<Bot[]>} Bots created by user
   */
  findByCreator(createdBy: string): Observable<Bot[]> {
    return this.findAll({
      filters: { createdBy }
    });
  }

  /**
   * 根據狀態查詢機器人
   * Find bots by status
   *
   * @param {AccountStatus} status - Account status
   * @returns {Observable<Bot[]>} Bots with specified status
   */
  findByStatus(status: AccountStatus): Observable<Bot[]> {
    return this.findAll({
      filters: { status }
    });
  }

  /**
   * 進階查詢（使用 BotQueryOptions）
   * Advanced query with BotQueryOptions
   *
   * @param {BotQueryOptions} options - Query options
   * @returns {Observable<Bot[]>} Filtered bots
   */
  findWithOptions(options: BotQueryOptions): Observable<Bot[]> {
    const filters: Record<string, any> = {};

    if (options.status) {
      filters['status'] = options.status;
    } else if (!options.includeDeleted) {
      // 預設不包含已刪除的機器人
      // By default, exclude deleted bots
      filters['status'] = [AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED];
    }

    if (options.createdBy) {
      filters['createdBy'] = options.createdBy;
    }

    return this.findAll({ filters });
  }

  /**
   * 軟刪除機器人（設定狀態為 DELETED）
   * Soft delete bot (set status to DELETED)
   *
   * @param {string} id - Bot ID
   * @returns {Observable<Bot>} Updated bot account
   */
  softDelete(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的機器人
   * Restore deleted bot
   *
   * @param {string} id - Bot ID
   * @returns {Observable<Bot>} Updated bot account
   */
  restore(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }
}
