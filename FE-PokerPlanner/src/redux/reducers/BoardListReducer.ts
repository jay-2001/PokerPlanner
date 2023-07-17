import { AnyAction } from '@reduxjs/toolkit';

import { SetBoardDetailsInterface } from '@Constants/interfaces';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const BoardListReducer = (
  state: SetBoardDetailsInterface[] = [],
  { type, payload }: AnyAction
) => {
  switch (type) {
    case ActionTypes.SET_BOARD_LIST:
      return payload;
    default:
      return state;
  }
};
