import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const IsProfileLoadingReducer = (state = false, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.IS_LOADING_PROFILE:
      return action.profileLoadingStatus;
    default:
      return state;
  }
};
