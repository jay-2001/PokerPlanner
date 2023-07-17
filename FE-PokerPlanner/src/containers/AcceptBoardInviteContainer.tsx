import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import AcceptBoardInvite from '@Components/AcceptBoardInvite';
import {
  boardsRoute,
  inviteAcceptSuccessTimer,
  loginRoute,
  statusCodes,
} from '@Constants/constants';
import { acceptInvite } from '@Redux/actions/AcceptInviteAction';
import { AppDispatch } from '@Redux/store/store';

/**
 * This component represents the page for accepting a board invitation.
 * It uses several hooks, including useSearchParams and useParams from React Router,
 * useState and useEffect from React, and useDispatch and AppDispatch from Redux.
 * It also renders the AcceptBoardInvite component, which takes props for the error message and
 * success status of accepting the board invitation.
 */
export default (): JSX.Element => {
  const [queryParams] = useSearchParams();
  const { boardID } = useParams();
  const [isInviteAcceptSuccess, setIsInviteAcceptSuccess] =
    useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(loginRoute);
    }
    if (boardID) {
      dispatch(acceptInvite(boardID, queryParams)).then((res: any) => {
        if (res.response && res.response.status === statusCodes.badRequest) {
          setIsInviteAcceptSuccess(false);
          setErrorMsg(res.response.data.non_field_errors[0]);
        } else if (res.status === 200) {
          setIsInviteAcceptSuccess(true);
          setTimeout(() => {
            navigate(`${boardsRoute}/${boardID}`);
          }, inviteAcceptSuccessTimer);
        }
      });
    }
  }, []);

  return (
    <AcceptBoardInvite
      errorMsg={errorMsg}
      isInviteAcceptSuccess={isInviteAcceptSuccess}
    />
  );
};
