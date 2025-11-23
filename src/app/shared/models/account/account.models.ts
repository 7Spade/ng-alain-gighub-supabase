/**
 * Account Business Models
 *
 * 帳戶統一身份抽象業務模型定義（業務層）
 * Account unified identity abstraction business model definitions (Business Layer)
 *
 * This module provides unified account abstraction models.
 * For specific business domain models, see user/, organization/, team/, bot/ directories.
 *
 * @module shared/models/account
 */

import { Database, AccountType, AccountStatus, ContextType, ContextState } from '@core';

/**
 * Re-export account-related enumerations from core layer
 * This maintains backward compatibility and allows importing from @shared/models/account
 */
export { AccountType, AccountStatus, ContextType };
export type { ContextState };

/**
 * Account entity type (camelCase)
 * Note: BaseRepository automatically converts snake_case → camelCase
 */
export type Account = Database['public']['Tables']['accounts']['Row'];
export type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
export type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

/**
 * 帳戶模型（業務層）
 * Account model (Business layer)
 *
 * Currently a type alias. In the future, can be extended with computed properties or business logic methods.
 */
export type AccountModel = Account;

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
  createdOrganizations: any[]; // Will be imported from organization models
  /** 用戶加入的組織 | Organizations user has joined */
  joinedOrganizations: any[]; // Will be imported from organization models
  /** 用戶所屬團隊 | Teams user belongs to */
  userTeams: any[]; // Will be imported from team models
  /** 按組織分組的團隊 | Teams grouped by organization */
  teamsByOrganization: Map<string, any[]>; // Will be imported from team models
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
