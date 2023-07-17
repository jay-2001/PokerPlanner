import { AnyAction } from '@reduxjs/toolkit';

import { SetGroupDetailsInterface } from '@Constants/interfaces';
import { ActionTypes } from '@Redux/constants/ActionTypes';

const setGroupDetailsInitialState: SetGroupDetailsInterface = {
  id: undefined,
  name: '',
  description: '',
  admin: undefined,
  members: [],
};

export const GroupDetailReducer = (
  state = { ...setGroupDetailsInitialState },
  { type, payload }: AnyAction
) => {
  switch (type) {
    case ActionTypes.SET_GROUP_DETAILS:
      return { ...state, ...payload };
    case ActionTypes.RESET_GROUP_DETAILS:
      return { ...payload };
    case ActionTypes.REMOVE_GROUP_MEMBER:
      return { ...payload };
    default:
      return state;
  }
};
