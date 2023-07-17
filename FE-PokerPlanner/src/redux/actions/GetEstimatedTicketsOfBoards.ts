import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const getEstimatedTickets = (boardId: number) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    pokerBoardServices
      .getEstimatedTicketList(boardId)
      .then((response) => {
        dispatch({
          type: ActionTypes.ESTIMATED_TICKET_LIST,
          payload: response,
        });
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
