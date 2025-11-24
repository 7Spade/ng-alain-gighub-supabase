/**
 * Workspace Interfaces
 *
 * Interface definitions for Workspace feature contracts
 * Following enterprise development guidelines
 *
 * @module features/blueprint/domain/interfaces/workspace.interfaces
 */

/**
 * Workspace status enum (local to interface, could be moved to enums)
 */
export type WorkspaceStatusType = 'active' | 'archived' | 'deleted';

/**
 * Workspace tenant type
 */
export type WorkspaceTenantType = 'user' | 'organization' | 'team';

/**
 * Workspace filter options interface
 */
export interface IWorkspaceFilterOptions {
  status?: WorkspaceStatusType;
  tenantId?: string;
  tenantType?: WorkspaceTenantType;
  blueprintId?: string;
  searchTerm?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Workspace sort options interface
 */
export interface IWorkspaceSortOptions {
  field: 'name' | 'created_at' | 'updated_at' | 'last_accessed_at';
  direction: 'asc' | 'desc';
}

/**
 * Workspace pagination options interface
 */
export interface IWorkspacePaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Workspace query options interface
 * Combines filter, sort, and pagination
 */
export interface IWorkspaceQueryOptions {
  filter?: IWorkspaceFilterOptions;
  sort?: IWorkspaceSortOptions;
  pagination?: IWorkspacePaginationOptions;
}

/**
 * Workspace statistics interface
 */
export interface IWorkspaceStatistics {
  total: number;
  active: number;
  archived: number;
  byTenantType: Record<WorkspaceTenantType, number>;
  taskCount: number;
  completedTaskCount: number;
  overdueTaskCount: number;
}

/**
 * Workspace validation result interface
 */
export interface IWorkspaceValidationResult {
  isValid: boolean;
  errors: IWorkspaceValidationError[];
  warnings: IWorkspaceValidationWarning[];
}

/**
 * Workspace validation error interface
 */
export interface IWorkspaceValidationError {
  field: string;
  code: string;
  message: string;
}

/**
 * Workspace validation warning interface
 */
export interface IWorkspaceValidationWarning {
  field: string;
  code: string;
  message: string;
}

/**
 * Workspace clone options interface
 */
export interface IWorkspaceCloneOptions {
  newName: string;
  newTenantId: string;
  newTenantType: WorkspaceTenantType;
  includeCompletedTasks?: boolean;
  resetTaskStatuses?: boolean;
}

/**
 * Workspace member interface
 */
export interface IWorkspaceMember {
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  lastAccessedAt?: Date;
}

/**
 * Workspace member invitation interface
 */
export interface IWorkspaceMemberInvitation {
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  message?: string;
  expiresAt: Date;
}

/**
 * Workspace activity interface
 */
export interface IWorkspaceActivity {
  id: string;
  workspaceId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'archived' | 'restored' | 'task_created' | 'task_updated' | 'task_deleted' | 'task_completed';
  entityType: 'workspace' | 'task';
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Workspace export options interface
 */
export interface IWorkspaceExportOptions {
  format: 'json' | 'yaml' | 'csv';
  includeTasks?: boolean;
  includeCompletedTasks?: boolean;
  includeMembers?: boolean;
  includeActivities?: boolean;
}
