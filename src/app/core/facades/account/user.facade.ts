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
import { UserService, UserAccountModel, CreateUserAccountRequest, UpdateUserAccountRequest } from '@shared';

import { BaseAccountCrudFacade } from './base-account-crud.facade';

@Injectable({
  providedIn: 'root'
})
export class UserFacade extends BaseAccountCrudFacade<UserAccountModel, CreateUserAccountRequest, UpdateUserAccountRequest> {
  private readonly userService = inject(UserService);

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
   * @throws {Error} User-friendly error message
   */
  async createUser(request: CreateUserAccountRequest): Promise<UserAccountModel> {
    return this.executeCreate(request, req => this.userService.createUser(req), '用戶');
  }

  /**
   * 更新用戶帳戶
   * Update user account
   *
   * @param {string} id - Account ID
   * @param {UpdateUserAccountRequest} request - Update request
   * @returns {Promise<UserAccountModel>} Updated user account
   * @throws {Error} User-friendly error message
   */
  async updateUser(id: string, request: UpdateUserAccountRequest): Promise<UserAccountModel> {
    return this.executeUpdate(id, request, (id, req) => this.userService.updateUser(id, req), '用戶');
  }

  /**
   * 刪除用戶帳戶（軟刪除）
   * Delete user account (soft delete)
   *
   * @param {string} id - Account ID
   * @returns {Promise<UserAccountModel>} Deleted user account
   * @throws {Error} User-friendly error message
   */
  async deleteUser(id: string): Promise<UserAccountModel> {
    return this.executeDelete(id, id => this.userService.softDeleteUser(id), '用戶');
  }

  /**
   * 恢復已刪除的用戶帳戶
   * Restore deleted user account
   *
   * @param {string} id - Account ID
   * @returns {Promise<UserAccountModel>} Restored user account
   * @throws {Error} User-friendly error message
   */
  async restoreUser(id: string): Promise<UserAccountModel> {
    try {
      const user = await this.userService.restoreUser(id);
      await this.reloadWorkspaceData();
      return user;
    } catch (error) {
      const errorMessage = this.errorHandler.getErrorMessage(error, 'restore', '用戶');
      this.errorHandler.logError(this.constructor.name, 'restore user', error);
      throw new Error(errorMessage);
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
