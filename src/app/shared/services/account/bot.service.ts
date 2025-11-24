/**
 * Bot Service
 *
 * 機器人管理服務（Shared 層）
 * Bot management service (Shared layer)
 *
 * Provides business logic for bot account operations using Signals-based state management.
 *
 * @module shared/services/account
 */

import { Injectable, inject, signal } from '@angular/core';
import { BotRepository, AccountStatus } from '@core';
import { firstValueFrom } from 'rxjs';

import { BotAccountModel, CreateBotRequest, UpdateBotRequest } from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  private readonly botRepo = inject(BotRepository);

  // State
  private botAccountsState = signal<BotAccountModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Readonly signals
  readonly botAccounts = this.botAccountsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 根據 ID 查詢機器人帳戶
   * Find bot account by ID
   *
   * @param {string} id - Account ID
   * @returns {Promise<BotAccountModel | null>} Bot account or null
   */
  async findById(id: string): Promise<BotAccountModel | null> {
    // BotRepository 已經強制過濾 type='Bot'，不需要運行時檢查
    const bot = await firstValueFrom(this.botRepo.findById(id));
    return bot as BotAccountModel | null;
  }

  /**
   * 根據名稱查詢機器人帳戶
   * Find bot account by name
   *
   * @param {string} name - Bot name
   * @returns {Promise<BotAccountModel | null>} Bot account or null
   */
  async findByName(name: string): Promise<BotAccountModel | null> {
    // BotRepository 已經強制過濾 type='Bot'，不需要運行時檢查
    const bot = await firstValueFrom(this.botRepo.findByName(name));
    return bot as BotAccountModel | null;
  }

  /**
   * 創建機器人帳戶
   * Create bot account
   *
   * @param {CreateBotRequest} request - Create request
   * @returns {Promise<BotAccountModel>} Created bot account
   */
  async createBot(request: CreateBotRequest): Promise<BotAccountModel> {
    const insertData = {
      name: request.name,
      email: request.email || null,
      avatar: request.avatar || null,
      status: request.status || AccountStatus.ACTIVE
    };

    const account = await firstValueFrom(this.botRepo.create(insertData as any));
    return account as BotAccountModel;
  }

  /**
   * 更新機器人帳戶
   * Update bot account
   *
   * @param {string} id - Account ID
   * @param {UpdateBotRequest} request - Update request
   * @returns {Promise<BotAccountModel>} Updated bot account
   */
  async updateBot(id: string, request: UpdateBotRequest): Promise<BotAccountModel> {
    const account = await firstValueFrom(this.botRepo.update(id, request as any));
    return account as BotAccountModel;
  }

  /**
   * 軟刪除機器人帳戶
   * Soft delete bot account
   *
   * @param {string} id - Account ID
   * @returns {Promise<BotAccountModel>} Updated bot account
   */
  async softDeleteBot(id: string): Promise<BotAccountModel> {
    const account = await firstValueFrom(this.botRepo.softDelete(id));
    return account as BotAccountModel;
  }

  /**
   * 恢復已刪除的機器人帳戶
   * Restore deleted bot account
   *
   * @param {string} id - Account ID
   * @returns {Promise<BotAccountModel>} Updated bot account
   */
  async restoreBot(id: string): Promise<BotAccountModel> {
    const account = await firstValueFrom(this.botRepo.restore(id));
    return account as BotAccountModel;
  }

  /**
   * 載入機器人帳戶列表
   * Load bot accounts
   *
   * @param {string} createdBy - Creator's auth_user_id
   */
  async loadBotAccounts(createdBy: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const accounts = await firstValueFrom(this.botRepo.findByCreator(createdBy));

      this.botAccountsState.set(accounts as BotAccountModel[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load bot accounts';
      this.errorState.set(errorMessage);
      console.error('[BotService] Failed to load bot accounts:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 查詢用戶創建的所有機器人
   * Find all bots created by user
   *
   * @param {string} createdBy - Creator's auth_user_id
   * @returns {Promise<BotAccountModel[]>} Bot accounts created by user
   */
  async getUserCreatedBots(createdBy: string): Promise<BotAccountModel[]> {
    const bots = await firstValueFrom(this.botRepo.findByCreator(createdBy));
    return bots as BotAccountModel[];
  }
}
