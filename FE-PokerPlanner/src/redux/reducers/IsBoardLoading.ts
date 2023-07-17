import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const IsBoardLoadingReducer = (state = false, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.IS_LOADING_BOARD:
      return action.boardLoadingStatus;
    default:
      return state;
  }
};
