import { AxiosError } from 'axios';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';

export const createSession = (boardId: number, timer: number) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      const response = await pokerBoardServices.createSession(boardId, timer);
      return response.data;
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      dispatch(setError(e.message));
    }
  };
};
