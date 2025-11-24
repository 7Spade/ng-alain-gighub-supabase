/**
 * Bot Facade
 *
 * 機器人業務域門面（Core 層）
 * Bot business domain facade (Core layer)
 *
 * Provides unified interface for bot account operations.
 * Coordinates between BotService and WorkspaceDataService.
 *
 * @module core/facades/account
 */

import { Injectable, inject } from '@angular/core';
import { BotService, BotAccountModel, CreateBotRequest, UpdateBotRequest } from '@shared';

import { BaseAccountCrudFacade } from './base-account-crud.facade';

@Injectable({
  providedIn: 'root'
})
export class BotFacade extends BaseAccountCrudFacade<BotAccountModel, CreateBotRequest, UpdateBotRequest> {
  private readonly botService = inject(BotService);

  // Proxy bot service signals
  readonly botAccounts = this.botService.botAccounts;
  readonly loading = this.botService.loading;
  readonly error = this.botService.error;

  /**
   * 創建機器人帳戶
   * Create bot account
   *
   * @param {CreateBotRequest} request - Create request
   * @returns {Promise<BotAccountModel>} Created bot account
   * @throws {Error} User-friendly error message
   */
  async createBot(request: CreateBotRequest): Promise<BotAccountModel> {
    return this.executeCreate(request, req => this.botService.createBot(req), '機器人');
  }

  /**
   * 更新機器人帳戶
   * Update bot account
   *
   * @param {string} id - Account ID
   * @param {UpdateBotRequest} request - Update request
   * @returns {Promise<BotAccountModel>} Updated bot account
   * @throws {Error} User-friendly error message
   */
  async updateBot(id: string, request: UpdateBotRequest): Promise<BotAccountModel> {
    return this.executeUpdate(id, request, (id, req) => this.botService.updateBot(id, req), '機器人');
  }

  /**
   * 刪除機器人帳戶（軟刪除）
   * Delete bot account (soft delete)
   *
   * @param {string} id - Account ID
   * @returns {Promise<BotAccountModel>} Deleted bot account
   * @throws {Error} User-friendly error message
   */
  async deleteBot(id: string): Promise<BotAccountModel> {
    return this.executeDelete(id, id => this.botService.softDeleteBot(id), '機器人');
  }

  /**
   * 恢復已刪除的機器人帳戶
   * Restore deleted bot account
   *
   * @param {string} id - Account ID
   * @returns {Promise<BotAccountModel>} Restored bot account
   * @throws {Error} User-friendly error message
   */
  async restoreBot(id: string): Promise<BotAccountModel> {
    try {
      const bot = await this.botService.restoreBot(id);
      await this.reloadWorkspaceData();
      return bot;
    } catch (error) {
      const errorMessage = this.errorHandler.getErrorMessage(error, 'restore', '機器人');
      this.errorHandler.logError(this.constructor.name, 'restore bot', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 根據 ID 查詢機器人帳戶
   * Find bot account by ID
   *
   * @param {string} id - Account ID
   * @returns {Promise<BotAccountModel | null>} Bot account or null
   */
  async findById(id: string): Promise<BotAccountModel | null> {
    return this.botService.findById(id);
  }

  /**
   * 根據名稱查詢機器人帳戶
   * Find bot account by name
   *
   * @param {string} name - Bot name
   * @returns {Promise<BotAccountModel | null>} Bot account or null
   */
  async findByName(name: string): Promise<BotAccountModel | null> {
    return this.botService.findByName(name);
  }

  /**
   * 載入機器人帳戶列表
   * Load bot accounts
   *
   * @param {string} createdBy - Creator's auth_user_id
   */
  async loadBotAccounts(createdBy: string): Promise<void> {
    return this.botService.loadBotAccounts(createdBy);
  }

  /**
   * 查詢用戶創建的所有機器人
   * Find all bots created by user
   *
   * @param {string} createdBy - Creator's auth_user_id
   * @returns {Promise<BotAccountModel[]>} Bot accounts created by user
   */
  async getUserCreatedBots(createdBy: string): Promise<BotAccountModel[]> {
    return this.botService.getUserCreatedBots(createdBy);
  }
}
