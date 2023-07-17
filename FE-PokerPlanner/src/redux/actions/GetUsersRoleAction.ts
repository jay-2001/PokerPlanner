import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const getUsersRole = (boardId: number) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    pokerBoardServices
      .getUsersRole(boardId)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_USER_ROLE, payload: response });
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
