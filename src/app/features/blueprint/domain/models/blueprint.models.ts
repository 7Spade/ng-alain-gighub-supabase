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
 * Simplified: removed unused fields
 */
export interface BlueprintSummary {
  id: string;
  name: string;
  description: string;
  category?: BlueprintCategory;
  visibility: BlueprintVisibility;
  status: BlueprintStatus;
  tags?: string[];
  createdAt: Date;
}

/**
 * Blueprint creation request
 * Simplified: only essential fields
 */
export interface CreateBlueprintRequest {
  name: string;
  description: string;
  ownerId: string;
  ownerType: OwnerType;
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  tags?: string[];
}

/**
 * Blueprint update request
 * Simplified: removed unused fields
 */
export interface UpdateBlueprintRequest {
  name?: string;
  description?: string;
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  tags?: string[];
}

/**
 * Blueprint statistics
 * Simplified: removed unused metrics
 */
export interface BlueprintStatistics {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
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
