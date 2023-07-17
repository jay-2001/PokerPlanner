import { AxiosError } from 'axios';

import { loginUserInitialState } from '@Constants/constants';
import service from '@Redux/api/service';
import { ActionTypes } from '@Redux/constants/ActionTypes';
import { AppDispatch } from '@Redux/store/store';

/**
 * Set the token in redux state for login user if he refresh page.
 *
 * @param token Token value.
 * @returns Action
 */
export function setToken(token: string) {
  return {
    type: ActionTypes.LOGIN_TOKEN,
    payload: { token: token, isLogin: true },
  };
}

/**
 * Set the login data in redux state.
 *
 * @param email The email of the user.
 * @param password The password of the user.
 * @returns Action
 */
export function setLoginData(email: string, password: string) {
  return {
    type: ActionTypes.SET_LOGIN_DATA,
    payload: {
      email,
      password,
    },
  };
}

/**
 * Set the login data in redux state for login user.
 *
 * @param email The email of the user.
 * @param password The password of the user.
 * @param token Token for user
 * @returns Action of type Login Error
 */
export function setLoginUser(email: string, password: string, token: string) {
  return {
    type: ActionTypes.LOGIN_USER,
    payload: {
      email: email,
      password: password,
      token: token,
      isLogin: true,
      error: '',
      errorStatusCode: null,
    },
  };
}

/**
 * Reset the login data in redux state if any error occured during login thunk call.
 *
 * @returns Action to clear data
 */
export function resetLoginUser() {
  return {
    type: ActionTypes.RESET_LOGIN_USER,
    payload: loginUserInitialState,
  };
}

/**
 * Set the login data in redux state if any error occured during login thunk call.
 *
 * @param error axios error.
 * @returns Action of type Login Error
 */
export function setLoginError(error: AxiosError) {
  return {
    type: ActionTypes.LOGIN_ERROR,
    payload: {
      email: '',
      password: '',
      isLogin: false,
      token: null,
      error: error.message,
      errorStatusCode: error.response?.status,
    },
  };
}

/**
 * Logs the user into the application using the provided credentials.
 *
 * @param email The email of the user.
 * @param password The password of the user.
 * @returns A Promise that resolves with the user's authentication token if the login is successful.
 *          Otherwise, the Promise will be rejected with an error message.
 *
 * @throws {AxiosError} If the provided credentials are invalid.
 * @throws {AxiosError} If there is an issue with the authentication server.
 */
export function LoginAction(email: string, password: string) {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await service({
        method: 'post',
        url: '/user/login/',
        data: {
          email: email,
          password: password,
        },
      });
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('token', response.data.token);
      dispatch(setLoginUser(email, password, response.data.token));
    } catch (error) {
      const err = error as AxiosError;
      dispatch(setLoginError(err));
    }
  };
}

/**
 * Thunk action creator that logs the user out of the application.
 * @param token Api call to user with given token
 * @returns A function that takes a Redux dispatch function as its argument. When called, this function
 *          will dispatch actions to log the user out and clear their session data from the store.
 *
 * @throws {AxiosError} If there is an issue with the logout process.
 */
export function LogOutAction(token: string | null) {
  return async function (dispatch: AppDispatch) {
    if (localStorage.getItem('token') === null) {
      return;
    }
    try {
      const response = await service({
        method: 'delete',
        url: `/user/logout/${token}`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      localStorage.clear();
      dispatch(resetLoginUser());
    } catch (error) {
      const err = error as AxiosError;
      dispatch(setLoginError(err));
    }
  };
}
