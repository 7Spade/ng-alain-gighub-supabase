/**
 * Blueprint Enums
 *
 * Enum definitions for Blueprint business logic
 * Following vertical slice architecture
 *
 * @module features/blueprint/domain/enums/blueprint.enums
 */

/**
 * Blueprint visibility enum for business logic (simplified)
 * - PUBLIC: 公開，任何人都能看到
 * - HIDDEN: 隱藏/私有，只有擁有者和成員能看到
 */
export enum BlueprintVisibilityEnum {
  HIDDEN = 'hidden',
  PUBLIC = 'public'
}

/**
 * Blueprint status enum for business logic
 */
export enum BlueprintStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * Blueprint category enum for business logic (optional)
 */
export enum BlueprintCategoryEnum {
  SOFTWARE_DEVELOPMENT = 'software_development',
  MARKETING = 'marketing',
  SALES = 'sales',
  HR = 'hr',
  OPERATIONS = 'operations',
  CUSTOM = 'custom'
}
