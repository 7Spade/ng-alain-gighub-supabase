/**
 * User Facade
 *
 * 用戶業務域門面（Core 層）
 * User business domain facade (Core layer)
 *
 * Provides unified interface for user account operations.
 * Coordinates between UserService and WorkspaceDataService.
 *
 * @module core/facades/account
 */

import { Injectable, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { UserService, WorkspaceDataService } from '@shared';
import { UserAccountModel, CreateUserAccountRequest, UpdateUserAccountRequest } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class UserFacade {
  private readonly userService = inject(UserService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // Proxy user service signals
  readonly userAccounts = this.userService.userAccounts;
  readonly loading = this.userService.loading;
  readonly error = this.userService.error;

  /**
   * 創建用戶帳戶
   * Create user account
   *
   * @param {CreateUserAccountRequest} request - Create request
   * @returns {Promise<UserAccountModel>} Created user account
   */
  async createUser(request: CreateUserAccountRequest): Promise<UserAccountModel> {
    try {
      const user = await this.userService.createUser(request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return user;
    } catch (error) {
      console.error('[UserFacade] Failed to create user:', error);
      throw error;
    }
  }

  /**
   * 更新用戶帳戶
   * Update user account
   *
   * @param {string} id - Account ID
   * @param {UpdateUserAccountRequest} request - Update request
   * @returns {Promise<UserAccountModel>} Updated user account
   */
  async updateUser(id: string, request: UpdateUserAccountRequest): Promise<UserAccountModel> {
    try {
      const user = await this.userService.updateUser(id, request);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return user;
    } catch (error) {
      console.error('[UserFacade] Failed to update user:', error);
      throw error;
    }
  }

  /**
   * 刪除用戶帳戶（軟刪除）
   * Delete user account (soft delete)
   *
   * @param {string} id - Account ID
   * @returns {Promise<UserAccountModel>} Deleted user account
   */
  async deleteUser(id: string): Promise<UserAccountModel> {
    try {
      const user = await this.userService.softDeleteUser(id);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return user;
    } catch (error) {
      console.error('[UserFacade] Failed to delete user:', error);
      throw error;
    }
  }

  /**
   * 恢復已刪除的用戶帳戶
   * Restore deleted user account
   *
   * @param {string} id - Account ID
   * @returns {Promise<UserAccountModel>} Restored user account
   */
  async restoreUser(id: string): Promise<UserAccountModel> {
    try {
      const user = await this.userService.restoreUser(id);

      // 重新載入工作區數據
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        await this.dataService.loadWorkspaceData(token['user']['id']);
      }

      return user;
    } catch (error) {
      console.error('[UserFacade] Failed to restore user:', error);
      throw error;
    }
  }

  /**
   * 根據 Auth User ID 查詢用戶帳戶
   * Find user account by auth user ID
   *
   * @param {string} authUserId - Auth user ID
   * @returns {Promise<UserAccountModel | null>} User account or null
   */
  async findByAuthUserId(authUserId: string): Promise<UserAccountModel | null> {
    return this.userService.findByAuthUserId(authUserId);
  }

  /**
   * 根據 ID 查詢用戶帳戶
   * Find user account by ID
   *
   * @param {string} id - Account ID
   * @returns {Promise<UserAccountModel | null>} User account or null
   */
  async findById(id: string): Promise<UserAccountModel | null> {
    return this.userService.findById(id);
  }

  /**
   * 載入用戶帳戶列表
   * Load user accounts
   *
   * @param {string} authUserId - Auth user ID
   */
  async loadUserAccounts(authUserId: string): Promise<void> {
    return this.userService.loadUserAccounts(authUserId);
  }
}
