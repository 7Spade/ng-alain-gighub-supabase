/**
 * Blueprint Container Component
 *
 * Main container for Blueprint (邏輯容器)
 * Provides context isolation and data sharing
 * Following docs/00-順序.md Component layer standards
 *
 * Purpose:
 * - Data isolation (隔離資料)
 * - Context provision (提供 Context)
 * - Shared context for all modules within blueprint
 *
 * @module blueprint-container.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintFacade } from '@core';
import { SHARED_IMPORTS } from '@shared';

/**
 * Blueprint Container Component
 *
 * Logical container for data isolation and context sharing
 * Skeleton implementation ready for context switcher integration
 */
@Component({
  selector: 'app-blueprint-container',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './blueprint-container.component.html',
  styleUrl: './blueprint-container.component.less'
})
export class BlueprintContainerComponent implements OnInit {
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Facade state
  readonly blueprints = this.blueprintFacade.blueprints;
  readonly selectedBlueprint = this.blueprintFacade.selectedBlueprint;
  readonly loading = this.blueprintFacade.blueprintLoading;
  readonly error = this.blueprintFacade.blueprintError;

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
      await this.blueprintFacade.getBlueprint(id);
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
