/**
 * Blueprint Feature Module
 *
 * Public API for Blueprint feature
 * Following vertical slice architecture
 *
 * This is the main entry point for the blueprint feature.
 * Only export what should be publicly accessible from outside the feature.
 *
 * @module features/blueprint
 */

// Routes
export { BLUEPRINT_ROUTES } from './blueprint.routes';

// Domain types and models (public types only)
export * from './domain';

// Shell components (public components only)
export { BlueprintShellComponent } from './shell';

// Dialog components (CRUD forms)
export {
  BlueprintFormDialogComponent,
  BlueprintFormDialogData,
  BlueprintFormMode,
  TaskFormDialogComponent,
  TaskFormDialogData,
  TaskFormMode,
  BlueprintDeleteConfirmDialogComponent,
  BlueprintDeleteConfirmDialogData,
  TaskDeleteConfirmDialogComponent,
  TaskDeleteConfirmDialogData
} from './shell';

// UI components (public components only)
export { TaskListComponent } from './ui';

// Stores (facade layer - main API for components)
export { BlueprintStore, TaskStore } from './data-access';
