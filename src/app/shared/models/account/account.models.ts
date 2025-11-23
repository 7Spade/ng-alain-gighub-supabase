/**
 * Account Business Models
 *
 * 帳戶業務模型定義（業務層）
 * Account business model definitions (Business Layer)
 *
 * Re-exports enumerations from core layer for convenience.
 * Defines business models with camelCase naming convention.
 *
 * @module shared/models/account
 */

import { Database, AccountType, AccountStatus, TeamMemberRole, OrganizationMemberRole, ContextType, ContextState } from '@core';

/**
 * Re-export account-related enumerations from core layer
 * This maintains backward compatibility and allows importing from @shared/models/account
 */
export { AccountType, AccountStatus, TeamMemberRole, OrganizationMemberRole, ContextType };
export type { ContextState };

/**
 * Account entity type (camelCase)
 * Note: BaseRepository automatically converts snake_case → camelCase
 */
export type Account = Database['public']['Tables']['accounts']['Row'];
export type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
export type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

/**
 * Team entity type (camelCase)
 */
export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
export type TeamUpdate = Database['public']['Tables']['teams']['Update'];

/**
 * TeamMember entity type (camelCase)
 */
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
export type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];

/**
 * OrganizationMember entity type (camelCase)
 */
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
export type OrganizationMemberInsert = Database['public']['Tables']['organization_members']['Insert'];
export type OrganizationMemberUpdate = Database['public']['Tables']['organization_members']['Update'];

/**
 * 帳戶模型（業務層）
 * Account model (Business layer)
 *
 * Currently a type alias. In the future, can be extended with computed properties or business logic methods.
 */
export type AccountModel = Account;

/**
 * 組織模型（業務層）
 * Organization model (Business layer)
 *
 * Organizations are accounts with type='Organization'
 */
export interface OrganizationModel extends Account {
  type: AccountType.ORGANIZATION;
  /** 組織成員數 | Member count (optional, populated separately) */
  memberCount?: number;
  /** 團隊數 | Team count (optional, populated separately) */
  teamCount?: number;
}

/**
 * 團隊模型（業務層）
 * Team model (Business layer)
 */
export interface TeamModel extends Team {
  /** 所屬組織名稱 | Organization name (optional, populated via join) */
  organizationName?: string;
  /** 團隊成員數 | Member count (optional, populated separately) */
  memberCount?: number;
}

/**
 * 用戶帳戶模型（業務層）
 * User account model (Business layer)
 *
 * User accounts are accounts with type='User'
 */
export interface UserAccountModel extends Account {
  type: AccountType.USER;
}

/**
 * 機器人帳戶模型（業務層）
 * Bot account model (Business layer)
 *
 * Bot accounts are accounts with type='Bot'
 */
export interface BotAccountModel extends Account {
  type: AccountType.BOT;
  /** API Token（敏感資訊，通常不包含在一般查詢中） | API Token (sensitive, usually not included) */
  apiToken?: string;
}

/**
 * 團隊成員詳細資訊
 * Team member detail
 *
 * Combines TeamMember with Account information
 */
export interface TeamMemberDetail extends TeamMember {
  /** 成員帳戶資訊 | Member account info */
  account?: Account;
}

/**
 * 組織成員詳細資訊
 * Organization member detail
 *
 * Combines OrganizationMember with Account information
 */
export interface OrganizationMemberDetail extends OrganizationMember {
  /** 成員帳戶資訊 | Member account info */
  account?: Account;
}

/**
 * 工作區資料
 * Workspace data
 *
 * Contains all data needed for workspace context switching
 */
export interface WorkspaceData {
  /** 當前用戶帳戶 | Current user account */
  currentUserAccount: Account | null;
  /** 用戶創建的組織 | Organizations created by user */
  createdOrganizations: OrganizationModel[];
  /** 用戶加入的組織 | Organizations user has joined */
  joinedOrganizations: OrganizationModel[];
  /** 用戶所屬團隊 | Teams user belongs to */
  userTeams: TeamModel[];
  /** 按組織分組的團隊 | Teams grouped by organization */
  teamsByOrganization: Map<string, TeamModel[]>;
}

/**
 * 創建帳戶請求
 * Create account request
 */
export interface CreateAccountRequest {
  type: AccountType;
  name: string;
  email?: string;
  avatar?: string;
  status?: AccountStatus;
}

/**
 * 更新帳戶請求
 * Update account request
 */
export interface UpdateAccountRequest {
  name?: string;
  email?: string;
  avatar?: string;
  status?: AccountStatus;
}

/**
 * 創建團隊請求
 * Create team request
 */
export interface CreateTeamRequest {
  organizationId: string;
  name: string;
  description?: string;
  avatar?: string;
}

/**
 * 更新團隊請求
 * Update team request
 */
export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  avatar?: string;
}

/**
 * 添加團隊成員請求
 * Add team member request
 */
export interface AddTeamMemberRequest {
  teamId: string;
  accountId: string;
  role: TeamMemberRole;
}

/**
 * 添加組織成員請求
 * Add organization member request
 */
export interface AddOrganizationMemberRequest {
  organizationId: string;
  accountId: string;
  role: OrganizationMemberRole;
}

/**
 * 上下文切換結果
 * Context switch result
 */
export interface ContextSwitchResult {
  success: boolean;
  previousContext: ContextState;
  newContext: ContextState;
  error?: string;
}
