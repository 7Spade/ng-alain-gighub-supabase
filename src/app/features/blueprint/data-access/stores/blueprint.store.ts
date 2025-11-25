/**
 * Blueprint Store
 *
 * State management store for Blueprint feature
 * Acts as Facade layer providing unified API to components
 * Following vertical slice architecture
 *
 * Integrates with WorkspaceContextFacade for context-aware operations
 *
 * @module features/blueprint/data-access/stores/blueprint.store
 */

import { Injectable, computed, inject } from '@angular/core';
import { WorkspaceContextFacade, ContextType } from '@core';

import {
  BlueprintModel,
  CreateBlueprintRequest,
  UpdateBlueprintRequest,
  WorkspaceModel,
  CreateWorkspaceRequest,
  TenantType,
  OwnerType
} from '../../domain';
import { BlueprintService, WorkspaceService } from '../services';

/**
 * Blueprint Store (Facade)
 *
 * Provides unified API for Blueprint Container system
 * Integrates with WorkspaceContextFacade for context-aware operations
 *
 * Following vertical slice architecture pattern:
 * - Feature Stores are Feature-internal Facades
 * - Can integrate with Core Facades like WorkspaceContextFacade
 */
@Injectable({ providedIn: 'root' })
export class BlueprintStore {
  private readonly blueprintService = inject(BlueprintService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly workspaceContext = inject(WorkspaceContextFacade);

  // Expose Blueprint Service state
  readonly blueprints = this.blueprintService.blueprints;
  readonly selectedBlueprint = this.blueprintService.selectedBlueprint;
  readonly blueprintLoading = this.blueprintService.loading;
  readonly blueprintError = this.blueprintService.error;
  readonly blueprintStatistics = this.blueprintService.statistics;

  // Expose Workspace Service state
  readonly workspaces = this.workspaceService.workspaces;
  readonly selectedWorkspace = this.workspaceService.selectedWorkspace;
  readonly workspaceLoading = this.workspaceService.loading;
  readonly workspaceError = this.workspaceService.error;
  readonly workspaceStatistics = this.workspaceService.statistics;

  // Computed signals (shortcuts)
  readonly publishedBlueprints = this.blueprintService.publishedBlueprints;
  readonly draftBlueprints = this.blueprintService.draftBlueprints;
  readonly activeWorkspaces = this.workspaceService.activeWorkspaces;
  readonly archivedWorkspaces = this.workspaceService.archivedWorkspaces;

  // Context-aware computed signals
  readonly currentContextId = this.workspaceContext.contextId;
  readonly currentContextType = this.workspaceContext.contextType;
  readonly hasValidContext = this.workspaceContext.hasValidContext;

  // Combined loading state
  readonly loading = computed(() => this.blueprintLoading() || this.workspaceLoading());

  // Combined error state
  readonly error = computed(() => this.blueprintError() || this.workspaceError());

  // ============================================================================
  // Context-Aware Methods (新增：上下文感知方法)
  // ============================================================================

  /**
   * Load blueprints for current context (自動使用當前上下文)
   * Automatically uses the current context ID from WorkspaceContextFacade
   */
  async loadCurrentContextBlueprints(): Promise<void> {
    const contextId = this.currentContextId();
    const contextType = this.currentContextType();

    if (!contextId || contextType === ContextType.APP) {
      console.warn('[BlueprintStore] No valid context, skipping blueprint load');
      return;
    }

    await this.blueprintService.loadBlueprintsByOwner(contextId);
  }

  /**
   * Load workspaces for current context (自動使用當前上下文)
   * Automatically uses the current context ID from WorkspaceContextFacade
   */
  async loadCurrentContextWorkspaces(): Promise<void> {
    const contextId = this.currentContextId();
    const contextType = this.currentContextType();

    if (!contextId || contextType === ContextType.APP) {
      console.warn('[BlueprintStore] No valid context, skipping workspace load');
      return;
    }

    await this.workspaceService.loadWorkspacesByTenant(contextId);
  }

  /**
   * Load all data for current context (藍圖 + 工作區)
   * Convenience method to load both blueprints and workspaces
   */
  async loadCurrentContextData(): Promise<void> {
    const contextId = this.currentContextId();
    const contextType = this.currentContextType();

    if (!contextId || contextType === ContextType.APP) {
      console.warn('[BlueprintStore] No valid context, skipping data load');
      return;
    }

    await Promise.all([this.loadCurrentContextBlueprints(), this.loadCurrentContextWorkspaces()]);
  }

  /**
   * Create blueprint in current context (自動填充 owner 資訊)
   * Automatically fills in owner information from current context
   */
  async createBlueprintInCurrentContext(request: Omit<CreateBlueprintRequest, 'ownerId' | 'ownerType'>): Promise<BlueprintModel | null> {
    const contextId = this.currentContextId();
    const contextType = this.currentContextType();

    if (!contextId || contextType === ContextType.APP) {
      console.error('[BlueprintStore] Cannot create blueprint without valid context');
      return null;
    }

    const ownerType = this.mapContextTypeToOwnerType(contextType);
    const fullRequest: CreateBlueprintRequest = {
      ...request,
      ownerId: contextId,
      ownerType
    };

    return this.blueprintService.createBlueprint(fullRequest);
  }

  /**
   * Map ContextType to OwnerType
   * @private
   */
  private mapContextTypeToOwnerType(contextType: ContextType): OwnerType {
    switch (contextType) {
      case ContextType.USER:
        return 'user';
      case ContextType.ORGANIZATION:
        return 'organization';
      case ContextType.TEAM:
        return 'team';
      default:
        return 'user';
    }
  }

  // ============================================================================
  // Original Methods (保留原有方法)
  // ============================================================================

  /**
   * Load blueprints by owner (Account Context aware)
   */
  async loadOwnerBlueprints(ownerId: string): Promise<void> {
    await this.blueprintService.loadBlueprintsByOwner(ownerId);
  }

  /**
   * Load public blueprints (marketplace)
   */
  async loadMarketplaceBlueprints(): Promise<void> {
    await this.blueprintService.loadPublicBlueprints();
  }

  /**
   * Load workspaces for tenant (Account Context aware)
   */
  async loadTenantWorkspaces(tenantId: string): Promise<void> {
    await this.workspaceService.loadWorkspacesByTenant(tenantId);
  }

  /**
   * Load active workspaces for tenant
   */
  async loadActiveTenantWorkspaces(tenantId: string): Promise<void> {
    await this.workspaceService.loadActiveWorkspaces(tenantId);
  }

  /**
   * Get blueprint by ID
   */
  async getBlueprint(id: string): Promise<BlueprintModel> {
    return this.blueprintService.getBlueprintById(id);
  }

  /**
   * Get workspace by ID
   */
  async getWorkspace(id: string): Promise<WorkspaceModel> {
    return this.workspaceService.getWorkspaceById(id);
  }

  /**
   * Create new blueprint
   */
  async createBlueprint(request: CreateBlueprintRequest): Promise<BlueprintModel> {
    return this.blueprintService.createBlueprint(request);
  }

  /**
   * Update blueprint
   */
  async updateBlueprint(id: string, request: UpdateBlueprintRequest): Promise<BlueprintModel> {
    return this.blueprintService.updateBlueprint(id, request);
  }

  /**
   * Delete blueprint
   */
  async deleteBlueprint(id: string): Promise<void> {
    return this.blueprintService.deleteBlueprint(id);
  }

  /**
   * Publish blueprint
   */
  async publishBlueprint(id: string): Promise<BlueprintModel> {
    return this.blueprintService.publishBlueprint(id);
  }

  /**
   * Archive blueprint
   */
  async archiveBlueprint(id: string): Promise<BlueprintModel> {
    return this.blueprintService.archiveBlueprint(id);
  }

  /**
   * Create workspace (standalone)
   */
  async createWorkspace(request: CreateWorkspaceRequest): Promise<WorkspaceModel> {
    return this.workspaceService.createWorkspace(request);
  }

  /**
   * Create workspace from blueprint (instantiation)
   */
  async instantiateWorkspace(blueprintId: string, name: string, tenantId: string, tenantType: TenantType): Promise<WorkspaceModel> {
    return this.workspaceService.createWorkspaceFromBlueprint(blueprintId, name, tenantId, tenantType);
  }

  /**
   * Update workspace
   */
  async updateWorkspace(id: string, updates: { name?: string; description?: string }): Promise<WorkspaceModel> {
    return this.workspaceService.updateWorkspace(id, updates);
  }

  /**
   * Delete workspace
   */
  async deleteWorkspace(id: string): Promise<void> {
    return this.workspaceService.deleteWorkspace(id);
  }

  /**
   * Archive workspace
   */
  async archiveWorkspace(id: string): Promise<WorkspaceModel> {
    return this.workspaceService.archiveWorkspace(id);
  }

  /**
   * Activate workspace
   */
  async activateWorkspace(id: string): Promise<WorkspaceModel> {
    return this.workspaceService.activateWorkspace(id);
  }

  /**
   * Search blueprints
   */
  async searchBlueprints(searchTerm: string): Promise<BlueprintModel[]> {
    return this.blueprintService.searchBlueprints(searchTerm);
  }

  /**
   * Clear blueprint error
   */
  clearBlueprintError(): void {
    this.blueprintService.clearError();
  }

  /**
   * Clear workspace error
   */
  clearWorkspaceError(): void {
    this.workspaceService.clearError();
  }

  /**
   * Clear all errors
   */
  clearAllErrors(): void {
    this.blueprintService.clearError();
    this.workspaceService.clearError();
  }

  /**
   * Clear blueprint selection
   */
  clearBlueprintSelection(): void {
    this.blueprintService.clearSelection();
  }

  /**
   * Clear workspace selection
   */
  clearWorkspaceSelection(): void {
    this.workspaceService.clearSelection();
  }
}
