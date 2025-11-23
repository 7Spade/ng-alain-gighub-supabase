/**
 * Account Type Definitions
 *
 * 帳戶相關類型定義（基礎設施層）
 * Account-related type definitions (Infrastructure Layer)
 *
 * These types are used by the Repository layer and follow the 5-layer architecture.
 * Defines enumerations and interfaces for accounts, organizations, teams, and bots.
 *
 * @module core/infra/types/account
 */

/**
 * 帳戶類型枚舉
 * Account type enumeration
 *
 * Corresponds to database accounts.type field
 */
export enum AccountType {
  /** 用戶帳戶 | User account */
  USER = 'User',
  /** 機器人帳戶 | Bot account */
  BOT = 'Bot',
  /** 組織帳戶 | Organization account */
  ORGANIZATION = 'Organization'
}

/**
 * 帳戶狀態枚舉
 * Account status enumeration
 *
 * Corresponds to database accounts.status field
 */
export enum AccountStatus {
  /** 活躍 | Active */
  ACTIVE = 'active',
  /** 非活躍 | Inactive */
  INACTIVE = 'inactive',
  /** 已暫停 | Suspended */
  SUSPENDED = 'suspended',
  /** 已刪除 | Deleted */
  DELETED = 'deleted'
}

/**
 * 團隊成員角色枚舉
 * Team member role enumeration
 *
 * Corresponds to database team_members.role field
 */
export enum TeamMemberRole {
  /** 團隊負責人 | Team leader */
  LEADER = 'leader',
  /** 團隊成員 | Team member */
  MEMBER = 'member'
}

/**
 * 組織成員角色枚舉
 * Organization member role enumeration
 *
 * Corresponds to database organization_members.role field
 */
export enum OrganizationMemberRole {
  /** 組織擁有者 | Organization owner */
  OWNER = 'owner',
  /** 組織管理員 | Organization admin */
  ADMIN = 'admin',
  /** 組織成員 | Organization member */
  MEMBER = 'member'
}

/**
 * 上下文類型枚舉
 * Context type enumeration
 *
 * Defines the different workspace context types available in the application
 */
export enum ContextType {
  /** 應用菜單（未登入） | Application menu (not logged in) */
  APP = 'app',
  /** 個人帳戶上下文 | User account context */
  USER = 'user',
  /** 組織上下文 | Organization context */
  ORGANIZATION = 'organization',
  /** 團隊上下文 | Team context */
  TEAM = 'team',
  /** 機器人上下文 | Bot context */
  BOT = 'bot'
}

/**
 * 上下文狀態介面
 * Context state interface
 *
 * Represents the current workspace context
 */
export interface ContextState {
  /** 上下文類型 | Context type */
  type: ContextType;
  /** 上下文 ID（app 類型時為 null） | Context ID (null for app type) */
  id: string | null;
  /** 上下文標籤（顯示名稱） | Context label (display name) */
  label: string;
  /** 上下文圖標 | Context icon */
  icon: string;
  /** 上下文頭像 URL（可選） | Context avatar URL (optional) */
  avatar?: string | null;
  /** 上下文電子郵件（可選） | Context email (optional) */
  email?: string | null;
}

/**
 * 帳戶查詢選項
 * Account query options
 */
export interface AccountQueryOptions {
  /** 按類型過濾 | Filter by type */
  type?: AccountType;
  /** 按狀態過濾 | Filter by status */
  status?: AccountStatus;
  /** 按創建者過濾（auth_user_id） | Filter by creator (auth_user_id) */
  createdBy?: string;
  /** 是否包含已刪除的帳戶 | Include deleted accounts */
  includeDeleted?: boolean;
}

/**
 * 團隊查詢選項
 * Team query options
 */
export interface TeamQueryOptions {
  /** 按組織 ID 過濾 | Filter by organization ID */
  organizationId?: string;
  /** 按成員 ID 過濾（查詢用戶所屬團隊） | Filter by member ID (find user's teams) */
  memberId?: string;
}

/**
 * 組織成員查詢選項
 * Organization member query options
 */
export interface OrganizationMemberQueryOptions {
  /** 按組織 ID 過濾 | Filter by organization ID */
  organizationId?: string;
  /** 按帳戶 ID 過濾 | Filter by account ID */
  accountId?: string;
  /** 按角色過濾 | Filter by role */
  role?: OrganizationMemberRole;
}

/**
 * 團隊成員查詢選項
 * Team member query options
 */
export interface TeamMemberQueryOptions {
  /** 按團隊 ID 過濾 | Filter by team ID */
  teamId?: string;
  /** 按帳戶 ID 過濾 | Filter by account ID */
  accountId?: string;
  /** 按角色過濾 | Filter by role */
  role?: TeamMemberRole;
}
