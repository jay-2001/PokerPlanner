import { AnyAction } from '@reduxjs/toolkit';

import { CreateGroupInterface } from '@Constants/interfaces';
import { ActionTypes } from '@Redux/constants/ActionTypes';

const createGroupInitialState: CreateGroupInterface = {
  groupName: '',
  groupDescription: '',
};

export const GroupCreateReducer = (
  state = createGroupInitialState,
  { type, payload }: AnyAction
) => {
  switch (type) {
    case ActionTypes.CREATE_GROUP:
      return { ...payload };
    default:
      return state;
  }
};
