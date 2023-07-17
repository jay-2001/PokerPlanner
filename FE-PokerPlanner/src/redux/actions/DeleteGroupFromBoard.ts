import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { fetchBoardDetails } from '@Redux/actions/BoardAction';
import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';

export const deleteGroupFromBoard = (boardId: number, groupName: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    pokerBoardServices
      .deleteGroup(boardId, groupName)
      .then(() => dispatch(fetchBoardDetails(boardId)))
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
