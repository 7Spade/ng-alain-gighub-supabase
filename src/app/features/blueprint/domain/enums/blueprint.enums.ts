/**
 * Blueprint Enums
 *
 * Enum definitions for Blueprint business logic
 * Following vertical slice architecture
 *
 * 適用於工地建築領域的排程規劃、進度追蹤、品質驗收
 *
 * @module features/blueprint/domain/enums/blueprint.enums
 */

/**
 * Blueprint visibility enum for business logic
 * 簡化為公開/隱藏
 */
export enum BlueprintVisibilityEnum {
  PRIVATE = 'private',
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
