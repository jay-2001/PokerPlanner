import {
  DataType,
  UserProfileDetail,
  Board,
  Ticket,
} from '@Constants/interfaces';
import service from '@Redux/api/service';
import {
  BOARD_LIST_URL,
  GROUP_LIST_URL,
  TICKET_LIST_URL,
  USERPROFILE_URL,
  USER_URL,
} from '@Redux/constants/urls';

const requests = {
  get: (url: string) =>
    service({
      method: 'get',
      url,
    }).then((response) => response.data),

  getgroup: (url: string, page: number) =>
    service({
      method: 'get',
      url,
      params: {
        page,
      },
    }).then((response) => response.data),

  getboards: (url: string, page: number) =>
    service({
      method: 'get',
      url,
      params: {
        page,
      },
    }).then((response) => response.data),

  gettickets: (url: string, page: number) =>
    service({
      method: 'get',
      url,
      params: {
        page,
      },
    }).then((response) => response.data),

  patch: (url: string, data: DataType) => {
    return service.patch(url, (data = data)).then((response) => response.data);
  },
};

export const userProfileServices = {
  getUserDetail: (): Promise<UserProfileDetail> =>
    requests.get(USERPROFILE_URL),
  getGroups: (page: number) => requests.getgroup(GROUP_LIST_URL, page),
  getBoards: (page: number): Promise<Board> =>
    requests.getboards(BOARD_LIST_URL, page),
  getTickets: (page: number): Promise<Ticket> =>
    requests.gettickets(TICKET_LIST_URL, page),
  updateUserDetails: (
    id: number,
    data: DataType
  ): Promise<UserProfileDetail> => {
    return requests.patch(`${USERPROFILE_URL}${id}/`, data);
  },
};
