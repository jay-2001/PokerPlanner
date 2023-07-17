import { AnyAction } from '@reduxjs/toolkit';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const InitialState = {
  user: 0,
  role: 0,
};

export const ChangeUserRoleReducer = (
  state = InitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case ActionTypes.CHANGE_USER_ROLE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
