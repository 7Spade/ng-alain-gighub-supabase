/**
 * Workspace Repository
 *
 * Repository for Workspace data access layer
 * Following vertical slice architecture
 *
 * @module features/blueprint/data-access/repositories/workspace.repository
 */

import { Injectable } from '@angular/core';
import { BaseRepository, QueryOptions } from '@core';
import { Observable } from 'rxjs';

import { Workspace, WorkspaceInsert, WorkspaceUpdate } from '../../domain';

/**
 * Workspace Repository
 *
 * Handles data access for workspaces with automatic camelCase conversion
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceRepository extends BaseRepository<Workspace, WorkspaceInsert, WorkspaceUpdate> {
  protected tableName = 'workspaces';

  /**
   * Find workspaces by tenant
   *
   * @param {string} tenantId - Tenant ID (user, organization, or team)
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Workspace[]>} Array of workspaces
   */
  findByTenant(tenantId: string, options?: QueryOptions): Observable<Workspace[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        tenantId
      }
    });
  }

  /**
   * Find workspaces by blueprint
   *
   * @param {string} blueprintId - Blueprint ID
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Workspace[]>} Array of workspaces
   */
  findByBlueprint(blueprintId: string, options?: QueryOptions): Observable<Workspace[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId
      }
    });
  }

  /**
   * Find workspaces by status
   *
   * @param {string} status - Workspace status
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Workspace[]>} Array of workspaces
   */
  findByStatus(status: string, options?: QueryOptions): Observable<Workspace[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * Find active workspaces for tenant
   *
   * @param {string} tenantId - Tenant ID
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Workspace[]>} Array of active workspaces
   */
  findActiveByTenant(tenantId: string, options?: QueryOptions): Observable<Workspace[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        tenantId,
        status: 'active'
      }
    });
  }

  /**
   * Find archived workspaces for tenant
   *
   * @param {string} tenantId - Tenant ID
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Workspace[]>} Array of archived workspaces
   */
  findArchivedByTenant(tenantId: string, options?: QueryOptions): Observable<Workspace[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        tenantId,
        status: 'archived'
      }
    });
  }
}
