/**
 * Task Models
 *
 * Business models for Task Module (任務模組)
 * Following docs/00-順序.md Step 3: Models 層
 *
 * @module task.models
 */

import { Task, TaskStatus, TaskPriority, AssigneeType } from '@core';

/**
 * Task Model (re-export from types with business context)
 */
export type TaskModel = Task;

/**
 * Task status enum for business logic
 */
export enum TaskStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Task priority enum for business logic
 */
export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Assignee type enum for business logic
 */
export enum AssigneeTypeEnum {
  USER = 'user',
  TEAM = 'team',
  ORGANIZATION = 'organization'
}

/**
 * Task level helper (L0, L1, L2, L3...)
 */
export type TaskLevel = `L${number}`;

/**
 * Task summary for list display
 */
export interface TaskSummary {
  id: string;
  name: string;
  level: TaskLevel;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  completedCount: number;
  totalCount: number;
  assigneeIds: string[];
  area?: string;
  tags: string[];
  dueDate?: Date;
}

/**
 * Task creation request
 */
export interface CreateTaskRequest {
  workspaceId: string;
  parentId?: string | null;
  name: string;
  description?: string;
  priority?: TaskPriority;
  assigneeIds?: string[];
  assigneeTypes?: AssigneeType[];
  area?: string;
  tags?: string[];
  dueDate?: Date;
}

/**
 * Task update request
 */
export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeIds?: string[];
  assigneeTypes?: AssigneeType[];
  area?: string;
  tags?: string[];
  dueDate?: Date;
}

/**
 * Task move request (change parent or position)
 */
export interface MoveTaskRequest {
  taskId: string;
  newParentId?: string | null;
  newPosition: number;
}

/**
 * Task statistics for workspace
 */
export interface TaskStatistics {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  
  // By level
  l0Count: number;  // Root tasks
  l1Count: number;
  l2Count: number;
  l3PlusCount: number;  // L3 and deeper
  
  // Progress
  overallProgress: number;  // Percentage
  averageDepth: number;
}

/**
 * Task filter options
 */
export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  area?: string;
  tags?: string[];
  level?: number;  // depth filter
  searchTerm?: string;
}

/**
 * Task view mode
 */
export type TaskViewMode = 'tree' | 'table';

/**
 * Task assignment request
 */
export interface AssignTaskRequest {
  taskId: string;
  assigneeId: string;
  assigneeType: AssigneeType;
}

/**
 * Bulk task operation request
 */
export interface BulkTaskOperationRequest {
  taskIds: string[];
  operation: 'complete' | 'cancel' | 'delete' | 'assign';
  payload?: unknown;  // Operation-specific data
}
