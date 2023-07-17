import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const IsGroupLoadingReducer = (state = false, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.IS_LOADING_GROUP:
      return action.groupLoadingStatus;
    default:
      return state;
  }
};
