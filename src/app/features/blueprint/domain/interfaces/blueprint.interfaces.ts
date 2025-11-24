/**
 * Blueprint Interfaces
 *
 * Interface definitions for Blueprint feature contracts
 * Following enterprise development guidelines
 *
 * @module features/blueprint/domain/interfaces/blueprint.interfaces
 */

import { BlueprintStatusEnum, BlueprintVisibilityEnum, BlueprintCategoryEnum } from '../enums';

/**
 * Blueprint filter options interface
 */
export interface IBlueprintFilterOptions {
  status?: BlueprintStatusEnum;
  visibility?: BlueprintVisibilityEnum;
  category?: BlueprintCategoryEnum;
  ownerId?: string;
  ownerType?: 'user' | 'organization' | 'team';
  searchTerm?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Blueprint sort options interface
 */
export interface IBlueprintSortOptions {
  field: 'name' | 'created_at' | 'updated_at' | 'usage_count';
  direction: 'asc' | 'desc';
}

/**
 * Blueprint pagination options interface
 */
export interface IBlueprintPaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Blueprint query options interface
 * Combines filter, sort, and pagination
 */
export interface IBlueprintQueryOptions {
  filter?: IBlueprintFilterOptions;
  sort?: IBlueprintSortOptions;
  pagination?: IBlueprintPaginationOptions;
}

/**
 * Blueprint statistics interface
 */
export interface IBlueprintStatistics {
  total: number;
  draft: number;
  published: number;
  archived: number;
  byCategory: Record<BlueprintCategoryEnum, number>;
  byVisibility: Record<BlueprintVisibilityEnum, number>;
}

/**
 * Blueprint validation result interface
 */
export interface IBlueprintValidationResult {
  isValid: boolean;
  errors: IBlueprintValidationError[];
  warnings: IBlueprintValidationWarning[];
}

/**
 * Blueprint validation error interface
 */
export interface IBlueprintValidationError {
  field: string;
  code: string;
  message: string;
}

/**
 * Blueprint validation warning interface
 */
export interface IBlueprintValidationWarning {
  field: string;
  code: string;
  message: string;
}

/**
 * Blueprint clone options interface
 */
export interface IBlueprintCloneOptions {
  newName: string;
  newOwnerId: string;
  newOwnerType: 'user' | 'organization' | 'team';
  includeMetadata?: boolean;
  includeTasks?: boolean;
}

/**
 * Blueprint export options interface
 */
export interface IBlueprintExportOptions {
  format: 'json' | 'yaml' | 'csv';
  includeMetadata?: boolean;
  includeTasks?: boolean;
  includeStatistics?: boolean;
}

/**
 * Blueprint import result interface
 */
export interface IBlueprintImportResult {
  success: boolean;
  blueprintId?: string;
  errors?: string[];
  warnings?: string[];
}
