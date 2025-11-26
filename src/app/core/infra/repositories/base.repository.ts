/**
 * Base Repository
 *
 * 基礎 Repository 類，提供通用的 CRUD 操作
 * Base Repository class providing generic CRUD operations
 *
 * Features:
 * - Generic CRUD operations (Create, Read, Update, Delete)
 * - snake_case ↔ camelCase automatic conversion
 * - Type-safe database operations
 * - RxJS Observable support
 * - Query options support (filters, sorting, pagination)
 * - Error handling
 *
 * @example
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class UserRepository extends BaseRepository<User, UserInsert, UserUpdate> {
 *   protected tableName = 'users';
 * }
 * ```
 */

import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { SupabaseService } from '../supabase/supabase.service';
import { QueryOptions } from '../types/supabase.types';

/**
 * 基礎 Repository 抽象類
 * Base Repository abstract class
 *
 * @template TEntity - Entity type (Row)
 * @template TInsert - Insert type
 * @template TUpdate - Update type
 */
@Injectable()
export abstract class BaseRepository<TEntity, TInsert, TUpdate> {
  protected readonly supabaseService = inject(SupabaseService);

  /**
   * 資料表名稱（必須在子類中定義）
   * Table name (must be defined in subclass)
   */
  protected abstract tableName: string;

