import { createAction, createFeatureSelector, createSelector, props } from '@ngrx/store';
import { AppState } from './models';

export const goBack = createAction('[Coordinator] Go Back');
export const addNew = createAction('[Coordinator] Add New', props<{ newCoordinator: any }>());
export const resetState = createAction('[Coordinator] Reset State');

export const selectAppState = createFeatureSelector<AppState>('appState');
export const selectCurrentCoordinator = createSelector(selectAppState, (state) => state.currentValues);
export const selectPastStates = createSelector(selectAppState, (state) => state.past);
