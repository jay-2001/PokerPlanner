import { AxiosError } from 'axios';

import { forbiddenStatusCode, updateGroupErrorMessage } from '@Constants/constants';
import { SetGroupDetailsInterface } from '@Constants/interfaces';
import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import {
  addGroupMemberService,
  removeGroupMemberService,
  setGroupDetailService,
} from '@Redux/api/GroupServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';
import { AppDispatch } from '@Redux/store/store';

const setGroupDetailsInitialState: SetGroupDetailsInterface = {
  id: undefined,
  name: '',
  description: '',
  admin: undefined,
  members: [],
};

export const setGroupDetails = (groupID: string) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await setGroupDetailService(groupID);
      dispatch({
        type: ActionTypes.SET_GROUP_DETAILS,
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

export const resetGroupDetails = () => {
  return {
    type: ActionTypes.RESET_GROUP_DETAILS,
    payload: { ...setGroupDetailsInitialState },
  };
};

export const removeGroupMember = (
  groupID: string | undefined,
  email: string
) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await removeGroupMemberService(groupID, email);
      dispatch({
        type: ActionTypes.REMOVE_GROUP_MEMBER,
        payload: { ...response.data },
      });
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      if (e.response?.status === forbiddenStatusCode) {
        dispatch(setError(updateGroupErrorMessage));
      } else {
        dispatch(setError(e.message));
      }
    }
  };
};

export const addGroupMember = (groupID: string, email: string) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await addGroupMemberService(groupID, email);
      dispatch({
        type: ActionTypes.SET_GROUP_DETAILS,
        payload: { ...response.data },
      });
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      if (e.response?.status === forbiddenStatusCode) {
        dispatch(setError(updateGroupErrorMessage));
      } else {
        dispatch(setError(e.message));
      }
    }
  };
};
