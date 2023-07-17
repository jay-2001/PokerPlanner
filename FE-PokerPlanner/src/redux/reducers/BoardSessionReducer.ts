import { AnyAction } from '@reduxjs/toolkit';

import { CreateBoardInterface } from '@Constants/interfaces';
import { ActionTypes } from '@Redux/constants/ActionTypes';

const createBoardInitialState: CreateBoardInterface = {
  boardName: '',
  boardDescription: '',
  voting_system: undefined,
  estimation_choices: [],
};

const boardSessionInitialState = {
  board: createBoardInitialState,
};

export const BoardSessionReducer = (
  state = boardSessionInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case ActionTypes.SET_SESSION_DETAILS:
      return { ...action.payload };
    default:
      return state;
  }
};
