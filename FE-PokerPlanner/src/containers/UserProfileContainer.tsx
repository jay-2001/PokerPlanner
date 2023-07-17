import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import UserProfile from '@Components/UserProfile';
import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { fetchUserDetails } from '@Redux/actions/UserProfileActions';
import { fetchUserBoards } from '@Redux/actions/UserProfileBoardAction';
import { fetchUserGroups } from '@Redux/actions/UserProfileGroupAction';
import { fetchUserTickets } from '@Redux/actions/UserProfileTicketAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * This container is to render the User Profile component which shows the details of user,
 * tickets estimated, boards he is part of, groups he is present in
 */
export const UserProfileContainer = () => {
  /**
   * To fetch the details of user, groups he is present in, boards he is part of, tickets estimated
   */
  const [page, setPage] = useState(0);
  const [pageBoard, setPageBoard] = useState(0);
  const [pageTicket, setPageTicket] = useState(0);
  const stateOfUser = useSelector((state: RootState) => state.UserProfile);
  const { user: userDetail } = stateOfUser;
  /**
   * To fetch the error and loaders
   */
  const state = useSelector((state: RootState) => state);
  const {
    error: error,
    isError: iserror,
    IsProfileLoading: isProfileLoading,
    IsGroupLoading: isGroupLoading,
    IsBoardLoading: isBoardLoading,
    IsTicketLoading: isTicketLoading,
    UserGroup: groupsOfUser,
    UserBoard: boardsOfUser,
    UserTicket: ticketsOfUser,
  } = state;
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const locallyStoredToken = localStorage.getItem('token');
    if (!locallyStoredToken) {
      navigate('/login');
    } else {
      dispatch(fetchUserDetails());
    }
  }, []);

  const updateFields = () => {
    if (userDetail.id) navigate('edit/');
    else navigate('/notFound');
  };

  /**
   * to go to update password page if user is logged in else go to 404 page
   */
  const updatePassword = () => {
    if (userDetail.id) navigate('editpassword/');
    else navigate('/notFound');
  };

  /**
   * To close the snackbar
   * @param event
   * @param reason
   * @returns
   */
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    dispatch(setIsError(false));
    dispatch(setError(''));
    if (reason === 'clickaway') {
      return;
    }
  };

  /**
   * To navigate to different paginated pages
   * @param event
   * @param newPage
   */
  const handleChangePage = (newPage: number) => {
    dispatch(fetchUserGroups(newPage + 1));
    setPage(newPage);
  };

  const handleChangePageBoard = (newPage: number) => {
    dispatch(fetchUserBoards(newPage + 1));
    setPageBoard(newPage);
  };

  const handleChangePageTicket = (newPage: number) => {
    dispatch(fetchUserTickets(newPage + 1));
    setPageTicket(newPage);
  };

  return (
    <UserProfile
      handleChangePage={handleChangePage}
      handleChangePageBoard={handleChangePageBoard}
      handleChangePageTicket={handleChangePageTicket}
      handleClose={handleClose}
      handleCloseBar={handleClose}
      updatePassword={updatePassword}
      updateFields={updateFields}
      userDetail={userDetail}
      groupsOfUser={groupsOfUser}
      boardsOfUser={boardsOfUser}
      ticketsOfUser={ticketsOfUser}
      error={error}
      iserror={iserror}
      page={page}
      pageBoard={pageBoard}
      pageTicket={pageTicket}
      isProfileLoading={isProfileLoading}
      isGroupLoading={isGroupLoading}
      isBoardLoading={isBoardLoading}
      isTicketLoading={isTicketLoading}
    />
  );
};
