import {
  addMembersQueryParam,
  removeMembersQueryParam,
} from '@Constants/constants';
import service from '@Redux/api/service';
import { GROUP_URL } from '@Redux/constants/urls';

export const setGroupDetailService = (groupID: string) => {
  const url = `${GROUP_URL}${groupID}/`;
  return service({
    method: 'get',
    url: url,
  });
};

export const removeGroupMemberService = (
  groupID: string | undefined,
  email: string
) => {
  const url = `${GROUP_URL}${groupID}/`;
  return service({
    method: 'patch',
    url: url,
    data: {
      member_emails: [email],
    },
    params: {
      operation: removeMembersQueryParam,
    },
  });
};

export const addGroupMemberService = (groupID: string, email: string) => {
  const url = `${GROUP_URL}${groupID}/`;
  return service({
    method: 'patch',
    url: url,
    data: {
      member_emails: [email],
    },
    params: {
      operation: addMembersQueryParam,
    },
  });
};

export const setGroupListService = () => {
  return service({
    method: 'get',
    url: GROUP_URL,
  });
};

export const createGroupService = (
  groupName: string,
  groupDescription: string
) => {
  return service({
    method: 'post',
    url: GROUP_URL,
    data: {
      name: groupName,
      description: groupDescription,
    },
  });
};
