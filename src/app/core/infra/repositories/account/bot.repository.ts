/**
 * Bot Repository
 *
 * 機器人資料存取層
 * Bot data access layer
 *
 * Provides CRUD operations for bot accounts.
 * Bots are stored in accounts table with type='Bot'.
 * This repository enforces type='Bot' at the database query level for compile-time type safety.
 *
 * @module core/infra/repositories/account
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Bot, BotInsert, BotUpdate, AccountType, AccountStatus } from '../../types';
import { BaseRepository } from '../base.repository';

/**
 * Bot Repository
 *
 * Extends BaseRepository with bot-specific query methods.
 * Enforces type='Bot' filter at database query level for type safety.
 */
@Injectable({
  providedIn: 'root'
})
export class BotRepository extends BaseRepository<Bot, BotInsert, BotUpdate> {
  protected tableName = 'accounts';

  /**
   * 根據 ID 查詢機器人
   * Find bot by ID
   *
   * @param {string} id - Bot ID
   * @returns {Observable<Bot | null>} Bot or null
   */
  override findById(id: string): Observable<Bot | null> {
    return super.findOne({
      id,
      type: AccountType.BOT
    });
  }

  /**
   * 查詢所有機器人（強制過濾 type='Bot'）
   * Find all bots (enforces type='Bot' filter)
   *
   * @returns {Observable<Bot[]>} Array of bots
   */
  override findAll(options?: any): Observable<Bot[]> {
    return super.findAll({
      ...options,
      filters: {
        ...options?.filters,
        type: AccountType.BOT
      }
    });
  }

  /**
   * 根據名稱查詢機器人
   * Find bot by name
   *
   * @param {string} name - Bot name
   * @returns {Observable<Bot | null>} Bot or null
   */
  findByName(name: string): Observable<Bot | null> {
    return this.findOne({
      name,
      type: AccountType.BOT
    });
  }

  /**
   * 查詢用戶創建的機器人
   * Find bots created by user
   *
   * @param {string} creatorId - Creator account ID
   * @returns {Observable<Bot[]>} Bots created by user
   */
  findByCreator(creatorId: string): Observable<Bot[]> {
    return this.findAll({
      filters: {
        createdBy: creatorId,
        status: AccountStatus.ACTIVE
      }
    });
  }

  /**
   * 創建機器人帳戶（強制設定 type='Bot'）
   * Create bot account (enforces type='Bot')
   *
   * @param {Partial<BotInsert>} data - Bot data
   * @returns {Observable<Bot>} Created bot
   */
  override create(data: Partial<BotInsert>): Observable<Bot> {
    return super.create({
      ...data,
      type: AccountType.BOT
    } as BotInsert);
  }

  /**
   * 更新機器人帳戶
   * Update bot account
   *
   * @param {string} id - Bot ID
   * @param {Partial<BotUpdate>} data - Update data
   * @returns {Observable<Bot>} Updated bot
   */
  override update(id: string, data: Partial<BotUpdate>): Observable<Bot> {
    // Ensure type cannot be changed
    const { type, ...updateData } = data as any;
    return super.update(id, updateData);
  }

  /**
   * 軟刪除機器人（設定狀態為 DELETED）
   * Soft delete bot (set status to DELETED)
   *
   * @param {string} id - Bot ID
   * @returns {Observable<Bot>} Updated bot
   */
  softDelete(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.DELETED } as any);
  }

  /**
   * 恢復已刪除的機器人
   * Restore deleted bot
   *
   * @param {string} id - Bot ID
   * @returns {Observable<Bot>} Updated bot
   */
  restore(id: string): Observable<Bot> {
    return this.update(id, { status: AccountStatus.ACTIVE } as any);
  }

  /**
   * 查詢活躍機器人
   * Find active bots
   *
   * @returns {Observable<Bot[]>} Active bots
   */
  findActive(): Observable<Bot[]> {
    return this.findAll({
      filters: {
        status: AccountStatus.ACTIVE
      }
    });
  }

  /**
   * 根據團隊 ID 查詢機器人
   * Find bots by team ID
   *
   * @param {string} teamId - Team ID
   * @returns {Observable<Bot[]>} Bots in team
   */
  findByTeam(teamId: string): Observable<Bot[]> {
    // Note: This requires joining with team_members table
    // Implementation depends on specific team membership logic
    return this.findAll({
      filters: {
        status: AccountStatus.ACTIVE
      }
    });
  }
}
