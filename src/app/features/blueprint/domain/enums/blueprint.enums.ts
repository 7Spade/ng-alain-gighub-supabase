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
 * Simplified: only public (公開) or hidden (隱藏/私有)
 */
export enum BlueprintVisibilityEnum {
  PUBLIC = 'public',
  HIDDEN = 'hidden'
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
