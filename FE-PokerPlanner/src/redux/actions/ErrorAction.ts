import { ActionTypes } from '@Redux/constants/ActionTypes';

export const setError = (error: string) => {
  return {
    type: ActionTypes.SET_ERROR,
    error: error,
  };
};
