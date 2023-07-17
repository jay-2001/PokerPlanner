import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { DataType } from '@Constants/interfaces';
import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { isLoadingBoardAction } from '@Redux/actions/IsLoadingBoard';
import { isLoadingGroupAction } from '@Redux/actions/IsLoadingGroup';
import { isLoadingProfileAction } from '@Redux/actions/IsLoadingProfile';
import { isLoadingTicketAction } from '@Redux/actions/IsLoadingTicket';
import { userProfileServices } from '@Redux/api/UserProfileServices';
import { ActionTypes } from '@Redux/constants/ActionTypes';

export function fetchUserDetails(): ThunkAction<
  Promise<void>,
  {},
  {},
  AnyAction
> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(isLoadingProfileAction(true));
    userProfileServices
      .getUserDetail()
      .then((response) => {
        dispatch(isLoadingProfileAction(false));
        dispatch({
          type: ActionTypes.FETCH_USER_PROFILE_DETAILS,
          payload: response,
        });
        localStorage.setItem('user_id', JSON.stringify(response.id));
      })
      .catch((error) => {
        dispatch(isLoadingProfileAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });

    dispatch(isLoadingGroupAction(true));
    userProfileServices
      .getGroups(1)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_USER_GROUPS, payload: response });
        dispatch(isLoadingGroupAction(false));
      })
      .catch((error) => {
        dispatch(isLoadingGroupAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });

    dispatch(isLoadingBoardAction(true));
    userProfileServices
      .getBoards(1)
      .then((response) => {
        dispatch(isLoadingBoardAction(false));
        dispatch({ type: ActionTypes.FETCH_USER_BOARDS, payload: response });
      })
      .catch((error) => {
        dispatch(isLoadingBoardAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });

    dispatch(isLoadingTicketAction(true));
    userProfileServices
      .getTickets(1)
      .then((response) => {
        dispatch(isLoadingTicketAction(false));
        dispatch({ type: ActionTypes.FETCH_USER_TICKETS, payload: response });
      })
      .catch((error) => {
        dispatch(isLoadingTicketAction(false));
        dispatch(setIsError(true));
        dispatch(setError(error.message));
      });
  };
}

export function updateUserDetail(
  user_id: number,
  data: DataType
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(isLoadingProfileAction(true));
    if (data.jira_api_token === '') {
      delete data['jira_api_token'];
    }
    if (data.jira_domain === '') {
      delete data['jira_domain'];
    }
    userProfileServices
      .updateUserDetails(user_id, data)
      .then((response) => {
        dispatch({ type: ActionTypes.UPDATE_USER_DETAILS, payload: response });
        dispatch(isLoadingProfileAction(false));
      })
      .catch((error) => {
        dispatch(setIsError(true));
        dispatch(setError(error.message));
        dispatch(isLoadingProfileAction(false));
      });
  };
}
