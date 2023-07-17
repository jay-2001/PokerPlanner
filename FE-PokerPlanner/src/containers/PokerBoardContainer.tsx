import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { PokerBoard } from '@Components/PokerBoard';
import {
  emailRegex,
  addMembersToBoardAlertTitle,
  addMembersToBoardsAlertDescription,
  addMemberToBoardErrorText,
  addGroupsToBoardAlertDescription,
  addGroupsToBoardAlertTitle,
  addGroupToBoardErrorText,
  MIN_GROUP_LENGTH_VALIDATION,
  MAX_GROUP_LENGTH_VALIDATION,
} from '@Constants/constants';
import { addGroupsToBoardAction } from '@Redux/actions/AddGroupsToBoardAction';
import { addMembersToBoardAction } from '@Redux/actions/AddMemberToBoardAction';
import { fetchBoardDetails } from '@Redux/actions/BoardAction';
import { changeUserRole } from '@Redux/actions/ChangeUserRoleAction';
import { createSession } from '@Redux/actions/CreateGameSessionAction';
import { deleteGroupFromBoard } from '@Redux/actions/DeleteGroupFromBoard';
import { deleteMemberFromBoard } from '@Redux/actions/DeleteMemberFromBoard';
import { deleteBoard } from '@Redux/actions/DeletePokerBoard';
import { setError } from '@Redux/actions/ErrorAction';
import { getBoardTickets } from '@Redux/actions/GetBoardTickets';
import { getEstimatedTickets } from '@Redux/actions/GetEstimatedTicketsOfBoards';
import { getUsersRole } from '@Redux/actions/GetUsersRoleAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * Poker board dashboard container
 * @returns {JSX.Element}
 */
