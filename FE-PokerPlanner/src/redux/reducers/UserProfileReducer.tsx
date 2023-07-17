import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const InitialState = {
  user: { email: '' },
};

export default function UserProfileReducer(
  currentState = InitialState,
  action: AnyAction
) {
  switch (action.type) {
    case ActionTypes.FETCH_USER_PROFILE_DETAILS:
      return {
        ...currentState,
        user: action.payload,
      };

    case ActionTypes.UPDATE_USER_DETAILS:
      return {
        ...currentState,

        user: action.payload,
      };

    default:
      return currentState;
  }
}
