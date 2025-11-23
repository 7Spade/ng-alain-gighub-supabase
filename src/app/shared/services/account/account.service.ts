/**
 * Account Service
 *
 * 帳戶管理服務（Shared 層）
 * Account management service (Shared layer)
 *
 * Provides business logic for account operations using Signals-based state management.
 *
 * @module shared/services/account
 */

import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AccountRepository, TeamMemberRepository, AccountType, AccountStatus } from '@core';
import { Account } from '../../models/account';
import { TeamBusinessModel } from '../../models/account';
import { TeamService } from './team.service';
import { CreateUserAccountRequest, UpdateUserAccountRequest } from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly accountRepo = inject(AccountRepository);
  private readonly teamMemberRepo = inject(TeamMemberRepository);
  private readonly teamService = inject(TeamService);

  // State
  private userAccountsState = signal<Account[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Readonly signals
  readonly userAccounts = this.userAccountsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  async findByAuthUserId(authUserId: string): Promise<Account | null> {
    return firstValueFrom(this.accountRepo.findByAuthUserId(authUserId));
  }

  async findById(id: string): Promise<Account | null> {
    return firstValueFrom(this.accountRepo.findById(id));
  }

  async getUserTeams(accountId: string): Promise<TeamBusinessModel[]> {
    const memberships = await firstValueFrom(this.teamMemberRepo.findByAccount(accountId));
    const teamIds = memberships.map(m => (m as any).teamId);

    if (teamIds.length === 0) {
      return [];
    }

    // 使用 TeamService 查詢團隊
    const teamsPromises = teamIds.map(teamId => this.teamService.findById(teamId));
    const teams = await Promise.all(teamsPromises);

    return teams.filter(t => t !== null) as TeamBusinessModel[];
  }

  /**
   * 創建用戶帳戶
   * Create user account
   *
   * @param {CreateUserRequest} request - Create request
   * @returns {Promise<Account>} Created account
   */
  async createUserAccount(request: CreateUserAccountRequest): Promise<Account> {
    const insertData = {
      type: AccountType.USER,
      name: request.name,
      email: request.email || null,
      avatar: request.avatar || null,
      status: request.status || AccountStatus.ACTIVE
    };

    return firstValueFrom(this.accountRepo.create(insertData as any));
  }

  /**
   * 更新用戶帳戶
   * Update user account
   *
   * @param {string} id - Account ID
   * @param {UpdateUserRequest} request - Update request
   * @returns {Promise<Account>} Updated account
   */
  async updateUserAccount(id: string, request: UpdateUserAccountRequest): Promise<Account> {
    return firstValueFrom(this.accountRepo.update(id, request as any));
  }

  /**
   * 軟刪除用戶帳戶
   * Soft delete user account
   *
   * @param {string} id - Account ID
   * @returns {Promise<Account>} Updated account
   */
  async softDeleteUserAccount(id: string): Promise<Account> {
    return firstValueFrom(this.accountRepo.softDelete(id));
  }

  /**
   * 恢復已刪除的用戶帳戶
   * Restore deleted user account
   *
   * @param {string} id - Account ID
   * @returns {Promise<Account>} Updated account
   */
  async restoreUserAccount(id: string): Promise<Account> {
    return firstValueFrom(this.accountRepo.restore(id));
  }

  async loadUserAccounts(authUserId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const accounts = await firstValueFrom(
        this.accountRepo.findAll({
          filters: { authUserId: authUserId as any, type: AccountType.USER as any }
        })
      );

      this.userAccountsState.set(accounts);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user accounts';
      this.errorState.set(errorMessage);
      console.error('[AccountService] Failed to load user accounts:', error);
    } finally {
      this.loadingState.set(false);
    }
  }
}
