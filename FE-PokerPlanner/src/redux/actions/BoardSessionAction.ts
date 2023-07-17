import { AxiosError } from 'axios';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { setBoardSessionService } from '@Redux/api/BoardService';
import { ActionTypes } from '@Redux/constants/ActionTypes';
import { AppDispatch } from '@Redux/store/store';

export const setBoardSession = (boardID: string, boardSessionID: string) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await setBoardSessionService(boardID, boardSessionID);
      dispatch({
        type: ActionTypes.SET_SESSION_DETAILS,
        payload: { ...response.data },
      });
      return response.data;
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      dispatch(setError(e.message));
    }
  };
};
