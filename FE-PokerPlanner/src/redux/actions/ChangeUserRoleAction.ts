import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { getUsersRole } from '@Redux/actions/GetUsersRoleAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const changeUserRole = (
  boardId: number,
  userId: number,
  userRole: number
) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    let data = { role: userRole };
    pokerBoardServices
      .changeUserRole(boardId, userId, data)
      .then((response) => {
        dispatch({ type: ActionTypes.CHANGE_USER_ROLE, payload: response });
        dispatch(getUsersRole(boardId));
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
