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
import { AccountRepository, TeamRepository, TeamMemberRepository, AccountType, AccountStatus } from '@core';
import { firstValueFrom } from 'rxjs';

import { Account, OrganizationModel, TeamModel, CreateAccountRequest, UpdateAccountRequest } from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly accountRepo = inject(AccountRepository);
  private readonly teamRepo = inject(TeamRepository);
  private readonly teamMemberRepo = inject(TeamMemberRepository);

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

  async getUserCreatedOrganizations(authUserId: string): Promise<OrganizationModel[]> {
    const orgs = await firstValueFrom(this.accountRepo.findCreatedOrganizations(authUserId));
    return orgs as OrganizationModel[];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserJoinedOrganizations(accountId: string): Promise<OrganizationModel[]> {
    // TODO: Implement when organization_members repository is ready
    return [];
  }

  async getUserTeams(accountId: string): Promise<TeamModel[]> {
    const memberships = await firstValueFrom(this.teamMemberRepo.findByAccount(accountId));
    const teamIds = memberships.map(m => (m as any).teamId);

    if (teamIds.length === 0) {
      return [];
    }

    const teamsPromises = teamIds.map(teamId => firstValueFrom(this.teamRepo.findById(teamId)));
    const teams = await Promise.all(teamsPromises);

    return teams.filter(t => t !== null) as TeamModel[];
  }

  async createAccount(request: CreateAccountRequest): Promise<Account> {
    const insertData = {
      type: request.type,
      name: request.name,
      email: request.email || null,
      avatar: request.avatar || null,
      status: request.status || AccountStatus.ACTIVE
    };

    return firstValueFrom(this.accountRepo.create(insertData as any));
  }

  async updateAccount(id: string, request: UpdateAccountRequest): Promise<Account> {
    return firstValueFrom(this.accountRepo.update(id, request as any));
  }

  async softDeleteAccount(id: string): Promise<Account> {
    return firstValueFrom(this.accountRepo.softDelete(id));
  }

  async restoreAccount(id: string): Promise<Account> {
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
