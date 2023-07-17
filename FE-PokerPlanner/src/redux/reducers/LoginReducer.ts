import { AnyAction } from 'redux';

import { loginUserInitialState } from '@Constants/constants';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export function LoginReducer(state = loginUserInitialState, action: AnyAction) {
  switch (action.type) {
    case ActionTypes.LOGIN_USER:
      return { ...state, ...action.payload };
    case ActionTypes.RESET_LOGIN_USER:
      return { ...state, ...action.payload };
    case ActionTypes.LOGIN_TOKEN:
      return { ...state, ...action.payload };
    case ActionTypes.LOGIN_ERROR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
