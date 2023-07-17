import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Login from '@Components/Login';
import { setLoading } from '@Redux/actions/LoadingAction';
import { LoginAction, setToken } from '@Redux/actions/LoginAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * A container component that renders a login form for the user to enter their email address and password and
 * log in to the application.
 *
 * @returns A React component that renders a form with input fields for the user's email address and password.
 *          It also includes a submit button to trigger the login process and authenticate the user.
 *
 */
const LoginContainer = (): JSX.Element => {
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const response = useSelector((state: RootState) => state.login);
  const isLoading = useSelector((state: RootState) => state.loading);
  const navigate = useNavigate();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      dispatch(setLoading(true));
      await dispatch(LoginAction(emailInput, passwordInput));
      dispatch(setLoading(false));
    } else {
      navigate('/home');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(setToken(localStorage.getItem('token') || ''));
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [localStorage.getItem('token')]);

  return (
    <Login
      response={response}
      handleClick={handleClick}
      emailInput={emailInput}
      setEmailInput={setEmailInput}
      passwordInput={passwordInput}
      setPasswordInput={setPasswordInput}
      isLoading={isLoading}
    />
  );
};

export default LoginContainer;
