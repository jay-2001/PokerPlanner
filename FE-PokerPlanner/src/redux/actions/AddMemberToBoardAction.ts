import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setError } from '@Redux/actions/ErrorAction';
import { getUsersRole } from '@Redux/actions/GetUsersRoleAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const addMembersToBoardAction = (id: string, member: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    pokerBoardServices
      .addMembers(id, { user_emails: [member] })
      .then((response) => {
        dispatch({ type: ActionTypes.ADD_MEMBER_TO_BOARD, payload: response });
        dispatch(getUsersRole(+id));
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
