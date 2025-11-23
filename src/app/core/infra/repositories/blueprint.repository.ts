/**
 * Blueprint Repository
 *
 * Repository for Blueprint Container data access layer
 * Following docs/00-順序.md Step 2: Repositories 層
 *
 * @module blueprint.repository
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository } from './base.repository';
import { Blueprint, BlueprintInsert, BlueprintUpdate } from '../types/blueprint.types';
import { QueryOptions } from '../types/supabase.types';

/**
 * Blueprint Repository
 *
 * Handles data access for blueprints with automatic camelCase conversion
 */
@Injectable({ providedIn: 'root' })
export class BlueprintRepository extends BaseRepository<Blueprint, BlueprintInsert, BlueprintUpdate> {
  protected tableName = 'blueprints';

  /**
   * Find blueprints by owner
   *
   * @param {string} ownerId - Owner ID (user, organization, or team)
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Blueprint[]>} Array of blueprints
   */
  findByOwner(ownerId: string, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        ownerId
      }
    });
  }

  /**
   * Find blueprints by category
   *
   * @param {string} category - Blueprint category
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Blueprint[]>} Array of blueprints
   */
  findByCategory(category: string, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        category
      }
    });
  }

  /**
   * Find blueprints by visibility
   *
   * @param {string} visibility - Blueprint visibility level
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Blueprint[]>} Array of blueprints
   */
  findByVisibility(visibility: string, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        visibility
      }
    });
  }

  /**
   * Find blueprints by status
   *
   * @param {string} status - Blueprint status
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Blueprint[]>} Array of blueprints
   */
  findByStatus(status: string, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * Find published public blueprints (marketplace)
   *
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Blueprint[]>} Array of public blueprints
   */
  findPublicBlueprints(options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        visibility: 'public',
        status: 'published'
      }
    });
  }

  /**
   * Search blueprints by name or description
   *
   * Note: Full-text search implementation requires custom query.
   * This method currently passes searchTerm through filters,
   * but actual implementation depends on Supabase text search setup.
   * 
   * TODO: Implement proper full-text search using Supabase .textSearch() method
   * or PostgreSQL full-text search functions
   *
   * @param {string} searchTerm - Search term
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Blueprint[]>} Array of matching blueprints
   */
  search(searchTerm: string, options?: QueryOptions): Observable<Blueprint[]> {
    // TODO: Implement full-text search
    // Example: Use Supabase .textSearch() or PostgreSQL ts_vector
    return this.findAll({
      ...options
    });
  }
}
