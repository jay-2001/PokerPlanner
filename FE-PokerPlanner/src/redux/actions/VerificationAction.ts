import { setToken } from '@Redux/actions/LoginAction';
import service from '@Redux/api/service';
import { ActionTypes } from '@Redux/constants/ActionTypes';
import { AppDispatch } from '@Redux/store/store';

export function setVerification(isVerified: boolean, message: string) {
  return {
    type: ActionTypes.VERIFIED_USER,
    payload: { isVerified, message },
  };
}

/**
 * Thunk action creator that verifies a user's email address with the provided activation link.
 *
 * @param token The verification code for the user's email address.
 * @returns A function that takes a Redux dispatch function as its argument. When called, this function
 *          will dispatch actions to verify the user's email address and update their account status.
 *
 * @throws {AxiosError}
 */
export function VerificationAction(token: string) {
  return async function (dispatch: AppDispatch) {
    try {
      const response = await service({
        method: 'patch',
        url: `/user/verify/${token}`,
        data: {
          token,
        },
      });
      localStorage.setItem('token', response.data.key);
      localStorage.setItem('user_id', response.data.user_id);
      dispatch(setToken(response.data.key));
      dispatch(setVerification(true, 'Authorized user'));
    } catch (error) {
      dispatch(setVerification(false, 'Unauthorized user'));
    }
  };
}
