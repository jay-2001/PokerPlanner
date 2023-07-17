import { ThunkAction, AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';

export const deleteBoard = (
  id: number
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    pokerBoardServices.deleteBoard(id).catch((error) => {
      dispatch(setIsError(true));
      dispatch(setError(error.message));
    });
  };
};
