import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const IsTicketLoadingReducer = (state = false, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.IS_LOADING_TICKET:
      return action.ticketLoadingStatus;
    default:
      return state;
  }
};
