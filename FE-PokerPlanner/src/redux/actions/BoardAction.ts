import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { isLoadingBoardAction } from '@Redux/actions/IsLoadingBoard';
import { pokerBoardServices } from '@Redux/api/PokerBoardServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export const fetchBoardDetails = (boardId: number) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(isLoadingBoardAction(true));
    pokerBoardServices
      .getBoardDetails(boardId)
      .then((response) => {
        dispatch(isLoadingBoardAction(false));
        dispatch({ type: ActionTypes.FETCH_BOARD_DETAILS, payload: response });
      })
      .catch((error) => {
        dispatch(isLoadingBoardAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
};
