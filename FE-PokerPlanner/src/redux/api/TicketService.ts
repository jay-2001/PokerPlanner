import service from '@Redux/api/service';
import { BOARD_URL, TICKET_URL } from '@Redux/constants/urls';

export const addCommentService = (
  boardID: string,
  comment: string,
  issue: string
) => {
  return service({
    method: 'post',
    url: `${BOARD_URL}${boardID}/${TICKET_URL}comment/`,
    data: {
      issue,
      comments: comment,
    },
  });
};
