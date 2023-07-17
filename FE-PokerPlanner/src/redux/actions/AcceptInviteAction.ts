import { AxiosError } from 'axios';

import { acceptInviteService } from '@Redux/api/BoardService';
import { AppDispatch } from '@Redux/store/store';

export const acceptInvite = (boardID: string, queryParams: URLSearchParams) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await acceptInviteService(boardID, queryParams);
      return response;
    } catch (error) {
      return error as AxiosError;
    }
  };
};
