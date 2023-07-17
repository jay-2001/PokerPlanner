import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { UPDATE_USER_PASSWORD, UPDATE } from '@Constants/constants';
import { UpdatePasswordPropType } from '@Constants/interfaces';

/**
 * To show a page for update user password and update the password and show message on form
 * that the password is updated successfully
 * @param props
 * @returns {JSX.Element}
 */
export const UpdateUserPassword = (props: UpdatePasswordPropType) => {
  const {
    handleUpdate,
    error,
    message,
    setPassword,
    setConfirmPassword,
    disabled,
    password,
    confirmPassword,
    setMessage,
    setError,
  } = props;

  return (
    <div
      style={{
        margin: '10% 30% 0% 30%',
        paddingBottom: '5%',
        borderRadius: '2%',
        boxShadow: '3px 6px 20px #9E9E9E',
      }}
    >
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 350,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            {UPDATE_USER_PASSWORD}
          </Typography>
          <Box component='form' noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}></Grid>
            <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='new-password'
                onChange={(e) => {
                  setMessage('');
                  setError('');
                  setPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                name='password'
                label='Confirm Password'
                type='password'
                id='password'
                autoComplete='new-password'
                onChange={(e) => {
                  setMessage('');
                  setError('');
                  setConfirmPassword(e.target.value);
                }}
              />
            </Grid>
            <Button
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={handleUpdate}
              disabled={
                disabled ||
                password.length === 0 ||
                confirmPassword.length === 0
              }
            >
              {UPDATE}
            </Button>
            {error && (
              <Alert severity='error' style={{ width: '250px' }}>
                {error}
              </Alert>
            )}
            {message && !disabled && (
              <Alert severity='success' style={{ width: '250px' }}>
                {message}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};
