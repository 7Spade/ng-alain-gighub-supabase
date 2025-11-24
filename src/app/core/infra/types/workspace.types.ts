/**
 * Workspace Types
 *
 * Type definitions for workspace instances (instantiated from blueprints)
 * Following docs/00-順序.md and BLUEPRINT_CONTAINER_PLANNING.md
 *
 * @module workspace.types
 */

import { WorkspaceSettings } from './blueprint.types';

/**
 * Workspace status
 */
export type WorkspaceStatus = 'active' | 'archived' | 'template';

/**
 * Tenant type (Account Context integration)
 */
export type TenantType = 'user' | 'organization' | 'team';

/**
 * Workspace member role
 */
export type WorkspaceMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * Workspace instance (instantiated from blueprint)
 */
export interface Workspace {
  // Identity
  id: string;
  name: string;
  description?: string;

  // Blueprint reference (optional - workspace can be created without blueprint)
  blueprintId?: string;
  blueprintVersion?: number;

  // Ownership (Account Context Integration)
  tenantId: string;
  tenantType: TenantType;

  // Status
  status: WorkspaceStatus;
  settings: WorkspaceSettings;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

/**
 * Workspace member (many-to-many relationship)
 */
export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
  joinedAt: Date;
  invitedBy?: string;
}

/**
 * Workspace insert type (for creation)
 */
export interface WorkspaceInsert {
  name: string;
  description?: string;
  blueprintId?: string;
  blueprintVersion?: number;
  tenantId: string;
  tenantType: TenantType;
  status?: WorkspaceStatus;
  settings: WorkspaceSettings;
}

/**
 * Workspace update type (for modifications)
 */
export interface WorkspaceUpdate {
  name?: string;
  description?: string;
  status?: WorkspaceStatus;
  settings?: WorkspaceSettings;
}

/**
 * Workspace member insert type
 */
export interface WorkspaceMemberInsert {
  workspaceId: string;
  userId: string;
  role?: WorkspaceMemberRole;
  invitedBy?: string;
}

/**
 * Workspace member update type
 */
export interface WorkspaceMemberUpdate {
  role?: WorkspaceMemberRole;
}

/**
 * Type guards
 */
export function isWorkspaceStatus(value: unknown): value is WorkspaceStatus {
  return typeof value === 'string' && ['active', 'archived', 'template'].includes(value);
}

export function isTenantType(value: unknown): value is TenantType {
  return typeof value === 'string' && ['user', 'organization', 'team'].includes(value);
}

export function isWorkspaceMemberRole(value: unknown): value is WorkspaceMemberRole {
  return typeof value === 'string' && ['owner', 'admin', 'member', 'viewer'].includes(value);
}
