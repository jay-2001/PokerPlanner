import { AnyAction } from '@reduxjs/toolkit';

import { SetGroupDetailsInterface } from '@Constants/interfaces';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const GroupListReducer = (
  state: SetGroupDetailsInterface[] = [],
  { type, payload }: AnyAction
) => {
  switch (type) {
    case ActionTypes.SET_GROUP_LIST:
      return payload;
    default:
      return state;
  }
};
