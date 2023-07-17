import { AnyAction } from 'redux';

import { registerUserInitialState } from '@Constants/constants';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export function RegisterReducer(
  state = registerUserInitialState,
  action: AnyAction
) {
  switch (action.type) {
    case ActionTypes.REGISTER_USER:
      return { ...state, ...action.payload };
    case ActionTypes.REGISTER_ERROR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
