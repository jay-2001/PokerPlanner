import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

import { setError } from '@Redux/actions/ErrorAction';
import { getUsersRole } from '@Redux/actions/GetUsersRoleAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';

export const deleteMemberFromBoard = (boardId: number, userEmail: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    pokerBoardServices
      .deleteMember(boardId, userEmail)
      .then(() => {
        dispatch(getUsersRole(boardId));
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
