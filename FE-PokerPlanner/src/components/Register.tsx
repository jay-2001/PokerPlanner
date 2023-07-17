import React from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, AlertTitle } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  isNameValid,
  nameError,
  isEmailValid,
  isPasswordValid,
  passwordError,
  isConfirmPasswordValid,
  ConfirmPasswordError,
  statusCodes,
} from '@Constants/constants';
import { RegisterComponentProps } from '@Constants/interfaces';

const theme = createTheme();

/**
 * A presentational component that renders a registration form for the user to enter their personal and account
 * details and sign up for the application.
 *
 * @param props The properties for the component the signup process and any other relevant 
 *              data or event handlers.
 * @returns A React component that renders a form with input fields for the user's name, email address,
 *          password, and other relevant details. It also includes a submit button to create the user's
 *          account and trigger the signup process.

 */
const Register = (props: RegisterComponentProps): JSX.Element => {
  const {
    handleClick,
    isLoading,
    response,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    mail,
    setMail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    localstorage,
  } = props;

  const Copyright = (props: { sx: { mt: number } }): JSX.Element => {
    return (
      <Typography
        variant='body2'
        color='text.secondary'
        align='center'
        {...props}
      >
        {'Copyright ©'}
        <Link color='inherit' href='https://mui.com/'>
          Jay Patel
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    );
  };

  const ShowError = (props: { label: string | undefined }): JSX.Element => {
    const { label } = props;
    return (
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        <strong>{label}</strong>
      </Alert>
    );
  };

  const ShowSuccess = (props: { label: string }): JSX.Element => {
    const { label } = props;
    return (
      <Alert severity='success'>
        <AlertTitle>Success</AlertTitle>
        <strong>{label}</strong>
      </Alert>
    );
  };

  const ShowWarning = (props: { label: string }): JSX.Element => {
    const { label } = props;
    return (
      <Alert severity='warning'>
        <AlertTitle>Warning</AlertTitle>
        <strong>{label}</strong>
      </Alert>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <Box component='form' noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {response.statusCode === statusCodes.restOfCodes && (
                  <ShowError label={response.error} />
                )}
                {response.statusCode === statusCodes.badRequest && (
                  <ShowError label='Account already exists' />
                )}
                {response.statusCode === statusCodes.created && (
                  <ShowSuccess
                    label='Account is created successfully.
                  Activation link has been sent to your email'
                  />
                )}
                {response.statusCode === statusCodes.internalServerError && (
                  <ShowError label='Account already exists' />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  error={isNameValid(firstName)}
                  name='firstName'
                  helperText={isNameValid(firstName) && nameError(firstName)}
                  required
                  fullWidth
                  label='First Name'
                  autoFocus
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={isNameValid(lastName)}
                  autoComplete='given-name'
                  helperText={isNameValid(lastName) && nameError(lastName)}
                  required
                  fullWidth
                  id='lastName'
                  label='Last Name'
                  autoFocus
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={isEmailValid(mail)}
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  onChange={(e) => {
                    setMail(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={isPasswordValid(password)}
                  helperText={
                    isPasswordValid(password) && passwordError(password)
                  }
                  name='password'
                  label='Password'
                  type='password'
                  autoComplete='new-password'
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={isConfirmPasswordValid(password, confirmPassword)}
                  helperText={
                    isConfirmPasswordValid(password, confirmPassword) &&
                    ConfirmPasswordError()
                  }
                  name='confirm_password'
                  label='Confirm password'
                  type='password'
                  id='outlined-start-adornment'
                  autoComplete='new-password'
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <LoadingButton
              type='submit'
              loading={isLoading}
              loadingPosition='end'
              onClick={handleClick}
              disabled={
                firstName === '' ||
                password === '' ||
                confirmPassword === '' ||
                mail === '' ||
                isNameValid(firstName) ||
                (lastName !== '' && isNameValid(lastName)) ||
                isEmailValid(mail) ||
                isPasswordValid(password) ||
                isConfirmPasswordValid(password, confirmPassword) ||
                password !== confirmPassword ||
                localstorage !== null
              }
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </LoadingButton>
            <Grid container justifyContent='flex-end'></Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Register;
