import { ThunkAction, AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { isLoadingGroupAction } from '@Redux/actions/IsLoadingGroup';
import { userProfileServices } from '@Redux/api/UserProfileServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export function fetchUserGroups(
  page: number
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(isLoadingGroupAction(true));
    userProfileServices
      .getGroups(page)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_USER_GROUPS, payload: response });
        dispatch(isLoadingGroupAction(false));
      })
      .catch((error) => {
        dispatch(isLoadingGroupAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
}
