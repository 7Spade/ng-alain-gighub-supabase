/**
 * Workspace Constants
 *
 * Constants for Workspace business logic
 * Following enterprise development guidelines
 *
 * @module features/blueprint/constants/workspace.constants
 */

import { WorkspaceStatus } from '../domain/types/workspace.types';

/**
 * Workspace tenant types
 */
export type WorkspaceTenant = 'user' | 'organization' | 'team';

/**
 * Workspace member roles
 */
export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * Workspace default values
 */
export const WORKSPACE_DEFAULTS = {
  /** Default status for new workspaces */
  STATUS: 'active' as WorkspaceStatus,
  /** Default page size for pagination */
  PAGE_SIZE: 20,
  /** Maximum name length */
  MAX_NAME_LENGTH: 100,
  /** Maximum description length */
  MAX_DESCRIPTION_LENGTH: 500,
  /** Maximum members count */
  MAX_MEMBERS_COUNT: 100,
  /** Maximum tags count */
  MAX_TAGS_COUNT: 10
} as const;

/**
 * Workspace status display configuration
 */
export const WORKSPACE_STATUS_CONFIG = {
  active: {
    label: '活躍',
    color: 'success',
    icon: 'check-circle',
    description: '工作區正在使用中'
  },
  archived: {
    label: '已封存',
    color: 'warning',
    icon: 'inbox',
    description: '工作區已封存'
  },
  deleted: {
    label: '已刪除',
    color: 'error',
    icon: 'delete',
    description: '工作區已刪除'
  }
} as const;

/**
 * Workspace tenant type display configuration
 */
export const WORKSPACE_TENANT_CONFIG = {
  user: {
    label: '個人',
    color: 'blue',
    icon: 'user',
    description: '個人工作區'
  },
  organization: {
    label: '組織',
    color: 'purple',
    icon: 'bank',
    description: '組織工作區'
  },
  team: {
    label: '團隊',
    color: 'cyan',
    icon: 'team',
    description: '團隊工作區'
  }
} as const;

/**
 * Workspace role display configuration
 */
export const WORKSPACE_ROLE_CONFIG = {
  owner: {
    label: '擁有者',
    color: 'gold',
    icon: 'crown',
    description: '完全控制權限',
    permissions: ['read', 'write', 'delete', 'manage_members', 'manage_settings', 'transfer_ownership']
  },
  admin: {
    label: '管理員',
    color: 'purple',
    icon: 'setting',
    description: '管理權限',
    permissions: ['read', 'write', 'delete', 'manage_members']
  },
  member: {
    label: '成員',
    color: 'blue',
    icon: 'user',
    description: '編輯權限',
    permissions: ['read', 'write']
  },
  viewer: {
    label: '檢視者',
    color: 'default',
    icon: 'eye',
    description: '唯讀權限',
    permissions: ['read']
  }
} as const;

/**
 * Workspace form validation rules
 */
export const WORKSPACE_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 1,
    maxLength: WORKSPACE_DEFAULTS.MAX_NAME_LENGTH
  },
  description: {
    required: false,
    maxLength: WORKSPACE_DEFAULTS.MAX_DESCRIPTION_LENGTH
  }
} as const;

/**
 * Workspace sort options for UI
 */
export const WORKSPACE_SORT_OPTIONS = [
  { label: '名稱', value: 'name' },
  { label: '建立時間', value: 'created_at' },
  { label: '更新時間', value: 'updated_at' },
  { label: '最後訪問', value: 'last_accessed_at' }
] as const;

/**
 * Workspace activity types
 */
export const WORKSPACE_ACTIVITY_TYPES = {
  created: { label: '建立', icon: 'plus', color: 'success' },
  updated: { label: '更新', icon: 'edit', color: 'processing' },
  deleted: { label: '刪除', icon: 'delete', color: 'error' },
  archived: { label: '封存', icon: 'inbox', color: 'warning' },
  restored: { label: '還原', icon: 'undo', color: 'success' },
  task_created: { label: '新增任務', icon: 'plus-square', color: 'blue' },
  task_updated: { label: '更新任務', icon: 'edit', color: 'processing' },
  task_deleted: { label: '刪除任務', icon: 'minus-square', color: 'error' },
  task_completed: { label: '完成任務', icon: 'check-square', color: 'success' },
  member_added: { label: '新增成員', icon: 'user-add', color: 'blue' },
  member_removed: { label: '移除成員', icon: 'user-delete', color: 'warning' }
} as const;
