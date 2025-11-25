/**
 * Task Node Types
 *
 * Tree node types for NzTreeView integration
 * Supports unlimited depth hierarchy
 *
 * @module features/blueprint/ui/task/shared/task-node.types
 */

import { Task, TaskStatus } from '../../../domain';

/**
 * Flat tree node for NzTreeFlatDataSource
 */
export interface TaskFlatNode {
  /** Task ID */
  id: string;

  /** Task name for display */
  name: string;

  /** Tree depth level (0 = L0, 1 = L1, etc.) */
  level: number;

  /** Whether node is expandable (has children) */
  expandable: boolean;

  /** Task status */
  status: TaskStatus;

  /** Progress percentage (0-100) */
  progress: number;

  /** Completed count */
  completedCount: number;

  /** Total count */
  totalCount: number;

  /** Assignee IDs */
  assigneeIds: string[];

  /** Area tag */
  area?: string;

  /** Tags array */
  tags: string[];

  /** Priority */
  priority: string;

  /** Original task data */
  task: Task;
}

/**
 * Tree node for nested structure
 */
export interface TaskTreeNode {
  /** Task data */
  task: Task;

  /** Children nodes */
  children: TaskTreeNode[];

  /** Whether node is expanded */
  expanded: boolean;
}

/**
 * Children map for O(1) lookup
 */
export type TaskChildrenMap = Map<string | null, Task[]>;

/**
 * Build children map from flat task list
 * Pre-computed for O(1) child lookup
 */
export function buildChildrenMap(tasks: Task[]): TaskChildrenMap {
  const map = new Map<string | null, Task[]>();

  // Initialize with empty arrays
  map.set(null, []); // Root tasks

  // Group tasks by parentId
  for (const task of tasks) {
    const parentId = task.parentId;
    if (!map.has(parentId)) {
      map.set(parentId, []);
    }
    map.get(parentId)!.push(task);
  }

  // Sort children by position
  for (const children of map.values()) {
    children.sort((a, b) => a.position - b.position);
  }

  return map;
}

/**
 * Get children for a parent from pre-built map
 */
export function getChildren(map: TaskChildrenMap, parentId: string | null): Task[] {
  return map.get(parentId) ?? [];
}

/**
 * Build nested tree structure from flat list
 */
export function buildTreeNodes(tasks: Task[], childrenMap: TaskChildrenMap, parentId: string | null = null): TaskTreeNode[] {
  const children = getChildren(childrenMap, parentId);

  return children.map(task => ({
    task,
    children: buildTreeNodes(tasks, childrenMap, task.id),
    expanded: false
  }));
}

/**
 * Convert Task to TaskFlatNode
 */
export function taskToFlatNode(task: Task, childrenMap: TaskChildrenMap): TaskFlatNode {
  const children = getChildren(childrenMap, task.id);

  return {
    id: task.id,
    name: task.name,
    level: task.depth,
    expandable: children.length > 0,
    status: task.status,
    progress: task.progress,
    completedCount: task.completedCount,
    totalCount: task.totalCount,
    assigneeIds: task.assigneeIds,
    area: task.area,
    tags: task.tags,
    priority: task.priority,
    task
  };
}

/**
 * Convert all tasks to flat nodes for tree
 */
export function tasksToFlatNodes(tasks: Task[], childrenMap: TaskChildrenMap): TaskFlatNode[] {
  return tasks.map(task => taskToFlatNode(task, childrenMap));
}
