import { AnyAction } from 'redux';

export function LoadingReducer(state = false, action: AnyAction) {
  switch (action.type) {
    case 'SET_LOADING':
      return action.payload;
    default:
      return state;
  }
}
