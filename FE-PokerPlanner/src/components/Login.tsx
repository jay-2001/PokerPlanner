import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, AlertTitle, Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  statusCodes,
  isEmailValid,
  isPasswordValid,
} from '@Constants/constants';
import { LoginComponentProps } from '@Constants/interfaces';

const theme = createTheme();

/**
 * A presentational component that renders a login form for the user to enter their email address and password and
 * log in to the application.
 *
 * @param props The properties for the component the login process
 *              and any other relevant data or event handlers.
 * @returns A React component that renders a form with input fields for the user's email address and password.
 *          It also includes a submit button to trigger the login process and authenticate the user.
 */
const Login = (props: LoginComponentProps): JSX.Element => {
  const {
    response,
    handleClick,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    isLoading,
  } = props;

  const Copyright = (props: {
    sx: { mt: number; mb: number };
  }): JSX.Element => {
    return (
      <Typography
        variant='body2'
        color='text.secondary'
        align='center'
        {...props}
      >
        {`Copyright © Team-7 ${new Date().getFullYear()}`}
      </Typography>
    );
  };

  const ShowError = (props: { label: string }): JSX.Element => {
    const { label } = props;
    return (
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box component='form' noValidate sx={{ mt: 1 }}>
            <Grid item xs={12}>
              {response.errorStatusCode === statusCodes.badRequest && (
                <ShowError label='Invalid credentials' />
              )}
            </Grid>
            <TextField
              margin='normal'
              required
              fullWidth
              value={emailInput}
              error={isEmailValid(emailInput)}
              label='Email Address'
              onChange={(e) => setEmailInput(e.target.value)}
              autoFocus
            />
            <TextField
              margin='normal'
              required
              value={passwordInput}
              error={isPasswordValid(passwordInput)}
              fullWidth
              label='Password'
              type='password'
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <LoadingButton
              type='submit'
              loading={isLoading}
              onClick={handleClick}
              disabled={
                isEmailValid(emailInput) ||
                isPasswordValid(passwordInput) ||
                emailInput === '' ||
                passwordInput === ''
              }
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