  /**
   * 查詢所有記錄
   * Find all records
   *
   * @param {QueryOptions} [options] - Query options
   * @returns {Observable<TEntity[]>} Array of entities
   */
  findAll(options?: QueryOptions): Observable<TEntity[]> {
    const client = this.supabaseService.getClient();
    let query = client.from(this.tableName).select(options?.select || '*');

    // 應用過濾條件
    // Apply filters
    if (options?.filters) {
      query = this.applyFilters(query, options.filters);
    }

    // 應用排序
    // Apply sorting
    if (options?.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? true
      });
    }

    // 應用分頁
    // Apply pagination
    if (options?.limit !== undefined) {
      query = query.limit(options.limit);
    }
    if (options?.offset !== undefined) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        // Convert snake_case keys to camelCase for frontend
        return (data || []).map(item => this.convertKeysToCamelCase(item as unknown as Record<string, unknown>)) as TEntity[];
      }),
      catchError(error => {
        console.error(`Error in findAll for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 根據 ID 查詢單一記錄
   * Find single record by ID
   *
   * @param {string} id - Record ID
   * @param {string} [select] - Select clause
   * @returns {Observable<TEntity | null>} Entity or null
   */
  findById(id: string, select?: string): Observable<TEntity | null> {
    const client = this.supabaseService.getClient();

    return from(
      client
        .from(this.tableName)
        .select(select || '*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned
            return null;
          }
          throw error;
        }
        // Convert snake_case keys to camelCase for frontend
        return this.convertKeysToCamelCase(data as unknown as Record<string, unknown>) as TEntity;
      }),
      catchError(error => {
        console.error(`Error in findById for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 根據條件查詢單一記錄
   * Find single record by conditions
   *
   * @param {Record<string, any>} filters - Filter conditions
   * @param {string} [select] - Select clause
   * @returns {Observable<TEntity | null>} Entity or null
   */
  findOne(filters: Record<string, any>, select?: string): Observable<TEntity | null> {
    const client = this.supabaseService.getClient();
    let query = client.from(this.tableName).select(select || '*');

    // 應用過濾條件
    // Apply filters
    query = this.applyFilters(query, filters);

    return from(query.single()).pipe(
      map(({ data, error }) => {
        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned
            return null;
          }
          throw error;
        }
        // Convert snake_case keys to camelCase for frontend
        return this.convertKeysToCamelCase(data as unknown as Record<string, unknown>) as TEntity;
      }),
      catchError(error => {
        console.error(`Error in findOne for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 創建新記錄
   * Create new record
   *
   * @param {TInsert} data - Data to insert
   * @returns {Observable<TEntity>} Created entity
   */
  create(data: TInsert): Observable<TEntity> {
    const client = this.supabaseService.getClient();
    // Convert camelCase keys to snake_case for database
    const snakeCaseData = this.convertKeysToSnakeCase(data as Record<string, unknown>);

    return from(
      client
        .from(this.tableName)
        .insert(snakeCaseData as any)
        .select()
        .single()
    ).pipe(
      map(({ data: inserted, error }) => {
        if (error) {
          throw error;
        }
        // Convert snake_case keys back to camelCase for frontend
        return this.convertKeysToCamelCase(inserted as unknown as Record<string, unknown>) as TEntity;
      }),
      catchError(error => {
        console.error(`Error in create for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 批量創建記錄
   * Create multiple records
   *
   * @param {TInsert[]} data - Array of data to insert
   * @returns {Observable<TEntity[]>} Created entities
   */
  createMany(data: TInsert[]): Observable<TEntity[]> {
    const client = this.supabaseService.getClient();
    // Convert camelCase keys to snake_case for database
    const snakeCaseData = data.map(item => this.convertKeysToSnakeCase(item as Record<string, unknown>));

    return from(
      client
        .from(this.tableName)
        .insert(snakeCaseData as any[])
        .select()
    ).pipe(
      map(({ data: inserted, error }) => {
        if (error) {
          throw error;
        }
        // Convert snake_case keys back to camelCase for frontend
        return (inserted || []).map(item => this.convertKeysToCamelCase(item as unknown as Record<string, unknown>)) as TEntity[];
      }),
      catchError(error => {
        console.error(`Error in createMany for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 更新記錄
   * Update record
   *
   * @param {string} id - Record ID
   * @param {TUpdate} data - Data to update
   * @returns {Observable<TEntity>} Updated entity
   */
  update(id: string, data: TUpdate): Observable<TEntity> {
    const client = this.supabaseService.getClient();
    // Convert camelCase keys to snake_case for database
    const snakeCaseData = this.convertKeysToSnakeCase(data as Record<string, unknown>);

    return from(
      client
        .from(this.tableName)
        .update(snakeCaseData as any)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data: updated, error }) => {
        if (error) {
          throw error;
        }
        // Convert snake_case keys back to camelCase for frontend
        return this.convertKeysToCamelCase(updated as unknown as Record<string, unknown>) as TEntity;
      }),
      catchError(error => {
        console.error(`Error in update for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 根據條件更新記錄
   * Update records by conditions
   *
   * @param {Record<string, any>} filters - Filter conditions
   * @param {TUpdate} data - Data to update
   * @returns {Observable<TEntity[]>} Updated entities
   */
  updateBy(filters: Record<string, any>, data: TUpdate): Observable<TEntity[]> {
    const client = this.supabaseService.getClient();
    // Convert camelCase keys to snake_case for database
    const snakeCaseData = this.convertKeysToSnakeCase(data as Record<string, unknown>);
    let query = client.from(this.tableName).update(snakeCaseData as any);

    // 應用過濾條件
    // Apply filters
    query = this.applyFilters(query, filters);

    return from(query.select()).pipe(
      map(({ data: updated, error }) => {
        if (error) {
          throw error;
        }
        // Convert snake_case keys back to camelCase for frontend
        return (updated || []).map(item => this.convertKeysToCamelCase(item as unknown as Record<string, unknown>)) as TEntity[];
      }),
      catchError(error => {
        console.error(`Error in updateBy for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 刪除記錄
   * Delete record
   *
   * @param {string} id - Record ID
   * @returns {Observable<void>} Void
   */
  delete(id: string): Observable<void> {
    const client = this.supabaseService.getClient();

    return from(client.from(this.tableName).delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
      }),
      catchError(error => {
        console.error(`Error in delete for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 根據條件刪除記錄
   * Delete records by conditions
   *
   * @param {Record<string, any>} filters - Filter conditions
   * @returns {Observable<void>} Void
   */
  deleteBy(filters: Record<string, any>): Observable<void> {
    const client = this.supabaseService.getClient();
    let query = client.from(this.tableName).delete();

    // 應用過濾條件
    // Apply filters
    query = this.applyFilters(query, filters);

    return from(query).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
      }),
      catchError(error => {
        console.error(`Error in deleteBy for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 計數記錄數量
   * Count records
   *
   * @param {Record<string, any>} [filters] - Filter conditions
   * @returns {Observable<number>} Record count
   */
  count(filters?: Record<string, any>): Observable<number> {
    const client = this.supabaseService.getClient();
    let query = client.from(this.tableName).select('*', { count: 'exact', head: true });

    // 應用過濾條件
    // Apply filters
    if (filters) {
      query = this.applyFilters(query, filters);
    }

    return from(query).pipe(
      map(({ count, error }) => {
        if (error) {
          throw error;
        }
        return count || 0;
      }),
      catchError(error => {
        console.error(`Error in count for ${this.tableName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 應用過濾條件到查詢
   * Apply filters to query
   *
   * @private
   * @param {any} query - Query builder
   * @param {Record<string, any>} filters - Filter conditions
   * @returns {any} Modified query
   */
  private applyFilters(query: any, filters: Record<string, any>): any {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // 將 camelCase 轉換為 snake_case
        // Convert camelCase to snake_case
        const snakeKey = this.toSnakeCase(key);

        if (Array.isArray(value)) {
          query = query.in(snakeKey, value);
        } else {
          query = query.eq(snakeKey, value);
        }
      }
    });
    return query;
  }

  /**
   * 將 camelCase 轉換為 snake_case
   * Convert camelCase to snake_case
   *
   * @private
   * @param {string} str - String to convert
   * @returns {string} Converted string
   */
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * 將 snake_case 轉換為 camelCase
   * Convert snake_case to camelCase
   *
   * @private
   * @param {string} str - String to convert
   * @returns {string} Converted string
   */
  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * JSONB 欄位列表（這些欄位不需要轉換內部 key，因為它們是 PostgreSQL JSONB 類型）
   * List of JSONB column names that should NOT have their nested keys converted
   */
  private readonly jsonbColumns = ['structure', 'metadata', 'settings', 'config', 'data'];

  /**
   * 將對象的所有 key 從 camelCase 轉換為 snake_case
   * Convert all keys in an object from camelCase to snake_case
   *
   * 注意：JSONB 欄位（如 structure）的內部 key 不會被轉換，因為 PostgreSQL 會原樣存儲
   *
   * @private
   * @param {Record<string, unknown>} obj - Object to convert
   * @returns {Record<string, unknown>} Converted object
   */
  private convertKeysToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = this.toSnakeCase(key);

      // Check if this is a JSONB column - if so, don't convert nested keys
      if (this.jsonbColumns.includes(key) || this.jsonbColumns.includes(snakeKey)) {
        // Keep JSONB columns as-is (don't convert nested keys)
        result[snakeKey] = value;
      } else if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        // Recursively convert nested objects (but not JSONB columns)
        result[snakeKey] = this.convertKeysToSnakeCase(value as Record<string, unknown>);
      } else {
        result[snakeKey] = value;
      }
    }
    return result;
  }

  /**
   * 將對象的所有 key 從 snake_case 轉換為 camelCase
   * Convert all keys in an object from snake_case to camelCase
   *
   * @private
   * @param {Record<string, unknown>} obj - Object to convert
   * @returns {Record<string, unknown>} Converted object
   */
  private convertKeysToCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = this.toCamelCase(key);
      // Recursively convert nested objects, but not arrays or primitives
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[camelKey] = this.convertKeysToCamelCase(value as Record<string, unknown>);
      } else {
        result[camelKey] = value;
      }
    }
    return result;
  }
}
