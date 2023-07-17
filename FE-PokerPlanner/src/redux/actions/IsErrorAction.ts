import { ActionTypes } from '@Redux/constants/ActionTypes';

export const setIsError = (isError: boolean) => {
  return {
    type: ActionTypes.IS_ERROR,
    isError: isError,
  };
};
