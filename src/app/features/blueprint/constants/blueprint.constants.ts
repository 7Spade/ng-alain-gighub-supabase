/**
 * Blueprint Constants
 *
 * Constants for Blueprint business logic
 * Following enterprise development guidelines
 *
 * 適用於工地建築領域的排程規劃、進度追蹤、品質驗收
 *
 * @module features/blueprint/constants/blueprint.constants
 */

import { BlueprintStatusEnum, BlueprintVisibilityEnum } from '../domain';

/**
 * Blueprint default values (簡化)
 */
export const BLUEPRINT_DEFAULTS = {
  /** Default status for new blueprints */
  STATUS: BlueprintStatusEnum.DRAFT,
  /** Default visibility for new blueprints */
  VISIBILITY: BlueprintVisibilityEnum.PRIVATE,
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
 * Blueprint visibility display configuration (簡化：只有公開/隱藏)
 */
export const BLUEPRINT_VISIBILITY_CONFIG = {
  [BlueprintVisibilityEnum.PRIVATE]: {
    label: '隱藏',
    color: 'default',
    icon: 'lock',
    description: '僅建立者可見'
  },
  [BlueprintVisibilityEnum.PUBLIC]: {
    label: '公開',
    color: 'success',
    icon: 'global',
    description: '所有人可見'
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
 * Blueprint sort options for UI (簡化：移除 usage_count)
 */
export const BLUEPRINT_SORT_OPTIONS = [
  { label: '名稱', value: 'name' },
  { label: '建立時間', value: 'created_at' },
  { label: '更新時間', value: 'updated_at' }
] as const;
