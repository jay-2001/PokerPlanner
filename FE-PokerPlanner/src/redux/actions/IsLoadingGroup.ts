import { ActionTypes } from '@Redux/constants/ActionTypes';

export const isLoadingGroupAction = (status: boolean) => {
  return {
    type: ActionTypes.IS_LOADING_GROUP,
    groupLoadingStatus: status,
  };
};
