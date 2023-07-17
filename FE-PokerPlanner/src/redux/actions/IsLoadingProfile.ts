import { ActionTypes } from '@Redux/constants/ActionTypes';

export const isLoadingProfileAction = (status: boolean) => {
  return {
    type: ActionTypes.IS_LOADING_PROFILE,
    profileLoadingStatus: status,
  };
};
