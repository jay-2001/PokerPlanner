import { ActionTypes } from '@Redux/constants/ActionTypes';

export const isLoadingTicketAction = (status: boolean) => {
  return {
    type: ActionTypes.IS_LOADING_TICKET,
    ticketLoadingStatus: status,
  };
};
