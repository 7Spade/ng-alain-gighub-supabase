/**
 * Task Types
 *
 * Type definitions for Task Module (任務模組)
 * Supporting unlimited depth hierarchy with tree structure
 * Following docs/00-順序.md and BLUEPRINT_TASK_MODULE_DESIGN.md
 *
 * @module task.types
 */

/**
 * Task status (狀態)
 */
export type TaskStatus =
  | 'pending' // 待處理
  | 'in_progress' // 進行中
  | 'completed' // 已完成
  | 'cancelled'; // 已取消

/**
 * Task priority
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Assignee type (被指派者類型)
 */
export type AssigneeType = 'user' | 'team' | 'organization';

/**
 * Task entity with unlimited tree depth
 */
export interface Task {
  // Identity
  id: string;
  workspaceId: string;

  // Tree structure (無限子層)
  parentId: string | null; // null for root tasks (L0)
  position: number; // Sibling ordering (0-based)
  path: string; // Materialized path: '1', '1.2', '1.2.3'
  depth: number; // Tree depth: 0(L0), 1(L1), 2(L2), 3(L3)...

  // Basic info
  name: string; // 任務名稱
  description?: string;
  status: TaskStatus; // 狀態
  priority: TaskPriority;

  // Assignment (被指派者)
  assigneeIds: string[];
  assigneeTypes: AssigneeType[];

  // Location & Categorization
  area?: string; // 區域
  tags: string[]; // 標籤

  // Progress tracking (進度)
  completedCount: number; // 完成數量 (children completed)
  totalCount: number; // 總數量 (total children)
  progress: number; // 進度百分比 (calculated: completedCount / totalCount * 100)

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;

  // Denormalized counts for performance
  childCount: number; // Direct children count
}

/**
 * Task insert type (for creation)
 */
export interface TaskInsert {
  workspaceId: string;
  parentId?: string | null;
  position?: number;
  path: string;
  depth: number;
  name: string;
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
 * Task update type (for modifications)
 */
export interface TaskUpdate {
  name?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeIds?: string[];
  assigneeTypes?: AssigneeType[];
  area?: string;
  tags?: string[];
  dueDate?: Date;
  position?: number;
  parentId?: string | null;
}

/**
 * Task tree node for UI display
 */
export interface TaskTreeNode {
  key: string; // task.id
  title: string; // task.name
  level: string; // 'L0', 'L1', 'L2', 'L3'...
  isLeaf: boolean; // No children
  expanded: boolean;
  children: TaskTreeNode[];

  // Task data
  task: Task;

  // Display metadata
  icon: string; // Icon based on status
  disabled: boolean;
}

/**
 * Task assignment record
 */
export interface TaskAssignment {
  id: string;
  taskId: string;
  assigneeId: string;
  assigneeType: AssigneeType;
  assignedAt: Date;
  assignedBy: string;
}

/**
 * Type guards
 */
export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && ['pending', 'in_progress', 'completed', 'cancelled'].includes(value);
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === 'string' && ['low', 'medium', 'high', 'urgent'].includes(value);
}

export function isAssigneeType(value: unknown): value is AssigneeType {
  return typeof value === 'string' && ['user', 'team', 'organization'].includes(value);
}
