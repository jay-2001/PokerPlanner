import { AxiosError } from 'axios';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { setGroupListService } from '@Redux/api/GroupServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';
import { AppDispatch } from '@Redux/store/store';

export const setGroupList = () => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await setGroupListService();
      dispatch({
        type: ActionTypes.SET_GROUP_LIST,
        payload: response.data,
      });
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      dispatch(setError(e.message));
    }
  };
};
