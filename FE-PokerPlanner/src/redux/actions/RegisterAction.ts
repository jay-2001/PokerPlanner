import { AxiosError } from 'axios';

import { PokerUserInterface } from '@Constants/interfaces';
import service from '@Redux/api/service';
import { ActionTypes } from '@Redux/constants/ActionTypes';
import { AppDispatch } from '@Redux/store/store';

export function setRegisterUser(
  user: PokerUserInterface,
  error: string,
  statusCode: number | undefined
) {
  return {
    type: ActionTypes.REGISTER_USER,
    payload: { ...user, statusCode: statusCode, error: error },
  };
}

export function setRegisterUserError(
  error: string | boolean,
  statusCode: number | undefined
) {
  return {
    type: ActionTypes.REGISTER_ERROR,
    payload: { statusCode, error },
  };
}

/**
 * Thunk action creator that register a new user with the provided user data.
 *
 * @param user The user data for the new user to be created.
 * @returns A function that takes a Redux dispatch function as its argument. When called, this function
 *          will dispatch actions to sign the user up and store their data in the store.
 *
 * @throws {AxiosError} If the provided user data is invalid.
 * @throws {AxiosError} If there is an issue with the signup process.
 */
export function registerAction(user: PokerUserInterface) {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await service({
        method: 'post',
        url: '/user/register/',
        data: user,
      });
      dispatch(setRegisterUser(user, '', response.status));
    } catch (error) {
      const err = error as AxiosError;
      dispatch(setRegisterUser(user, err.message, err.response?.status));
    }
  };
}
