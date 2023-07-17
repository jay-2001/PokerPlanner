import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateUserDetail } from '@Redux/actions/UserProfileActions';
import { UpdateUserPassword } from '@Components/UpdateUserPassword';
import {
  MIN_LENGTH_PASSWORD_VALIDATION,
  PASSWORD_DONT_MATCH_ERROR,
  MIN_LENGTH_PASSWORD_ERROR,
} from '@Constants/constants';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * This container is to render the Update User Password component
 */
export const UpdateUserPasswordContainer = () => {
  const userId = JSON.parse(localStorage.getItem('user_id') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const isLoading: boolean = useSelector(
    (state: RootState) => state.IsProfileLoading
  );
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    isLoading ? setDisabled(true) : setDisabled(false);
  }, [isLoading]);

  /**
   * to check the validations and update password if valid passwords are entered
   */
  const handleUpdate = () => {
    if (password.length < MIN_LENGTH_PASSWORD_VALIDATION)
      setError(MIN_LENGTH_PASSWORD_ERROR);
    else if (password !== confirmPassword) setError(PASSWORD_DONT_MATCH_ERROR);
    else {
      dispatch(
        updateUserDetail(userId, {
          password: password,
        })
      );
      setMessage('Password Updated Successfully');
    }
  };

  return (
    <UpdateUserPassword
      handleUpdate={handleUpdate}
      error={error}
      message={message}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      disabled={disabled}
      password={password}
      confirmPassword={confirmPassword}
      setMessage={setMessage}
      setError={setError}
    />
  );
};
