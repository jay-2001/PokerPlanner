import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PokerCreateBoard from '@Components/PokerCreateBoard';
import {
  boardMaxLenNameInputError,
  boardMinLenNameInputError,
  boardsRoute,
  defaultChoices,
  estimationChoicesLimit,
  listRegex,
  loginRoute,
  maxBoardNameLength,
  minBoardNameLength,
} from '@Constants/constants';
import { createBoard } from '@Redux/actions/BoardCreateAction';
import { setBoardList } from '@Redux/actions/BoardListAction';
import { setError } from '@Redux/actions/ErrorAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * A container which is used to render the PokerCreateBoard component
 * All the necessary states and functionalities for the PokerCreateBoard component
 * are written here
 * @returns {JSX.Element} PokerCreateBoard Component.
 */
export default (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isError = useSelector((state: RootState) => state.isError);
  const errorMessage = useSelector((state: RootState) => state.error);
  const boardList = useSelector((state: RootState) => state.boardList);
  const [boardNameInput, setBoardNameInput] = useState<string>('');
  const [boardDescriptionInput, setBoardDescriptionInput] =
    useState<string>('');
  const [votingSystem, setVotingSystem] = useState<number>(0);
  const [estimationChoices, setEstimationChoices] = useState<string>('');

  useEffect(() => {
    const locallyStoredToken = localStorage.getItem('token');
    if (!locallyStoredToken) {
      navigate(loginRoute);
    }
    setBoardNameInput('');
    setBoardDescriptionInput('');
    if (locallyStoredToken) {
      dispatch(setBoardList());
    }
  }, []);

  const handleClose = (): void => {
    dispatch(setIsError(false));
    dispatch(setError(''));
  };

  const handleCreateBoard = (): void => {
    const locallyStoredToken = localStorage.getItem('token');
    if (locallyStoredToken) {
      let estimationChoicesList: number[] = [];
      if (votingSystem < 4) {
        estimationChoicesList = defaultChoices[votingSystem];
      } else {
        estimationChoicesList = estimationChoices
          .split(',', estimationChoicesLimit)
          .map(Number);
      }
      dispatch(
        createBoard(
          boardNameInput,
          boardDescriptionInput,
          votingSystem,
          estimationChoicesList
        )
      ).then((response) => {
        if (!response?.data.id) return;
        const url = `${boardsRoute}/${response?.data.id}`;
        navigate(url);
      });
    } else {
      navigate(loginRoute);
    }
  };

  const handleRedirectToExistingBoard = (boardID: number): void => {
    const url = `${boardsRoute}/${boardID}`;
    navigate(url);
  };

  const handleCustomChoicesError = (): boolean => {
    return estimationChoices.length !== 0 && !listRegex.test(estimationChoices);
  };

  const handleBoardNameInputHelperText = () => {
    let messageToDisplay = '';
    if (boardNameInput.length && boardNameInput.length < minBoardNameLength) {
      messageToDisplay = boardMinLenNameInputError;
    } else if (
      boardNameInput.length &&
      boardNameInput.length > maxBoardNameLength
    ) {
      messageToDisplay = boardMaxLenNameInputError;
    }
    return messageToDisplay;
  };

  return (
    <PokerCreateBoard
      isError={isError}
      errorMessage={errorMessage}
      handleCloseSnackbar={handleClose}
      handleCloseAlert={handleClose}
      boardNameInput={boardNameInput}
      setBoardNameInput={setBoardNameInput}
      boardDescriptionInput={boardDescriptionInput}
      setBoardDescriptionInput={setBoardDescriptionInput}
      handleCreateBoard={handleCreateBoard}
      handleRedirectToExistingBoard={handleRedirectToExistingBoard}
      boardList={boardList}
      votingSystem={votingSystem}
      setVotingSystem={setVotingSystem}
      estimationChoices={estimationChoices}
      setEstimationChoices={setEstimationChoices}
      handleCustomChoicesError={handleCustomChoicesError}
      handleBoardNameInputHelperText={handleBoardNameInputHelperText}
    />
  );
};
