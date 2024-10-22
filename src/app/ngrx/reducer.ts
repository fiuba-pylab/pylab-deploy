import { createReducer, on } from '@ngrx/store';
import { AppState } from './models';
import { addNew, goBack, resetState } from './actions';

const initialState: AppState = {
  past: [],
  currentValues: {},
};

export const coordinatorReducer = createReducer(
  initialState,
  on(goBack, (state) => {
    const previousState = state.past[state.past.length - 1];
    if (!previousState) return state;

    return {
      ...state,
      past: state.past.slice(0, -1), // Elimina el último estado del pasado
      currentValues: { ...previousState }, // El estado anterior se convierte en el actual
    };
  }),
  on(addNew, (state, { newCoordinator} ) => {
    let result = {
      ...state,
      past: [...state.past, { ...state.currentValues }], // Mueve el estado actual al pasado
      currentValues: { ...newCoordinator }, // Establece el nuevo estado como actual
    };

    return result;
  }),
  on(resetState, (state) => {
    const initialState = state.past[1] ? state.past[1] : state.currentValues;
    return {
      past: [],
      currentValues: {...initialState},
    };
  })
);
