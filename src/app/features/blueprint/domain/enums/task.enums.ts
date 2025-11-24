/**
 * Task Enums
 *
 * Enum definitions for Task business logic
 * Following vertical slice architecture
 *
 * @module features/blueprint/domain/enums/task.enums
 */

/**
 * Task status enum for business logic
 */
export enum TaskStatusEnum {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  CANCELLED = 'cancelled',
  // Legacy aliases for backward compatibility
  PENDING = 'pending',
  COMPLETED = 'completed'
}

/**
 * Task priority enum for business logic
 */
export enum TaskPriorityEnum {
  LOWEST = 'lowest',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  HIGHEST = 'highest',
  // Legacy alias
  URGENT = 'urgent'
}

/**
 * Task type enum for business logic
 */
export enum TaskTypeEnum {
  TASK = 'task',
  MILESTONE = 'milestone',
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement'
}

/**
 * Assignee type enum for business logic
 */
export enum AssigneeTypeEnum {
  USER = 'user',
  TEAM = 'team',
  ORGANIZATION = 'organization'
}