export const PokerBoardContainer = () => {
  const { id } = useParams();
  const [isClose, setIsClose] = useState<boolean>(true);
  const [isCloseGroup, setIsCloseGroup] = useState<boolean>(true);
  const [member, setMember] = useState<string>('');
  const [group, setGroup] = useState<string>('');
  const [isManager, setIsManager] = useState<boolean>(false);
  const [choice, setChoice] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [timer, setTimer] = useState(5);
  const [openExistingMembers, setOpenExistingMembers] = useState<boolean>(false);
  const [openExistingGroups, setOpenExistingGroups] = useState<boolean>(false);
  const [openTicktes, setOpenTickets] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const {
    PokerBoard: boardDetail,
    IsBoardLoading: isBoardLoading,
    error,
    isError,
    GetUsersRole: existingUsers,
  } = state;
  const navigate = useNavigate();

  if (timer < 5) setTimer(5);

  /**
   * To fetch the details of board
   */
  useEffect(() => {
    if (id) {
      dispatch(fetchBoardDetails(+id));
      dispatch(getUsersRole(+id));
      dispatch(getEstimatedTickets(+id));
      if (
        boardDetail.manager.id ===
        JSON.parse(localStorage.getItem('user_id') || '')
      )
        setIsManager(true);
      else setIsManager(false);
    }
  }, [boardDetail.manager.id]);

  /**
   *
   * @param event How many rows in a page of tickets to be displayed 5 or 10
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /**
   * To add members to board
   */
  const handleAddMember = (): void => {
    if (id && member) {
      dispatch(addMembersToBoardAction(id, member));
    }
  };

  /**
   * To add groups existing in database to board
   */
  const handleAddGroup = () => {
    if (id && group) {
      dispatch(addGroupsToBoardAction(parseInt(id, 10), group));
    }
  };

  /**
   * email should be a valid email to add as member
   * @returns boolean
   */
  const handleEmailValidation = (): boolean => {
    return member.length !== 0 && !emailRegex.test(member);
  };

  /**
   * To delete the board
   */
  const handleDeleteBoard = () => {
    if (id) {
      dispatch(deleteBoard(parseInt(id, 10)));
      navigate('/home');
    }
  };

  const handleGroupNameValidation = () => {
    return (
      group.length !== 0 &&
      (group.length < MIN_GROUP_LENGTH_VALIDATION ||
        group.length > MAX_GROUP_LENGTH_VALIDATION)
    );
  };

  const handleCloseBar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    dispatch(setIsError(false));
    dispatch(setError(''));
    if (reason === 'clickaway') {
      return;
    }
  };

  const handleTicketSearch = (e: any) => {
    e.preventDefault();
    if (id) {
      if (choice === 0) {
        dispatch(getBoardTickets(parseInt(id, 10), searchInput, 'jql')).then(
          () => {
            dispatch(fetchBoardDetails(+id));
          }
        );
      } else if (choice === 1) {
        dispatch(getBoardTickets(parseInt(id, 10), searchInput, 'issue'));
        dispatch(fetchBoardDetails(+id));
      } else if (choice === 2) {
        dispatch(getBoardTickets(parseInt(id, 10), searchInput, 'sprint'));
        dispatch(fetchBoardDetails(+id));
      }
    }
  };

  const handleRoleSave = (userId: number, role: number) => {
    if (id) {
      dispatch(changeUserRole(parseInt(id, 10), userId, role));
    }
  };

  /**
   *
   */
  const handleCreateGameSession = () => {
    if (id)
      dispatch(createSession(+id, timer)).then((response) => {
        if (response?.id) {
          navigate(`game/${response.id}`);
        }
      });
  };

  const handleDeleteMember = (userEmail: string) => {
    if (id) {
      dispatch(deleteMemberFromBoard(+id, userEmail));
    }
  };

  const handleDeleteGroup = (groupName: string) => {
    if (id) {
      dispatch(deleteGroupFromBoard(+id, groupName));
    }
  };

  return (
    <PokerBoard
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      choice={choice}
      isBoardLoading={isBoardLoading}
      boardDetail={boardDetail}
      isClose={isClose}
      setIsClose={setIsClose}
      setMember={setMember}
      isCloseGroup={isCloseGroup}
      setIsCloseGroup={setIsCloseGroup}
      group={group}
      setGroup={setGroup}
      addMembersToBoardAlertTitle={addMembersToBoardAlertTitle}
      addMembersToBoardsAlertDescription={addMembersToBoardsAlertDescription}
      addGroupsToBoardAlertTitle={addGroupsToBoardAlertTitle}
      addGroupsToBoardAlertDescription={addGroupsToBoardAlertDescription}
      addGroupToBoardErrorText={addGroupToBoardErrorText}
      handleEmailValidation={handleEmailValidation}
      handleGroupNameValidation={handleGroupNameValidation}
      addMemberToBoardErrorText={addMemberToBoardErrorText}
      member={member}
      handleAddMember={handleAddMember}
      handleAddGroup={handleAddGroup}
      isManager={isManager}
      handleDeleteBoard={handleDeleteBoard}
      openExistingMembers={openExistingMembers}
      openExistingGroups={openExistingGroups}
      error={error}
      isError={isError}
      handleCloseBar={handleCloseBar}
      handleCloseSnakeBar={handleCloseBar}
      setSearchInput={setSearchInput}
      handleTicketSearch={handleTicketSearch}
      handleRoleSave={handleRoleSave}
      existingUsers={existingUsers}
      handleModalOpen={handleModalOpen}
      handleModalClose={handleModalClose}
      open={open}
      setTimer={setTimer}
      timer={timer}
      setChoice={setChoice}
      setOpenExistingMembers={setOpenExistingMembers}
      setOpenExistingGroups={setOpenExistingGroups}
      setPage={setPage}
      handleCreateGameSession={handleCreateGameSession}
      handleDeleteMember={handleDeleteMember}
      handleDeleteGroup={handleDeleteGroup}
      openTickets={openTicktes}
      setOpenTickets={setOpenTickets}
    />
  );
};
