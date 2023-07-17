import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Register from '@Components/Register';
import { nameError, passwordError, validEmail } from '@Constants/constants';
import { RegisterUserInterafce } from '@Constants/interfaces';
import { setLoading } from '@Redux/actions/LoadingAction';
import {
  registerAction,
  setRegisterUserError,
} from '@Redux/actions/RegisterAction';
import { RootState, AppDispatch } from '@Redux/store/store';

/**
 * A container component that renders a registration form for the user to enter their personal and account
 * details and sign up for the application.
 *
 * @returns A React component that renders a form with input fields for the user's name, email address,
 *          password, and other relevant details. It also includes a submit button to create the user's
 *          account and trigger the signup process.
 */
function RegisterContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const response: RegisterUserInterafce = useSelector(
    (state: RootState) => state.register
  );
  const isLoading: boolean = useSelector((state: RootState) => state.loading);
  const localstorage = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (localstorage) {
      navigate('/home');
    } else {
      navigate('/register');
    }
  }, [localstorage]);

  const formIsValid = () => {
    if (nameError(firstName)) {
      return 'First Name is Not Valid';
    }

    if (passwordError(password)) {
      return 'Password is Not Valid';
    }

    if (!validEmail.test(mail)) {
      return 'Email is Not Valid';
    }

    if (password !== confirmPassword) {
      return 'password ans confirm password should be same';
    }
    return true;
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const userData: RegisterUserInterafce = {
      first_name: firstName,
      last_name: lastName,
      email: mail,
      password: password,
    };
    const validationData = formIsValid();
    if (validationData === true && !localStorage.getItem('token')) {
      dispatch(setLoading(true));
      await dispatch(registerAction(userData));
      dispatch(setLoading(false));
    } else {
      dispatch(setRegisterUserError(validationData, 999));
    }
  };

  return (
    <Register
      handleClick={handleClick}
      response={response}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      mail={mail}
      setMail={setMail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
      localstorage={localstorage}
    />
  );
}

export default RegisterContainer;
