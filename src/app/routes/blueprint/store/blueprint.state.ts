/**
 * Blueprint State
 *
 * State definition for Blueprint Module using RxJS
 * Following Angular 20+ and enterprise development guidelines
 *
 * @module blueprint.state
 */

import { BlueprintModel } from '@shared';

/**
 * Blueprint state interface
 */
export interface BlueprintState {
  blueprints: BlueprintModel[];
  selectedBlueprintId: string | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: BlueprintFilters;
}

/**
 * Blueprint filters
 */
export interface BlueprintFilters {
  status?: string[];
  category?: string[];
  visibility?: string[];
  ownerId?: string;
}

/**
 * Initial state
 */
export const initialBlueprintState: BlueprintState = {
  blueprints: [],
  selectedBlueprintId: null,
  loading: false,
  error: null,
  searchTerm: '',
  filters: {}
};
