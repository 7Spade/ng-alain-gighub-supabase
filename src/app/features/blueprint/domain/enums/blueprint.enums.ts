/**
 * Blueprint Enums
 *
 * Enum definitions for Blueprint business logic
 * Following vertical slice architecture
 *
 * @module features/blueprint/domain/enums/blueprint.enums
 */

/**
 * Blueprint visibility enum for business logic
 */
export enum BlueprintVisibilityEnum {
  PRIVATE = 'private',
  ORGANIZATION = 'organization',
  TEAM = 'team',
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
 * Blueprint category enum for business logic
 */
export enum BlueprintCategoryEnum {
  SOFTWARE_DEVELOPMENT = 'software_development',
  MARKETING = 'marketing',
  SALES = 'sales',
  HR = 'hr',
  OPERATIONS = 'operations',
  CUSTOM = 'custom'
}
