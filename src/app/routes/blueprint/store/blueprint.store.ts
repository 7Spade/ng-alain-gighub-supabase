/**
 * Blueprint Store
 *
 * RxJS-based state management for Blueprint Module
 * Following Angular 20+ and enterprise development guidelines
 *
 * @module blueprint.store
 */

import { Injectable } from '@angular/core';
import { BlueprintModel } from '@shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlueprintAction, BlueprintActionType } from './blueprint.actions';
import { BlueprintState, initialBlueprintState, BlueprintFilters } from './blueprint.state';

/**
 * Blueprint Store Service
 *
 * Manages blueprint state using RxJS BehaviorSubject
 */
@Injectable({ providedIn: 'root' })
export class BlueprintStore {
  private readonly state$ = new BehaviorSubject<BlueprintState>(initialBlueprintState);

  /**
   * Observable selectors
   */
  readonly blueprints$: Observable<BlueprintModel[]> = this.state$.pipe(map(state => state.blueprints));
  readonly selectedBlueprintId$: Observable<string | null> = this.state$.pipe(map(state => state.selectedBlueprintId));
  readonly loading$: Observable<boolean> = this.state$.pipe(map(state => state.loading));
  readonly error$: Observable<string | null> = this.state$.pipe(map(state => state.error));
  readonly searchTerm$: Observable<string> = this.state$.pipe(map(state => state.searchTerm));
  readonly filters$: Observable<BlueprintFilters> = this.state$.pipe(map(state => state.filters));

  /**
   * Computed selectors
   */
  readonly selectedBlueprint$: Observable<BlueprintModel | null> = this.state$.pipe(
    map(state => {
      if (!state.selectedBlueprintId) return null;
      return state.blueprints.find(b => b.id === state.selectedBlueprintId) || null;
    })
  );

  readonly filteredBlueprints$: Observable<BlueprintModel[]> = this.state$.pipe(
    map(state => {
      let blueprints = state.blueprints;

      // Apply search term
      if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        blueprints = blueprints.filter(
          b =>
            b.name.toLowerCase().includes(term) ||
            b.description.toLowerCase().includes(term) ||
            b.tags.some(tag => tag.toLowerCase().includes(term))
        );
      }

      // Apply filters
      if (state.filters.status && state.filters.status.length > 0) {
        blueprints = blueprints.filter(b => state.filters.status!.includes(b.status));
      }

      if (state.filters.category && state.filters.category.length > 0) {
        blueprints = blueprints.filter(b => state.filters.category!.includes(b.category));
      }

      if (state.filters.visibility && state.filters.visibility.length > 0) {
        blueprints = blueprints.filter(b => state.filters.visibility!.includes(b.visibility));
      }

      if (state.filters.ownerId) {
        blueprints = blueprints.filter(b => b.ownerId === state.filters.ownerId);
      }

      return blueprints;
    })
  );

  /**
   * Get current state snapshot
   */
  getState(): BlueprintState {
    return this.state$.value;
  }

  /**
   * Dispatch action to update state
   */
  dispatch(action: BlueprintAction): void {
    const currentState = this.state$.value;
    const newState = this.reduce(currentState, action);
    this.state$.next(newState);
  }

  /**
   * Reducer function
   */
  private reduce(state: BlueprintState, action: BlueprintAction): BlueprintState {
    switch (action.type) {
      case BlueprintActionType.LOAD_BLUEPRINTS:
        return { ...state, loading: true, error: null };

      case BlueprintActionType.LOAD_BLUEPRINTS_SUCCESS:
        return { ...state, loading: false, blueprints: action.payload };

      case BlueprintActionType.LOAD_BLUEPRINTS_ERROR:
        return { ...state, loading: false, error: action.payload };

      case BlueprintActionType.SELECT_BLUEPRINT:
        return { ...state, selectedBlueprintId: action.payload };

      case BlueprintActionType.CLEAR_SELECTION:
        return { ...state, selectedBlueprintId: null };

      case BlueprintActionType.SET_SEARCH_TERM:
        return { ...state, searchTerm: action.payload };

      case BlueprintActionType.SET_FILTERS:
        return { ...state, filters: action.payload };

      case BlueprintActionType.CLEAR_ERROR:
        return { ...state, error: null };

      default:
        return state;
    }
  }
}
