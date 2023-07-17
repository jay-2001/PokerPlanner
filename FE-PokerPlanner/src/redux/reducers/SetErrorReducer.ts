import { AnyAction } from '@reduxjs/toolkit';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const ErrorReducer = (state: string = '', action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.SET_ERROR:
      return action.error;
    default:
      return state;
  }
};
