import service from '@Redux/api/service';
import { BOARD_SESSION_URL, BOARD_URL } from '@Redux/constants/urls';

export const setBoardListService = () => {
  return service({
    method: 'get',
    url: BOARD_URL,
  });
};

export const createBoardService = (
  boardName: string,
  boardDescription: string,
  voting_system: number,
  estimation_choices: number[]
) => {
  return service({
    method: 'post',
    url: BOARD_URL,
    data: {
      name: boardName,
      description: boardDescription,
      voting_system: voting_system,
      estimation_choices: estimation_choices,
    },
  });
};

export const setBoardSessionService = (
  boardID: string,
  boardSessionID: string
) => {
  return service({
    method: 'get',
    url: `${BOARD_URL}${boardID}/${BOARD_SESSION_URL}${boardSessionID}/`,
  })
}

export const acceptInviteService = (
  boardID: string,
  queryParams: URLSearchParams
) => {
  const url = `${process.env.REACT_APP_PROXY_SERVER}/boards/${boardID}/acceptinvite/`;
  return service({
    method: 'patch',
    url: url,
    params: {
      accept_invite_email: queryParams.get('accept_invite_email'),
      pokerboard_id: queryParams.get('pokerboard_id'),
    },
  });
};
