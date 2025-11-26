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
 * Blueprint summary for list display (simplified)
 */
export interface BlueprintSummary {
  id: string;
  name: string;
  description: string;
  category?: BlueprintCategory;
  visibility: BlueprintVisibility;
  status: BlueprintStatus;
  tags: string[];
  createdAt: Date;
}

/**
 * Blueprint creation request (simplified)
 */
export interface CreateBlueprintRequest {
  name: string;
  description: string;
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  ownerId: string;
  ownerType: OwnerType;
  tags?: string[];
}

/**
 * Blueprint update request (simplified)
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
 * Blueprint statistics (simplified)
 */
export interface BlueprintStatistics {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
}

/**
 * Blueprint filter options (simplified)
 */
export interface BlueprintFilterOptions {
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  ownerId?: string;
  tags?: string[];
  searchTerm?: string;
}
