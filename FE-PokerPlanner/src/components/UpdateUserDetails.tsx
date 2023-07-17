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

import {
  jiraCredentialsMaxLen,
  MAX_LENGTH_VALIDATION,
  UPDATE,
  UPDATE_USER_DETAILS,
} from '@Constants/constants';
import { UpdateUserDetailPropType } from '@Constants/interfaces';

/**
 * To show a page for update user details and update the details and show message on form
 * that the details are updated successfully
 * @param props
 * @returns {JSX.Element}
 */
export const UpdateUserDetails = (props: UpdateUserDetailPropType) => {
  const {
    setFirstName,
    setLastName,
    handleUpdate,
    firstNameError,
    lastNameError,
    handleFirstNameError,
    handleLastNameError,
    message,
    firstName,
    lastName,
    disabled,
    setMessage,
    jiraDomain,
    setJiraDomain,
    jiraAPIToken,
    setJiraAPIToken,
    handleJiraDomainError,
    handleJiraAPITokenError,
    jiraDomainError,
    jiraAPITokenError,
  } = props;

  return (
    <div
      style={{
        margin: '4% 30% 0% 30%',
        paddingBottom: '5%',
        borderRadius: '2%',
        boxShadow: '3px 6px 20px #9E9E9E',
      }}
    >
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '32rem',
          }}
        >
          <Avatar sx={{ m: 1, mt: 3, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' sx={{ mt: 1, mb: 3 }} variant='h5'>
            {UPDATE_USER_DETAILS}
          </Typography>
          <form method='submit' onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} style={{ height: '5rem' }}>
                <TextField
                  required
                  error={firstName.length > MAX_LENGTH_VALIDATION}
                  name='firstName'
                  fullWidth
                  id='firstName'
                  label='First Name'
                  autoFocus
                  onChange={(e) => {
                    setMessage('');
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  helperText={handleFirstNameError()}
                />
              </Grid>
              <Grid item xs={12} sm={12} style={{ height: '5rem' }}>
                <TextField
                  required
                  error={lastName.length > MAX_LENGTH_VALIDATION}
                  fullWidth
                  id='lastName'
                  label='Last Name'
                  name='lastName'
                  onChange={(e) => {
                    setMessage('');
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                  helperText={handleLastNameError()}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 0.3 }}>
              <Grid item xs={12} sm={12} style={{ height: '5rem' }}>
                <TextField
                  error={jiraDomain.length > jiraCredentialsMaxLen}
                  fullWidth
                  label='Jira domain'
                  onChange={(e) => {
                    setMessage('');
                    setJiraDomain(e.target.value);
                  }}
                  value={jiraDomain}
                  helperText={handleJiraDomainError()}
                />
              </Grid>
              <Grid item xs={12} sm={12} style={{ height: '5rem' }}>
                <TextField
                  error={jiraAPIToken.length > jiraCredentialsMaxLen}
                  fullWidth
                  label='Jira API Token'
                  onChange={(e) => {
                    setMessage('');
                    setJiraAPIToken(e.target.value);
                  }}
                  value={jiraAPIToken}
                  helperText={handleJiraAPITokenError()}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              type='submit'
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={
                jiraDomain.length > jiraCredentialsMaxLen ||
                jiraAPIToken.length > jiraCredentialsMaxLen ||
                firstName.length === 0 ||
                lastName.length === 0 ||
                firstName.length > MAX_LENGTH_VALIDATION ||
                lastName.length > MAX_LENGTH_VALIDATION ||
                disabled
              }
            >
              {UPDATE}
            </Button>
            {!firstNameError &&
              !lastNameError &&
              !jiraDomainError &&
              !jiraAPITokenError &&
              message &&
              !disabled && <Alert severity='success'>{message}</Alert>}
          </form>
        </Box>
      </Container>
    </div>
  );
};
