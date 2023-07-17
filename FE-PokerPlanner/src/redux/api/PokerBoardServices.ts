import {
  addGroupsQueryParam,
  removeGroupsQueryParam,
  addMembersQueryParam,
  removeMembersQueryParam,
} from '@Constants/constants';
import { SingleBoardInterface } from '@Constants/interfaces';
import service from '@Redux/api/service';
import {
  BOARD_URL,
  JIRA_URL,
  SESSION_URL,
  TICKET,
  USER_URL,
} from '@Redux/constants/urls';

const requests = {
  getDetails: (url: string) =>
    service({
      method: 'get',
      url: url,
    }).then((response) => response.data),

  addMember: async (url: string, members: { user_emails: string[] }) =>
    service({
      method: 'patch',
      url: url,
      data: members,
      params: {
        operation: addMembersQueryParam,
      },
    }).then((response) => response.data),

  addGroups: async (url: string, groups: { group_names: string[] }) => {
    return service({
      method: 'patch',
      url: url,
      data: groups,
      params: {
        operation: addGroupsQueryParam,
      },
    }).then((response) => response.data);
  },

  deleteBoard: (url: string) =>
    service({
      method: 'delete',
      url: url,
    }).then((response) => response.data),

  getTicket: (
    url: string,
    operation: string,
    data: { jira_query_params: string }
  ) =>
    service({
      method: 'post',
      data: data,
      url: url,
      params: {
        operation: operation,
      },
    }).then((response) => response.data),

  changeRole: (url: string, data: { role: number }) =>
    service({
      method: 'patch',
      url: url,
      data: data,
    }).then((response) => response.data),

  getRoles: (url: string) =>
    service({
      method: 'get',
      url: url,
    }).then((response) => response.data),

  createSession: (url: string, timer: number) =>
    service({
      method: 'post',
      url: url,
      data: {
        timer: timer,
      },
    }),

  deleteMember: (url: string, userEmail: string) =>
    service({
      method: 'patch',
      url: url,
      data: {
        user_emails: [userEmail],
      },
      params: {
        operation: removeMembersQueryParam,
      },
    }),

  deleteGroup: (url: string, groupName: string) =>
    service({
      method: 'patch',
      url: url,
      data: {
        group_names: [groupName],
      },
      params: {
        operation: removeGroupsQueryParam,
      },
    }),

  getTickets: (url: string) =>
    service({
      method: 'get',
      url: url,
    }).then((response) => response.data),
};

export const pokerBoardServices = {
  getBoardDetails: (boardId: number): Promise<SingleBoardInterface> =>
    requests.getDetails(`${BOARD_URL}${boardId}`),

  addMembers: (
    boardId: string,
    members: { user_emails: string[] }
  ): Promise<SingleBoardInterface> => {
    return requests.addMember(`${BOARD_URL}${boardId}/`, members);
  },

  addGroups: (
    boardId: number,
    groups: { group_names: string[] }
  ): Promise<SingleBoardInterface> => {
    return requests.addGroups(`${BOARD_URL}${boardId}/`, groups);
  },

  deleteBoard: (boardId: number) =>
    requests.deleteBoard(`${BOARD_URL}${boardId}`),

  getBoardTicket: (
    boardId: number,
    data: { jira_query_params: string },
    operation: string
  ) => requests.getTicket(`${BOARD_URL}${boardId}${JIRA_URL}`, operation, data),

  changeUserRole: (boardId: number, userId: number, role: { role: number }) =>
    requests.changeRole(`${BOARD_URL}${boardId}${USER_URL}${userId}/`, role),

  getUsersRole: (boardId: number) =>
    requests.getRoles(`${BOARD_URL}${boardId}${USER_URL}`),

  createSession: (boardId: number, timer: number) =>
    requests.createSession(`${BOARD_URL}${boardId}${SESSION_URL}`, timer),

  deleteMember: (boardId: number, userEmail: string) =>
    requests.deleteMember(`${BOARD_URL}${boardId}/`, userEmail),

  deleteGroup: (boardId: number, groupName: string) =>
    requests.deleteGroup(`${BOARD_URL}${boardId}/`, groupName),

  getEstimatedTicketList: (boardId: number) =>
    requests.getTickets(`${BOARD_URL}${boardId}${TICKET}`),
};
