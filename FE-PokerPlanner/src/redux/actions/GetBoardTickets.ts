import { AnyAction, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';

import { fetchBoardDetails } from '@Redux/actions/BoardAction';
import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';

export const getBoardTickets = (
  boardId: number,
  input: string,
  operation: string
) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const data = { jira_query_params: input };
    pokerBoardServices
      .getBoardTicket(boardId, data, operation)
      .then(() => {
        dispatch(fetchBoardDetails(boardId));
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
