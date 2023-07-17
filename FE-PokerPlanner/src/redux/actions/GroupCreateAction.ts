import { AxiosError } from 'axios';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { createGroupService } from '@Redux/api/GroupServices';
import { AppDispatch } from '@Redux/store/store';

export const createGroup = (groupName: string, groupDescription: string) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await createGroupService(groupName, groupDescription);
      return response;
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      dispatch(setError(e.message));
    }
  };
};
