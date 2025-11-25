/**
 * Task Display Utilities
 *
 * Shared utilities for task display formatting
 * Used across tree, table, and list views
 *
 * @module features/blueprint/ui/task/shared
 */

import { TaskStatus, TaskPriority } from '../../../domain';

/**
 * Status color mapping for badges
 */
export const STATUS_COLOR_MAP: Record<TaskStatus, string> = {
  pending: 'default',
  in_progress: 'processing',
  completed: 'success',
  cancelled: 'error'
};

/**
 * Status text mapping for display
 */
export const STATUS_TEXT_MAP: Record<TaskStatus, string> = {
  pending: '待處理',
  in_progress: '進行中',
  completed: '已完成',
  cancelled: '已取消'
};

/**
 * Priority color mapping
 */
export const PRIORITY_COLOR_MAP: Record<TaskPriority, string> = {
  low: 'default',
  medium: 'warning',
  high: 'error',
  urgent: 'error'
};

/**
 * Get status badge color
 */
export function getStatusColor(status: TaskStatus): string {
  return STATUS_COLOR_MAP[status] || 'default';
}

/**
 * Get status display text
 */
export function getStatusText(status: TaskStatus): string {
  return STATUS_TEXT_MAP[status] || status;
}

/**
 * Get priority badge color
 */
export function getPriorityColor(priority: TaskPriority): string {
  return PRIORITY_COLOR_MAP[priority] || 'default';
}

/**
 * Get task level display string (L0, L1, L2, L3+)
 */
export function getTaskLevel(depth: number): string {
  return `L${depth}`;
}

/**
 * Get level tag color based on depth
 */
export function getLevelColor(depth: number): string {
  const colors = ['blue', 'cyan', 'purple', 'orange'];
  return colors[Math.min(depth, colors.length - 1)];
}
