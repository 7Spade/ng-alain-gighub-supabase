/**
 * Blueprint Models
 *
 * Business models for Blueprint Container
 * Following docs/00-順序.md Step 3: Models 層
 *
 * @module blueprint.models
 */

import { Blueprint, BlueprintVisibility, BlueprintStatus, BlueprintCategory, OwnerType } from '@core';

/**
 * Blueprint Model (re-export from types with business context)
 */
export type BlueprintModel = Blueprint;

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

/**
 * Blueprint summary for list display
 */
export interface BlueprintSummary {
  id: string;
  name: string;
  description: string;
  category: BlueprintCategory;
  visibility: BlueprintVisibility;
  status: BlueprintStatus;
  usageCount: number;
  rating?: number;
  tags: string[];
  iconUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

/**
 * Blueprint creation request
 */
export interface CreateBlueprintRequest {
  name: string;
  description: string;
  category: BlueprintCategory;
  visibility?: BlueprintVisibility;
  ownerId: string;
  ownerType: OwnerType;
  tags?: string[];
  iconUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Blueprint update request
 */
export interface UpdateBlueprintRequest {
  name?: string;
  description?: string;
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  tags?: string[];
  iconUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Blueprint statistics
 */
export interface BlueprintStatistics {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
  totalUsageCount: number;
  averageRating: number;
}

/**
 * Blueprint filter options
 */
export interface BlueprintFilterOptions {
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  ownerId?: string;
  tags?: string[];
  searchTerm?: string;
}
