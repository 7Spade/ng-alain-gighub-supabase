/**
 * Workspace Service
 *
 * Business logic for Workspace management
 * Following vertical slice architecture
 *
 * Uses Angular Signals for reactive state management
 *
 * @module features/blueprint/data-access/services/workspace.service
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  WorkspaceModel,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceStatistics,
  WorkspaceStatusEnum,
  TenantType
} from '../../domain';
import { WorkspaceRepository, BlueprintRepository } from '../repositories';

/**
 * Workspace Service
 *
 * Manages workspace state and business logic with Signals
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private readonly workspaceRepo = inject(WorkspaceRepository);
  private readonly blueprintRepo = inject(BlueprintRepository);

  // State management with Signals
  private workspacesState = signal<WorkspaceModel[]>([]);
  private selectedWorkspaceState = signal<WorkspaceModel | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Expose ReadonlySignal to components
  readonly workspaces = this.workspacesState.asReadonly();
  readonly selectedWorkspace = this.selectedWorkspaceState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals for derived state
  readonly activeWorkspaces = computed(() => this.workspaces().filter(w => w.status === WorkspaceStatusEnum.ACTIVE));

  readonly archivedWorkspaces = computed(() => this.workspaces().filter(w => w.status === WorkspaceStatusEnum.ARCHIVED));

  readonly templateWorkspaces = computed(() => this.workspaces().filter(w => w.status === WorkspaceStatusEnum.TEMPLATE));

  readonly statistics = computed<WorkspaceStatistics>(() => {
    const workspaces = this.workspaces();

    return {
      totalCount: workspaces.length,
      activeCount: workspaces.filter(w => w.status === WorkspaceStatusEnum.ACTIVE).length,
      archivedCount: workspaces.filter(w => w.status === WorkspaceStatusEnum.ARCHIVED).length,
      templateCount: workspaces.filter(w => w.status === WorkspaceStatusEnum.TEMPLATE).length,
      totalMemberCount: 0 // Would require joining with members table
    };
  });

  /**
   * Load workspaces by tenant
   */
  async loadWorkspacesByTenant(tenantId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const workspaces = await firstValueFrom(this.workspaceRepo.findByTenant(tenantId));
      this.workspacesState.set(workspaces);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load workspaces');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Load active workspaces for tenant
   */
  async loadActiveWorkspaces(tenantId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const workspaces = await firstValueFrom(this.workspaceRepo.findActiveByTenant(tenantId));
      this.workspacesState.set(workspaces);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load active workspaces');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Get workspace by ID
   */
  async getWorkspaceById(id: string): Promise<WorkspaceModel> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const workspace = await firstValueFrom(this.workspaceRepo.findById(id));
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      this.selectedWorkspaceState.set(workspace);
      return workspace;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load workspace');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Create new workspace
   */
  async createWorkspace(request: CreateWorkspaceRequest): Promise<WorkspaceModel> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const workspaceInsert = {
        name: request.name,
        description: request.description,
        blueprintId: request.blueprintId,
        tenantId: request.tenantId,
        tenantType: request.tenantType,
        status: 'active' as const,
        settings: {
          allowGuestAccess: false,
          requireApprovalForJoin: true,
          defaultMemberRole: 'member' as const,
          enableTaskComments: true,
          enableFileSharing: true,
          enableNotifications: true
        }
      };

      const newWorkspace = await firstValueFrom(this.workspaceRepo.create(workspaceInsert));

      // Update state
      this.workspacesState.update(workspaces => [...workspaces, newWorkspace]);

      return newWorkspace;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to create workspace');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Create workspace from blueprint (instantiation)
   */
  async createWorkspaceFromBlueprint(blueprintId: string, name: string, tenantId: string, tenantType: TenantType): Promise<WorkspaceModel> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // Get blueprint
      const blueprint = await firstValueFrom(this.blueprintRepo.findById(blueprintId));
      if (!blueprint) {
        throw new Error('Blueprint not found');
      }

      // Create workspace with blueprint settings
      const workspaceInsert = {
        name,
        blueprintId,
        blueprintVersion: blueprint.version,
        tenantId,
        tenantType,
        status: 'active' as const,
        settings: blueprint.structure.settings
      };

      const newWorkspace = await firstValueFrom(this.workspaceRepo.create(workspaceInsert));

      // Update state
      this.workspacesState.update(workspaces => [...workspaces, newWorkspace]);

      return newWorkspace;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to create workspace from blueprint');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Update workspace
   */
  async updateWorkspace(id: string, request: UpdateWorkspaceRequest): Promise<WorkspaceModel> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updatedWorkspace = await firstValueFrom(this.workspaceRepo.update(id, request));

      // Update state
      this.workspacesState.update(workspaces => workspaces.map(w => (w.id === id ? updatedWorkspace : w)));

      if (this.selectedWorkspace()?.id === id) {
        this.selectedWorkspaceState.set(updatedWorkspace);
      }

      return updatedWorkspace;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to update workspace');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Delete workspace
   */
  async deleteWorkspace(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.workspaceRepo.delete(id));

      // Update state
      this.workspacesState.update(workspaces => workspaces.filter(w => w.id !== id));

      if (this.selectedWorkspace()?.id === id) {
        this.selectedWorkspaceState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to delete workspace');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Archive workspace
   */
  async archiveWorkspace(id: string): Promise<WorkspaceModel> {
    return this.updateWorkspace(id, { status: WorkspaceStatusEnum.ARCHIVED });
  }

  /**
   * Activate workspace
   */
  async activateWorkspace(id: string): Promise<WorkspaceModel> {
    return this.updateWorkspace(id, { status: WorkspaceStatusEnum.ACTIVE });
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedWorkspaceState.set(null);
  }
}
