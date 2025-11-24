/**
 * Task Repository
 *
 * Repository for Task data access layer
 * Supporting unlimited depth tree operations
 * Following docs/00-順序.md Step 2: Repositories 層
 *
 * @module task.repository
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository } from './base.repository';
import { QueryOptions } from '../types/supabase.types';
import { Task, TaskInsert, TaskUpdate } from '../types/task.types';

/**
 * Task Repository
 *
 * Handles data access for tasks with tree structure support
 */
@Injectable({ providedIn: 'root' })
export class TaskRepository extends BaseRepository<Task, TaskInsert, TaskUpdate> {
  protected tableName = 'tasks';

  /**
   * Find tasks by workspace
   *
   * @param {string} workspaceId - Workspace ID
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of tasks ordered by path
   */
  findByWorkspace(workspaceId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        workspaceId
      },
      order: {
        column: 'path',
        ascending: true
      }
    });
  }

  /**
   * Find tasks by parent
   *
   * @param {string} parentId - Parent task ID
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of child tasks
   */
  findByParent(parentId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        parentId
      },
      order: {
        column: 'position',
        ascending: true
      }
    });
  }

  /**
   * Find root tasks (L0)
   *
   * @param {string} workspaceId - Workspace ID
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of root tasks
   */
  findRootTasks(workspaceId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        workspaceId,
        parentId: null
      },
      order: {
        column: 'position',
        ascending: true
      }
    });
  }

  /**
   * Find tasks by depth (level)
   *
   * @param {string} workspaceId - Workspace ID
   * @param {number} depth - Tree depth (0 for L0, 1 for L1, etc.)
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of tasks at specified depth
   */
  findByDepth(workspaceId: string, depth: number, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        workspaceId,
        depth
      }
    });
  }

  /**
   * Find tasks by status
   *
   * @param {string} workspaceId - Workspace ID
   * @param {string} status - Task status
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of tasks with specified status
   */
  findByStatus(workspaceId: string, status: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        workspaceId,
        status
      }
    });
  }

  /**
   * Find tasks by assignee
   *
   * @param {string} assigneeId - Assignee ID
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of assigned tasks
   */
  findByAssignee(assigneeId: string, options?: QueryOptions): Observable<Task[]> {
    // Note: This requires array contains query
    // Actual implementation depends on Supabase query capabilities
    return this.findAll({
      ...options
      // TODO: Add array contains filter when BaseRepository supports it
    });
  }

  /**
   * Find tasks by area
   *
   * @param {string} workspaceId - Workspace ID
   * @param {string} area - Area name
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of tasks in specified area
   */
  findByArea(workspaceId: string, area: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        workspaceId,
        area
      }
    });
  }

  /**
   * Find tasks by tags
   *
   * @param {string} workspaceId - Workspace ID
   * @param {string[]} tags - Tags to filter by
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<Task[]>} Array of tasks with specified tags
   */
  findByTags(workspaceId: string, tags: string[], options?: QueryOptions): Observable<Task[]> {
    // Note: This requires array contains query
    // Actual implementation depends on Supabase query capabilities
    return this.findAll({
      ...options
      // TODO: Add array contains filter when BaseRepository supports it
    });
  }
}
