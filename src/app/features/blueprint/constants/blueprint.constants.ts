/**
 * Blueprint Constants
 *
 * Constants for Blueprint business logic
 * Following enterprise development guidelines
 * Simplified version - removed old visibility options
 *
 * @module features/blueprint/constants/blueprint.constants
 */

import { BlueprintStatusEnum, BlueprintVisibilityEnum, BlueprintCategoryEnum } from '../domain';

/**
 * Blueprint default values (simplified)
 */
export const BLUEPRINT_DEFAULTS = {
  /** Default status for new blueprints */
  STATUS: BlueprintStatusEnum.DRAFT,
  /** Default visibility for new blueprints (hidden instead of private) */
  VISIBILITY: BlueprintVisibilityEnum.HIDDEN,
  /** Default category for new blueprints */
  CATEGORY: BlueprintCategoryEnum.CUSTOM,
  /** Default page size for pagination */
  PAGE_SIZE: 20,
  /** Maximum name length */
  MAX_NAME_LENGTH: 100,
  /** Maximum description length */
  MAX_DESCRIPTION_LENGTH: 500,
  /** Maximum tags count */
  MAX_TAGS_COUNT: 10,
  /** Maximum tag length */
  MAX_TAG_LENGTH: 30
} as const;

/**
 * Blueprint status display configuration
 */
export const BLUEPRINT_STATUS_CONFIG = {
  [BlueprintStatusEnum.DRAFT]: {
    label: '草稿',
    color: 'default',
    icon: 'edit',
    description: '藍圖尚未發布'
  },
  [BlueprintStatusEnum.PUBLISHED]: {
    label: '已發布',
    color: 'success',
    icon: 'check-circle',
    description: '藍圖已公開發布'
  },
  [BlueprintStatusEnum.ARCHIVED]: {
    label: '已封存',
    color: 'warning',
    icon: 'inbox',
    description: '藍圖已封存'
  }
} as const;

/**
 * Blueprint visibility display configuration (simplified to public/hidden)
 */
export const BLUEPRINT_VISIBILITY_CONFIG = {
  [BlueprintVisibilityEnum.HIDDEN]: {
    label: '隱藏',
    color: 'default',
    icon: 'lock',
    description: '僅擁有者和成員可見'
  },
  [BlueprintVisibilityEnum.PUBLIC]: {
    label: '公開',
    color: 'success',
    icon: 'global',
    description: '所有人可見'
  }
} as const;

/**
 * Blueprint category display configuration
 */
export const BLUEPRINT_CATEGORY_CONFIG = {
  [BlueprintCategoryEnum.SOFTWARE_DEVELOPMENT]: {
    label: '軟體開發',
    color: 'blue',
    icon: 'code',
    description: '軟體開發相關藍圖'
  },
  [BlueprintCategoryEnum.MARKETING]: {
    label: '行銷',
    color: 'orange',
    icon: 'fund-projection-screen',
    description: '行銷活動相關藍圖'
  },
  [BlueprintCategoryEnum.SALES]: {
    label: '銷售',
    color: 'green',
    icon: 'dollar',
    description: '銷售流程相關藍圖'
  },
  [BlueprintCategoryEnum.HR]: {
    label: '人力資源',
    color: 'purple',
    icon: 'user',
    description: '人力資源相關藍圖'
  },
  [BlueprintCategoryEnum.OPERATIONS]: {
    label: '營運',
    color: 'cyan',
    icon: 'setting',
    description: '營運管理相關藍圖'
  },
  [BlueprintCategoryEnum.CUSTOM]: {
    label: '自訂',
    color: 'default',
    icon: 'appstore',
    description: '自訂類別藍圖'
  }
} as const;

/**
 * Blueprint form validation rules
 */
export const BLUEPRINT_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 1,
    maxLength: BLUEPRINT_DEFAULTS.MAX_NAME_LENGTH,
    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_]+$/
  },
  description: {
    required: false,
    maxLength: BLUEPRINT_DEFAULTS.MAX_DESCRIPTION_LENGTH
  },
  tags: {
    maxCount: BLUEPRINT_DEFAULTS.MAX_TAGS_COUNT,
    maxLength: BLUEPRINT_DEFAULTS.MAX_TAG_LENGTH
  }
} as const;

/**
 * Blueprint sort options for UI (simplified - removed usage_count)
 */
export const BLUEPRINT_SORT_OPTIONS = [
  { label: '名稱', value: 'name' },
  { label: '建立時間', value: 'created_at' },
  { label: '更新時間', value: 'updated_at' }
] as const;
