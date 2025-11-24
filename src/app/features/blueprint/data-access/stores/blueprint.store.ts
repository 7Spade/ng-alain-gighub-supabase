/**
 * Blueprint Store
 *
 * State management store for Blueprint feature
 * Acts as Facade layer providing unified API to components
 * Following vertical slice architecture
 *
 * @module features/blueprint/data-access/stores/blueprint.store
 */

import { Injectable, inject } from '@angular/core';
import { WorkspaceService, WorkspaceModel, CreateWorkspaceRequest } from '@shared';

import { BlueprintModel, CreateBlueprintRequest, UpdateBlueprintRequest } from '../../domain';
import { BlueprintService } from '../services';

/**
 * Blueprint Store (Facade)
 *
 * Provides unified API for Blueprint Container system
 * Integrates with Account Context (to be added later)
 */
@Injectable({ providedIn: 'root' })
export class BlueprintStore {
  private readonly blueprintService = inject(BlueprintService);
  private readonly workspaceService = inject(WorkspaceService);

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
  async instantiateWorkspace(
    blueprintId: string,
    name: string,
    tenantId: string,
    tenantType: 'user' | 'organization' | 'team'
  ): Promise<WorkspaceModel> {
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
