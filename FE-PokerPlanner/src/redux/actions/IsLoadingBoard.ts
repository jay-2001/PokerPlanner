import { ActionTypes } from '@Redux/constants/ActionTypes';

export const isLoadingBoardAction = (status: boolean) => {
  return {
    type: ActionTypes.IS_LOADING_BOARD,
    boardLoadingStatus: status,
  };
};
