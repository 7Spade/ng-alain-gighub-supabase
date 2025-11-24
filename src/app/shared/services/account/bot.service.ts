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
  private botsState = signal<BotAccountModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Readonly signals
  readonly bots = this.botsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 根據 ID 查詢機器人
   * Find bot by ID
   *
   * @param {string} id - Bot ID
   * @returns {Promise<BotAccountModel | null>} Bot or null
   */
  async findById(id: string): Promise<BotAccountModel | null> {
    const bot = await firstValueFrom(this.botRepo.findById(id));
    return bot as BotAccountModel | null;
  }

  /**
   * 根據名稱查詢機器人
   * Find bot by name
   *
   * @param {string} name - Bot name
   * @returns {Promise<BotAccountModel | null>} Bot or null
   */
  async findByName(name: string): Promise<BotAccountModel | null> {
    const bot = await firstValueFrom(this.botRepo.findByName(name));
    return bot as BotAccountModel | null;
  }

  /**
   * 查詢用戶創建的機器人
   * Find bots created by user
   *
   * @param {string} creatorId - Creator account ID
   * @returns {Promise<BotAccountModel[]>} Bots created by user
   */
  async getUserCreatedBots(creatorId: string): Promise<BotAccountModel[]> {
    const bots = await firstValueFrom(this.botRepo.findByCreator(creatorId));
    return bots as BotAccountModel[];
  }

  /**
   * 創建機器人
   * Create bot
   *
   * @param {CreateBotRequest} request - Create request
   * @returns {Promise<BotAccountModel>} Created bot
   */
  async createBot(request: CreateBotRequest): Promise<BotAccountModel> {
    const insertData = {
      name: request.name,
      email: request.email || null,
      avatar: request.avatar || null,
      status: request.status || AccountStatus.ACTIVE
    };

    const bot = await firstValueFrom(this.botRepo.create(insertData as any));
    return bot as BotAccountModel;
  }

  /**
   * 更新機器人
   * Update bot
   *
   * @param {string} id - Bot ID
   * @param {UpdateBotRequest} request - Update request
   * @returns {Promise<BotAccountModel>} Updated bot
   */
  async updateBot(id: string, request: UpdateBotRequest): Promise<BotAccountModel> {
    const bot = await firstValueFrom(this.botRepo.update(id, request as any));
    return bot as BotAccountModel;
  }

  /**
   * 軟刪除機器人
   * Soft delete bot
   *
   * @param {string} id - Bot ID
   * @returns {Promise<BotAccountModel>} Updated bot
   */
  async softDeleteBot(id: string): Promise<BotAccountModel> {
    const bot = await firstValueFrom(this.botRepo.softDelete(id));
    return bot as BotAccountModel;
  }

  /**
   * 恢復已刪除的機器人
   * Restore deleted bot
   *
   * @param {string} id - Bot ID
   * @returns {Promise<BotAccountModel>} Updated bot
   */
  async restoreBot(id: string): Promise<BotAccountModel> {
    const bot = await firstValueFrom(this.botRepo.restore(id));
    return bot as BotAccountModel;
  }

  /**
   * 載入機器人列表
   * Load bots
   *
   * @param {string} creatorId - Creator account ID (optional)
   */
  async loadBots(creatorId?: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const bots = creatorId
        ? await firstValueFrom(this.botRepo.findByCreator(creatorId))
        : await firstValueFrom(this.botRepo.findActive());

      this.botsState.set(bots as BotAccountModel[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load bots';
      this.errorState.set(errorMessage);
      console.error('[BotService] Failed to load bots:', error);
    } finally {
      this.loadingState.set(false);
    }
  }
}
