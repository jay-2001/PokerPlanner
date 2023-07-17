import { AnyAction } from '@reduxjs/toolkit';

import { CreateBoardInterface } from '@Constants/interfaces';
import { ActionTypes } from '@Redux/constants/ActionTypes';

const createBoardInitialState: CreateBoardInterface = {
  boardName: '',
  boardDescription: '',
  voting_system: undefined,
  estimation_choices: [],
};

export const BoardCreateReducer = (
  state = createBoardInitialState,
  { type, payload }: AnyAction
) => {
  switch (type) {
    case ActionTypes.CREATE_GROUP:
      return { ...payload };
    default:
      return state;
  }
};
