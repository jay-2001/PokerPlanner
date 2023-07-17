import { AnyAction } from '@reduxjs/toolkit';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const InitialState = [];

export const GetUsersRoleReducer = (
  state = InitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER_ROLE:
      return [...action.payload];
    default:
      return state;
  }
};
