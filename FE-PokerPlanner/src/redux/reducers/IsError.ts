import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const IsErrorReducer = (state = false, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.IS_ERROR:
      return action.errorStatus;
    default:
      return state;
  }
};
