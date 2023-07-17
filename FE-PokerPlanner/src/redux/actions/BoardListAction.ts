import { AxiosError } from 'axios';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { setBoardListService } from '@Redux/api/BoardService';
import { ActionTypes } from '@Redux/constants/ActionTypes';
import { AppDispatch } from '@Redux/store/store';

export const setBoardList = () => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await setBoardListService();
      dispatch({
        type: ActionTypes.SET_BOARD_LIST,
        payload: response.data,
      });
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      dispatch(setError(e.message));
    }
  };
};
