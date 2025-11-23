/**
 * Workspace Data Service
 *
 * 工作區資料載入服務
 * Workspace data loading service
 *
 * Loads and caches organizations and teams accessible to the user.
 *
 * @module shared/services/account
 */

import { Injectable, inject, signal } from '@angular/core';
import { Account, OrganizationModel, TeamModel } from '../../models/account';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceDataService {
  private readonly accountService = inject(AccountService);

  // State
  private currentUserAccountState = signal<Account | null>(null);
  private currentUserAccountIdState = signal<string | null>(null);
  private createdOrganizationsState = signal<OrganizationModel[]>([]);
  private joinedOrganizationsState = signal<OrganizationModel[]>([]);
  private loadingOrganizationsState = signal<boolean>(false);
  private userTeamsState = signal<TeamModel[]>([]);
  private loadingTeamsState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Readonly signals
  readonly currentUserAccount = this.currentUserAccountState.asReadonly();
  readonly currentUserAccountId = this.currentUserAccountIdState.asReadonly();
  readonly createdOrganizations = this.createdOrganizationsState.asReadonly();
  readonly joinedOrganizations = this.joinedOrganizationsState.asReadonly();
  readonly loadingOrganizations = this.loadingOrganizationsState.asReadonly();
  readonly userTeams = this.userTeamsState.asReadonly();
  readonly loadingTeams = this.loadingTeamsState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 載入用戶工作區資料
   * Load user workspace data
   */
  async loadWorkspaceData(authUserId: string): Promise<void> {
    this.loadingOrganizationsState.set(true);
    this.loadingTeamsState.set(true);
    this.errorState.set(null);

    try {
      // 1. Get user account
      const userAccount = await this.accountService.findByAuthUserId(authUserId);
      if (!userAccount) {
        throw new Error('User account not found');
      }

      this.currentUserAccountState.set(userAccount);
      this.currentUserAccountIdState.set(userAccount.id);

      // 2. Load organizations
      let createdOrgs: OrganizationModel[] = [];
      let joinedOrgs: OrganizationModel[] = [];

      try {
        createdOrgs = await this.accountService.getUserCreatedOrganizations(authUserId);
      } catch (error) {
        console.error('[WorkspaceDataService] Failed to load created organizations:', error);
      }

      try {
        joinedOrgs = await this.accountService.getUserJoinedOrganizations(userAccount.id);
      } catch (error) {
        console.error('[WorkspaceDataService] Failed to load joined organizations:', error);
      }

      this.createdOrganizationsState.set(createdOrgs);
      this.joinedOrganizationsState.set(joinedOrgs);
      this.loadingOrganizationsState.set(false);

      // 3. Load teams
      let teams: TeamModel[] = [];

      try {
        teams = await this.accountService.getUserTeams(userAccount.id);
      } catch (error) {
        console.error('[WorkspaceDataService] Failed to load teams:', error);
      }

      this.userTeamsState.set(teams);
      this.loadingTeamsState.set(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workspace data';
      this.errorState.set(errorMessage);
      console.error('[WorkspaceDataService] Failed to load workspace data:', error);

      this.loadingOrganizationsState.set(false);
      this.loadingTeamsState.set(false);
    }
  }

  /**
   * 重置狀態
   * Reset state
   */
  reset(): void {
    this.currentUserAccountState.set(null);
    this.currentUserAccountIdState.set(null);
    this.createdOrganizationsState.set([]);
    this.joinedOrganizationsState.set([]);
    this.userTeamsState.set([]);
    this.errorState.set(null);
  }
}
