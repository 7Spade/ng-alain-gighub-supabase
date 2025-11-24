/**
 * Base Account CRUD Facade
 *
 * 帳戶 CRUD 基礎門面（Core 層）
 * Base facade for account CRUD operations (Core layer)
 *
 * Provides common CRUD logic for all account types (User, Organization, Team, Bot).
 * Reduces code duplication by abstracting common patterns.
 *
 * @module core/facades/account
 */

import { inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { WorkspaceDataService, ErrorHandlerService } from '@shared';

/**
 * 基礎帳戶 CRUD 門面抽象類別
 * Base Account CRUD Facade abstract class
 *
 * @template TModel - Business model type
 * @template TCreateRequest - Create request type
 * @template TUpdateRequest - Update request type
 */
export abstract class BaseAccountCrudFacade<TModel, TCreateRequest, TUpdateRequest> {
  protected readonly dataService = inject(WorkspaceDataService);
  protected readonly tokenService = inject(DA_SERVICE_TOKEN);
  protected readonly errorHandler = inject(ErrorHandlerService);

  /**
   * 執行創建操作的通用邏輯
   * Execute create operation with common logic
   *
   * @param {TCreateRequest} request - Create request
   * @param {(request: TCreateRequest) => Promise<TModel>} serviceMethod - Service method to call
   * @param {string} entityName - Entity name for error messages
   * @returns {Promise<TModel>} Created entity
   * @throws {Error} User-friendly error message
   */
  protected async executeCreate(
    request: TCreateRequest,
    serviceMethod: (request: TCreateRequest) => Promise<TModel>,
    entityName: string
  ): Promise<TModel> {
    try {
      const entity = await serviceMethod(request);
      await this.reloadWorkspaceData();
      return entity;
    } catch (error) {
      const errorMessage = this.errorHandler.getErrorMessage(error, 'create', entityName);
      this.errorHandler.logError(this.constructor.name, `create ${entityName}`, error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 執行更新操作的通用邏輯
   * Execute update operation with common logic
   *
   * @param {string} id - Entity ID
   * @param {TUpdateRequest} request - Update request
   * @param {(id: string, request: TUpdateRequest) => Promise<TModel>} serviceMethod - Service method to call
   * @param {string} entityName - Entity name for error messages
   * @returns {Promise<TModel>} Updated entity
   * @throws {Error} User-friendly error message
   */
  protected async executeUpdate(
    id: string,
    request: TUpdateRequest,
    serviceMethod: (id: string, request: TUpdateRequest) => Promise<TModel>,
    entityName: string
  ): Promise<TModel> {
    try {
      const entity = await serviceMethod(id, request);
      await this.reloadWorkspaceData();
      return entity;
    } catch (error) {
      const errorMessage = this.errorHandler.getErrorMessage(error, 'update', entityName);
      this.errorHandler.logError(this.constructor.name, `update ${entityName}`, error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 執行刪除操作的通用邏輯
   * Execute delete operation with common logic
   *
   * @param {string} id - Entity ID
   * @param {(id: string) => Promise<TModel>} serviceMethod - Service method to call
   * @param {string} entityName - Entity name for error messages
   * @returns {Promise<TModel>} Deleted entity
   * @throws {Error} User-friendly error message
   */
  protected async executeDelete(id: string, serviceMethod: (id: string) => Promise<TModel>, entityName: string): Promise<TModel> {
    try {
      const entity = await serviceMethod(id);
      await this.reloadWorkspaceData();
      return entity;
    } catch (error) {
      const errorMessage = this.errorHandler.getErrorMessage(error, 'delete', entityName);
      this.errorHandler.logError(this.constructor.name, `delete ${entityName}`, error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 重新載入工作區數據
   * Reload workspace data
   *
   * @protected
   * @returns {Promise<void>}
   */
  protected async reloadWorkspaceData(): Promise<void> {
    const token = this.tokenService.get();
    if (token?.['user']?.['id']) {
      await this.dataService.loadWorkspaceData(token['user']['id']);
    }
  }
}
