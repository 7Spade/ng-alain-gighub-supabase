/**
 * Blueprint Models
 *
 * Business models for Blueprint Container
 * Following vertical slice architecture
 *
 * @module features/blueprint/domain/models/blueprint.models
 */

import { Blueprint, BlueprintVisibility, BlueprintStatus, BlueprintCategory, OwnerType } from '../types';

/**
 * Blueprint Model (re-export from types with business context)
 */
export type BlueprintModel = Blueprint;

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
