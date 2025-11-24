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
 *
 * @module features/blueprint/shell/blueprint-shell/blueprint-shell.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';

import { BlueprintStore } from '../../data-access';

/**
 * Blueprint Shell Component
 *
 * Logical container for data isolation and context sharing
 * Skeleton implementation ready for context switcher integration
 */
@Component({
  selector: 'app-blueprint-shell',
  standalone: true,
  imports: [SHARED_IMPORTS, RouterOutlet],
  templateUrl: './blueprint-shell.component.html',
  styleUrl: './blueprint-shell.component.less'
})
export class BlueprintShellComponent implements OnInit {
  private readonly blueprintStore = inject(BlueprintStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Store state
  readonly blueprints = this.blueprintStore.blueprints;
  readonly selectedBlueprint = this.blueprintStore.selectedBlueprint;
  readonly loading = this.blueprintStore.blueprintLoading;
  readonly error = this.blueprintStore.blueprintError;

  // Local state
  readonly currentBlueprintId = signal<string | null>(null);

  ngOnInit(): void {
    // Get blueprint ID from route (placeholder)
    // In real implementation, get from route params or context switcher
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.currentBlueprintId.set(params['id']);
        this.loadBlueprint(params['id']);
      }
    });
  }

  /**
   * Load blueprint by ID
   */
  private async loadBlueprint(id: string): Promise<void> {
    try {
      await this.blueprintStore.getBlueprint(id);
    } catch (error) {
      console.error('Failed to load blueprint:', error);
    }
  }

  /**
   * Navigate to module
   */
  navigateToModule(module: string): void {
    this.router.navigate([module], { relativeTo: this.route });
  }
}
