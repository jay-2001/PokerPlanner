import { AnyAction } from '@reduxjs/toolkit';

import { ActionTypes } from '@Redux/constants/ActionTypes';

const initialState = {
  count: 0,
  next: '',
  previous: '',
  results: [],
};

export const UserBoardReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER_BOARDS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
