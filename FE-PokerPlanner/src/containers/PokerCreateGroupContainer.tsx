import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PokerCreateGroup from '@Components/PokerCreateGroup';
import {
  groupMaxLenNameInputError,
  groupNameInputError,
  groupsRoute,
  loginRoute,
  maxGroupNameLength,
  minGroupNameLength,
} from '@Constants/constants';
import { setError } from '@Redux/actions/ErrorAction';
import { createGroup } from '@Redux/actions/GroupCreateAction';
import { setGroupList } from '@Redux/actions/GroupListAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * A container which is used to render the PokerCreateGroup component
 * All the necessary states and functionalities for the PokerCreateGroup component
 * are written here
 * @returns {JSX.Element} PokerCreateGroup Component.
 */
export default (): JSX.Element => {
  const groupList = useSelector((state: RootState) => state.groupList);
  const isError = useSelector((state: RootState) => state.isError);
  const errorMessage = useSelector((state: RootState) => state.error);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const locallyStoredToken = localStorage.getItem('token');
  const [descriptionInput, setdescriptionInput] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleCreateGroup = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const locallyStoredToken = localStorage.getItem('token');
    if (locallyStoredToken) {
      dispatch(createGroup(usernameInput, descriptionInput)).then(
        (response) => {
          if (!response?.data.id) return;
          const url = `${groupsRoute}/${response?.data.id}`;
          navigate(url);
        }
      );
    } else {
      navigate(loginRoute);
    }
  };

  useEffect(() => {
    if (!locallyStoredToken) {
      navigate(loginRoute);
    }
    setUsernameInput('');
    setdescriptionInput('');
    if (locallyStoredToken) {
      dispatch(setGroupList());
    }
  }, []);

  const handleClose = (): void => {
    dispatch(setIsError(false));
    dispatch(setError(''));
  };

  const handleGroupNameInputHelperText = () => {
    let messageToDisplay = '';
    if (usernameInput.length && usernameInput.length < minGroupNameLength) {
      messageToDisplay = groupNameInputError;
    } else if (
      usernameInput.length &&
      usernameInput.length > maxGroupNameLength
    ) {
      messageToDisplay = groupMaxLenNameInputError;
    }
    return messageToDisplay;
  };

  const handleRedirectToExistingGroup = (groupID: number): void => {
    const url = `${groupsRoute}/${groupID}`;
    navigate(url);
  };

  return (
    <PokerCreateGroup
      handleCreateGroup={handleCreateGroup}
      usernameInput={usernameInput}
      setUsernameInput={setUsernameInput}
      descriptionInput={descriptionInput}
      setdescriptionInput={setdescriptionInput}
      groupList={groupList}
      handleCloseAlert={handleClose}
      handleCloseSnackbar={handleClose}
      isError={isError}
      errorMessage={errorMessage}
      handleRedirectToExistingGroup={handleRedirectToExistingGroup}
      handleGroupNameInputHelperText={handleGroupNameInputHelperText}
    />
  );
};
