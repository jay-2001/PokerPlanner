import { ThunkAction, AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { isLoadingBoardAction } from '@Redux/actions/IsLoadingBoard';
import { userProfileServices } from '@Redux/api/UserProfileServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export function fetchUserBoards(
  page: number
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(isLoadingBoardAction(true));
    userProfileServices
      .getBoards(page)
      .then((response) => {
        dispatch(isLoadingBoardAction(false));
        dispatch({ type: ActionTypes.FETCH_USER_BOARDS, payload: response });
      })
      .catch((error) => {
        dispatch(isLoadingBoardAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
}
