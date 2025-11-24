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
