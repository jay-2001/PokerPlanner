import { AnyAction } from '@reduxjs/toolkit';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const IsErrorReducer = (state: boolean = false, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.IS_ERROR:
      return action.isError;
    default:
      return state;
  }
};
