/**
 * Workspace Models
 *
 * Business models for Workspace
 * Following docs/00-順序.md Step 3: Models 層
 *
 * @module workspace.models
 */

import { Workspace, WorkspaceStatus, TenantType, WorkspaceMemberRole, WorkspaceMember } from '@core';

/**
 * Workspace Model (re-export from types with business context)
 */
export type WorkspaceModel = Workspace;

/**
 * Workspace member Model
 */
export type WorkspaceMemberModel = WorkspaceMember;

/**
 * Workspace status enum for business logic
 */
export enum WorkspaceStatusEnum {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  TEMPLATE = 'template'
}

/**
 * Workspace member role enum for business logic
 */
export enum WorkspaceMemberRoleEnum {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

/**
 * Workspace summary for list display
 */
export interface WorkspaceSummary {
  id: string;
  name: string;
  description?: string;
  status: WorkspaceStatus;
  blueprintId?: string;
  tenantId: string;
  tenantType: TenantType;
  memberCount?: number;
  createdAt: Date;
}

/**
 * Workspace creation request
 */
export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  blueprintId?: string;
  tenantId: string;
  tenantType: TenantType;
}

/**
 * Workspace update request
 */
export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  status?: WorkspaceStatus;
}

/**
 * Workspace statistics
 */
export interface WorkspaceStatistics {
  totalCount: number;
  activeCount: number;
  archivedCount: number;
  templateCount: number;
  totalMemberCount: number;
}

/**
 * Workspace filter options
 */
export interface WorkspaceFilterOptions {
  status?: WorkspaceStatus;
  tenantId?: string;
  blueprintId?: string;
  searchTerm?: string;
}

/**
 * Workspace member invitation request
 */
export interface InviteWorkspaceMemberRequest {
  workspaceId: string;
  userId: string;
  role?: WorkspaceMemberRole;
}

/**
 * Workspace member role update request
 */
export interface UpdateWorkspaceMemberRoleRequest {
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
}
