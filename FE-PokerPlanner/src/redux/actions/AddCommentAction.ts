import { AxiosError } from 'axios';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { addCommentService } from '@Redux/api/TicketService';
import { AppDispatch } from '@Redux/store/store';

export const addComment = (boardID: string, comment: string, issue: string) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await addCommentService(boardID, comment, issue);
      dispatch(setIsError(true));
      dispatch(setError(''));
      return response.data;
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      dispatch(setError(e.message));
      return e;
    }
  };
};
