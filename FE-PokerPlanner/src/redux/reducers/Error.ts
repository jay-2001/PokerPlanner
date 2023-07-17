import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const ErrorReducer = (state = '', action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.ERROR:
      return action.errorMessage;
    default:
      return state;
  }
};
