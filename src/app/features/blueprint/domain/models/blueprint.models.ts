/**
 * Blueprint Models
 *
 * Business models for Blueprint Container
 * Following vertical slice architecture
 *
 * 適用於工地建築領域的排程規劃、進度追蹤、品質驗收
 *
 * @module features/blueprint/domain/models/blueprint.models
 */

import { Blueprint, BlueprintVisibility, BlueprintStatus, OwnerType } from '../types';

/**
 * Blueprint Model (re-export from types with business context)
 */
export type BlueprintModel = Blueprint;

/**
 * Blueprint summary for list display (簡化：移除 category, usageCount, rating, iconUrl, thumbnailUrl)
 */
export interface BlueprintSummary {
  id: string;
  name: string;
  description: string;
  visibility: BlueprintVisibility;
  status: BlueprintStatus;
  tags: string[];
  createdAt: Date;
}

/**
 * Blueprint creation request (簡化：移除 category, iconUrl, thumbnailUrl)
 */
export interface CreateBlueprintRequest {
  name: string;
  description: string;
  visibility?: BlueprintVisibility;
  ownerId: string;
  ownerType: OwnerType;
  tags?: string[];
}

/**
 * Blueprint update request (簡化：移除 category, iconUrl, thumbnailUrl)
 */
export interface UpdateBlueprintRequest {
  name?: string;
  description?: string;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  tags?: string[];
}

/**
 * Blueprint statistics (簡化：移除 totalUsageCount, averageRating)
 */
export interface BlueprintStatistics {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
}

/**
 * Blueprint filter options (簡化：移除 category)
 */
export interface BlueprintFilterOptions {
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  ownerId?: string;
  tags?: string[];
  searchTerm?: string;
}
