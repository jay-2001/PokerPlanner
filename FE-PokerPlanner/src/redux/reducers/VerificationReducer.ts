import { AnyAction } from 'redux';

import { verficationUserInitialState } from '@Constants/constants';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export function VerificationReducer(
  state = verficationUserInitialState,
  action: AnyAction
) {
  switch (action.type) {
    case ActionTypes.VERIFIED_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
