import { ActionTypes } from '@Redux/constants/ActionTypes';

export function setLoading(loading: boolean) {
  return {
    type: ActionTypes.SET_LOADING,
    payload: loading,
  };
}
