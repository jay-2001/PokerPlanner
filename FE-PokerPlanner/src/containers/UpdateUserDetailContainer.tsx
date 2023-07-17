import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { updateUserDetail } from '@Redux/actions/UserProfileActions';
import { UpdateUserDetails } from '@Components/UpdateUserDetails';
import {
  MAX_LENGTH_VALIDATION,
  ERROR_FIRST_NAME_MORE,
  ERROR_LAST_NAME_MORE,
  PROFILE_UPDATE_SUCCESS,
  jiraCredentialsMaxLen,
  jiraDomainErrorMessage,
  jiraAPITokenErrorMessage,
} from '@Constants/constants';
import { RootState, AppDispatch } from '@Redux/store/store';

/**
 * This container is to render the Update User Profile component
 */
export const UpdateUserDetailContainer = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const isLoading: boolean = useSelector(
    (state: RootState) => state.IsProfileLoading
  );
  const user_id = JSON.parse(localStorage.getItem('user_id') || '');
  const dispatch: AppDispatch = useDispatch();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [jiraDomain, setJiraDomain] = useState<string>('');
  const [jiraAPIToken, setJiraAPIToken] = useState<string>('');
  const [jiraDomainError, setJiraDomainError] = useState<boolean>(false);
  const [jiraAPITokenError, setJiraAPITokenError] = useState<boolean>(false);

  useEffect(() => {
    isLoading ? setDisabled(true) : setDisabled(false);
  }, [isLoading]);

  const handleFirstNameError = () => {
    if (firstName.length > MAX_LENGTH_VALIDATION) {
      setFirstNameError(ERROR_FIRST_NAME_MORE);
      return ERROR_FIRST_NAME_MORE;
    } else {
      setFirstNameError('');
      return '';
    }
  };

  const handleLastNameError = () => {
    if (lastName.length > MAX_LENGTH_VALIDATION) {
      setLastNameError(ERROR_LAST_NAME_MORE);
      return ERROR_LAST_NAME_MORE;
    } else {
      setLastNameError('');
      return '';
    }
  };

  const handleJiraDomainError = () => {
    let errorMsg = '';
    if (jiraDomain.length > jiraCredentialsMaxLen) {
      setJiraDomainError(true);
      errorMsg = jiraDomainErrorMessage;
    } else {
      setJiraDomainError(false);
      errorMsg = '';
    }
    return errorMsg;
  };

  const handleJiraAPITokenError = () => {
    let errorMsg = '';
    if (jiraAPIToken.length > jiraCredentialsMaxLen) {
      setJiraAPITokenError(true);
      errorMsg = jiraAPITokenErrorMessage;
    } else {
      setJiraAPITokenError(false);
      errorMsg = '';
    }
    return errorMsg;
  };

  /**
   * To check validations for user details to be updated and update the user details
   */
  const handleUpdate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (user_id) {
      dispatch(
        updateUserDetail(user_id, {
          first_name: firstName,
          last_name: lastName,
          jira_domain: jiraDomain,
          jira_api_token: jiraAPIToken,
        })
      );
      setMessage(PROFILE_UPDATE_SUCCESS);
    } else {
      navigate('/NotFound');
    }
  };

  return (
    <UpdateUserDetails
      setFirstName={setFirstName}
      setLastName={setLastName}
      handleUpdate={handleUpdate}
      firstNameError={firstNameError}
      lastNameError={lastNameError}
      handleFirstNameError={handleFirstNameError}
      handleLastNameError={handleLastNameError}
      message={message}
      firstName={firstName}
      lastName={lastName}
      disabled={disabled}
      setMessage={setMessage}
      jiraDomain={jiraDomain}
      setJiraDomain={setJiraDomain}
      jiraAPIToken={jiraAPIToken}
      setJiraAPIToken={setJiraAPIToken}
      handleJiraDomainError={handleJiraDomainError}
      handleJiraAPITokenError={handleJiraAPITokenError}
      jiraDomainError={jiraDomainError}
      jiraAPITokenError={jiraAPITokenError}
    />
  );
};
