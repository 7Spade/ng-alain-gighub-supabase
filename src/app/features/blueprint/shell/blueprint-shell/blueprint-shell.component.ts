/**
 * Blueprint Shell Component
 *
 * Main container for Blueprint (邏輯容器)
 * Provides context isolation and data sharing
 * Following vertical slice architecture
 *
 * Purpose:
 * - Data isolation (隔離資料)
 * - Context provision (提供 Context)
 * - Shared context for all modules within blueprint
 * - Integration with WorkspaceContextFacade for context switching
 *
 * @module features/blueprint/shell/blueprint-shell/blueprint-shell.component
 */

import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { WorkspaceContextFacade, ContextType } from '@core';
import { SHARED_IMPORTS } from '@shared';

import { BlueprintStore } from '../../data-access';

/**
 * Blueprint Shell Component
 *
 * Logical container for data isolation and context sharing
 * Integrated with WorkspaceContextFacade for context switching
 *
 * Following vertical slice architecture pattern:
 * - Shell Component can inject both Feature Store and Core Facade
 * - Provides context to child components
 * - Handles context switching and data reloading
 */
@Component({
  selector: 'app-blueprint-shell',
  standalone: true,
  imports: [SHARED_IMPORTS, RouterOutlet],
  templateUrl: './blueprint-shell.component.html',
  styleUrl: './blueprint-shell.component.less'
})
export class BlueprintShellComponent implements OnInit {
  // Core Facade for context switching
  private readonly workspaceContext = inject(WorkspaceContextFacade);

  // Feature Store for blueprint data
  private readonly blueprintStore = inject(BlueprintStore);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Expose ContextType enum to template
  readonly ContextType = ContextType;

  // Store state
  readonly blueprints = this.blueprintStore.blueprints;
  readonly selectedBlueprint = this.blueprintStore.selectedBlueprint;
  readonly loading = this.blueprintStore.blueprintLoading;
  readonly error = this.blueprintStore.blueprintError;

  // Context state from WorkspaceContextFacade
  readonly contextType = this.workspaceContext.contextType;
  readonly contextId = this.workspaceContext.contextId;
  readonly contextLabel = this.workspaceContext.contextLabel;
  readonly contextIcon = this.workspaceContext.contextIcon;
  readonly switching = this.workspaceContext.switching;

  // Local state
  readonly currentBlueprintId = signal<string | null>(null);
  private readonly initialized = signal(false);

  // Computed signals for UI
  readonly hasValidContext = computed(() => {
    const type = this.contextType();
    const id = this.contextId();
    return type !== ContextType.APP && !!id;
  });

  readonly contextTagColor = computed(() => {
    const type = this.contextType();
    switch (type) {
      case ContextType.USER:
        return 'blue';
      case ContextType.ORGANIZATION:
        return 'green';
      case ContextType.TEAM:
        return 'orange';
      case ContextType.BOT:
        return 'purple';
      default:
        return 'default';
    }
  });

  readonly contextTypeLabel = computed(() => {
    const type = this.contextType();
    switch (type) {
      case ContextType.USER:
        return '個人帳戶';
      case ContextType.ORGANIZATION:
        return '組織';
      case ContextType.TEAM:
        return '團隊';
      case ContextType.BOT:
        return '機器人';
      default:
        return '應用';
    }
  });

  constructor() {
    // Watch for context changes and reload data
    effect(() => {
      const contextType = this.contextType();
      const contextId = this.contextId();

      // Skip if not initialized or invalid context
      if (!this.initialized() || contextType === ContextType.APP || !contextId) {
        return;
      }

      // Load data for the current context
      console.log(`[BlueprintShell] Context changed: ${contextType} - ${contextId}`);
      this.loadDataForContext(contextId);
    });
  }

  ngOnInit(): void {
    this.initialized.set(true);

    // Get blueprint ID from route if available
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.currentBlueprintId.set(params['id']);
        this.loadBlueprint(params['id']);
      }
    });

    // Initial load if context is valid
    if (this.hasValidContext()) {
      const contextId = this.contextId();
      if (contextId) {
        this.loadDataForContext(contextId);
      }
    }
  }

  /**
   * Load data for the current context
   * Called when context changes or on initial load
   */
  private async loadDataForContext(contextId: string): Promise<void> {
    try {
      // Load blueprints owned by the current context
      await this.blueprintStore.loadOwnerBlueprints(contextId);

      // Load workspaces for the current tenant
      await this.blueprintStore.loadTenantWorkspaces(contextId);
    } catch (error) {
      console.error('[BlueprintShell] Failed to load data for context:', error);
    }
  }

  /**
   * Load blueprint by ID
   */
  private async loadBlueprint(id: string): Promise<void> {
    try {
      await this.blueprintStore.getBlueprint(id);
    } catch (error) {
      console.error('[BlueprintShell] Failed to load blueprint:', error);
    }
  }

  /**
   * Navigate to module
   */
  navigateToModule(module: string): void {
    this.router.navigate([module], { relativeTo: this.route });
  }

  /**
   * Navigate to account selection page
   */
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
}
