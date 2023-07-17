import { AxiosError } from 'axios';

import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { createBoardService } from '@Redux/api/BoardService';
import { AppDispatch } from '@Redux/store/store';

export const createBoard = (
  boardName: string,
  boardDescription: string,
  votingSystem: number,
  estimation_choices: number[]
) => {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await createBoardService(
        boardName,
        boardDescription,
        votingSystem,
        estimation_choices
      );
      return response;
    } catch (error) {
      const e = error as AxiosError;
      dispatch(setIsError(true));
      dispatch(setError(e.message));
    }
  };
};
