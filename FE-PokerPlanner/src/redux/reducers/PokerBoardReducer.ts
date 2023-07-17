import { AnyAction } from 'redux';

import { ActionTypes } from '@Redux/constants/ActionTypes';

export const BoardInitialState = {
  name: '',
  description: '',
  poker_ticket: [],
  count: 0,
  users: [],
  groups: [],
  manager: { id: 0, email: '' },
  ticket_list: [],
};

export const FetchBoardDetailsReducer = (
  state = BoardInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case ActionTypes.FETCH_BOARD_DETAILS ||
      ActionTypes.ADD_MEMBER_TO_BOARD ||
      ActionTypes.ADD_GROUP_TO_BOARD:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypes.FETCH_BOARD_TICKETS:
      return {
        ...state,
        poker_ticket: [...state.poker_ticket, { ...action.payload }],
      };
    case ActionTypes.ESTIMATED_TICKET_LIST:
      return {
        ...state,
        ticket_list: action.payload,
      };
    default:
      return state;
  }
};
