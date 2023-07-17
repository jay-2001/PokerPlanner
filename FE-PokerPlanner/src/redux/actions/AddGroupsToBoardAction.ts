import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { fetchBoardDetails } from '@Redux/actions/BoardAction';
import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const addGroupsToBoardAction = (id: number, group: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    pokerBoardServices
      .addGroups(id, { group_names: [group] })
      .then((response) => {
        dispatch({ type: ActionTypes.ADD_GROUP_TO_BOARD, payload: response });
        dispatch(fetchBoardDetails(id));
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
