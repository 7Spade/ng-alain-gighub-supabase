/**
 * Blueprint Actions
 *
 * Action definitions for Blueprint Module
 * Following Angular 20+ and enterprise development guidelines
 *
 * @module blueprint.actions
 */

import { BlueprintModel } from '@shared';

import { BlueprintFilters } from './blueprint.state';

/**
 * Blueprint action types
 */
export enum BlueprintActionType {
  LOAD_BLUEPRINTS = '[Blueprint] Load Blueprints',
  LOAD_BLUEPRINTS_SUCCESS = '[Blueprint] Load Blueprints Success',
  LOAD_BLUEPRINTS_ERROR = '[Blueprint] Load Blueprints Error',

  SELECT_BLUEPRINT = '[Blueprint] Select Blueprint',
  CLEAR_SELECTION = '[Blueprint] Clear Selection',

  SET_SEARCH_TERM = '[Blueprint] Set Search Term',
  SET_FILTERS = '[Blueprint] Set Filters',

  CLEAR_ERROR = '[Blueprint] Clear Error'
}

/**
 * Blueprint actions
 */
export type BlueprintAction =
  | LoadBlueprintsAction
  | LoadBlueprintsSuccessAction
  | LoadBlueprintsErrorAction
  | SelectBlueprintAction
  | ClearSelectionAction
  | SetSearchTermAction
  | SetFiltersAction
  | ClearErrorAction;

export interface LoadBlueprintsAction {
  type: BlueprintActionType.LOAD_BLUEPRINTS;
}

export interface LoadBlueprintsSuccessAction {
  type: BlueprintActionType.LOAD_BLUEPRINTS_SUCCESS;
  payload: BlueprintModel[];
}

export interface LoadBlueprintsErrorAction {
  type: BlueprintActionType.LOAD_BLUEPRINTS_ERROR;
  payload: string;
}

export interface SelectBlueprintAction {
  type: BlueprintActionType.SELECT_BLUEPRINT;
  payload: string;
}

export interface ClearSelectionAction {
  type: BlueprintActionType.CLEAR_SELECTION;
}

export interface SetSearchTermAction {
  type: BlueprintActionType.SET_SEARCH_TERM;
  payload: string;
}

export interface SetFiltersAction {
  type: BlueprintActionType.SET_FILTERS;
  payload: BlueprintFilters;
}

export interface ClearErrorAction {
  type: BlueprintActionType.CLEAR_ERROR;
}
