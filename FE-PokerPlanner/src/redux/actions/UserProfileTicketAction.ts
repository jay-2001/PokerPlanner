import { ThunkAction, AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { isLoadingTicketAction } from '@Redux/actions/IsLoadingTicket';
import { userProfileServices } from '@Redux/api/UserProfileServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export function fetchUserTickets(
  page: number
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(isLoadingTicketAction(true));
    userProfileServices
      .getTickets(page)
      .then((response) => {
        dispatch(isLoadingTicketAction(false));
        dispatch({ type: ActionTypes.FETCH_USER_TICKETS, payload: response });
      })
      .catch((error) => {
        dispatch(isLoadingTicketAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
}
