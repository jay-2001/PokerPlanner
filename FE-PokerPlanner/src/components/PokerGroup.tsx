import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import {
  addMemberErrorText,
  addMembersAlertDescription,
  addMembersAlertTitle,
  groupDescriptionMaxLengthToDisplay,
  removeAlertDescription,
  removeAlertTitle,
  showLess,
  showMore,
  snackbarAutoHideDuration,
} from '@Constants/constants';
import { PokerGroupPropsInterface, PokerUserInterface } from '@Constants/interfaces';
import { removeGroupMember } from '@Redux/actions/GroupDetailsAction';

/**
 * A component which shows the details of a group that already exists for a user
 * It shows information like group name, description, members, and admin.
 *
 * Also has a add member button which is available for admin of group only.
 * Admin also has access to remove user functionality as well.
 */
export default (props: PokerGroupPropsInterface): JSX.Element => {
  const {
    isOpen,
    setIsOpen,
    response,
    groupID,
    dispatch,
    member,
    setMember,
    handleAddMember,
    userToDelete,
    setUserToDelete,
    isClose,
    setIsClose,
    expand,
    setExpand,
    handleEmailValidation,
    isError,
    errorMessage,
    handleCloseAlert,
    handleCloseSnackbar,
    handleDescription,
    isAdmin,
    description,
  } = props;

  const renderMembers = (item: PokerUserInterface): JSX.Element => {
    return (
      <div>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{removeAlertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {removeAlertDescription}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                dispatch(removeGroupMember(groupID, userToDelete));
                setIsOpen(false);
              }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <ListItem
          disablePadding
          secondaryAction={
            <IconButton edge='end' aria-label='delete'>
              <DeleteIcon
                sx={{ display: !isAdmin ? 'none' : 'inherit' }}
                onClick={() => {
                  setUserToDelete(item.email);
                  setIsOpen(true);
                }}
              />
            </IconButton>
          }
        >
          <ListItemButton>
            <ListItemText primary={item.email} />
          </ListItemButton>
        </ListItem>
        <Divider />
      </div>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ mt: 4, ml: 5 }} variant='h3' component='div'>
          {response.name}
        </Typography>
        <Dialog
          open={!isClose}
          onClose={() => {
            setIsClose(true);
            setMember('');
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            {addMembersAlertTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {addMembersAlertDescription}
            </DialogContentText>
            <TextField
              required
              error={handleEmailValidation()}
              helperText={handleEmailValidation() ? addMemberErrorText : ''}
              sx={{ mt: 2 }}
              id='outlined-required'
              label='Email'
              value={member}
              onChange={(e) => setMember(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsClose(true);
                setMember('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAddMember();
                setIsClose(true);
                setMember('');
              }}
              disabled={member.length === 0 || handleEmailValidation()}
              autoFocus
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          variant='contained'
          sx={{ mt: 4, mr: 5, display: !isAdmin ? 'none' : 'inherit' }}
          onClick={() => setIsClose(false)}
        >
          Add member
        </Button>
      </Box>
      <Typography sx={{ mb: 2, ml: 5 }} variant='h6' component='div'>
        {handleDescription()}
        <span>
          <Link
            sx={{
              ml: 1,
              display:
                description.length > groupDescriptionMaxLengthToDisplay
                  ? 'inherit'
                  : 'none',
            }}
            underline='hover'
            href=''
            onClick={(e) => {
              e.preventDefault();
              setExpand(!expand);
            }}
          >
            {expand ? showLess : showMore}
          </Link>
        </span>
      </Typography>
      <Typography sx={{ mt: 4, ml: 5 }} variant='h5' component='div'>
        Admin
      </Typography>
      <Typography
        sx={{ mt: 4, mb: 2, ml: 5, fontWeight: 'bold' }}
        variant='h4'
        component='div'
      >
        {response?.admin?.email}
      </Typography>
      <Typography sx={{ mt: 4, mb: 2, ml: 5 }} variant='h5' component='div'>
        Members
      </Typography>
      <List
        sx={{
          ml: 4,
          width: '95%',
        }}
      >
        {response.members.map(renderMembers)}
      </List>
      <Snackbar
        open={isError}
        autoHideDuration={snackbarAutoHideDuration}
        onClose={handleCloseSnackbar}
      >
        <Alert
          variant='filled'
          onClose={handleCloseAlert}
          severity='error'
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
