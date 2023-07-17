import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import {
  TextField,
  Box,
  Button,
  Stack,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';

import {
  createNewGroupMessage,
  groupDescriptionMaxLenInputError,
  groupsRightPanelMessage,
  maxGroupDescriptionLength,
  maxGroupNameLength,
  minGroupNameLength,
  pokerCreateGroupMultilineMaxRows,
  pokerCreateGroupPageStackSpacing,
  snackbarAutoHideDuration,
  userNotInGroupMessage,
} from '@Constants/constants';
import { PokerCreateGroupPropsInterface } from '@Constants/interfaces';

/**
 * A component which shows the create group page with two input fields
 * one for entering group name, and other for entering group description
 * and a button which creates the group.
 *
 * Also shows a list of groups that the logged in user is a part of.
 */
export default (props: PokerCreateGroupPropsInterface): JSX.Element => {
  const {
    handleCreateGroup,
    groupList,
    usernameInput,
    setUsernameInput,
    descriptionInput,
    setdescriptionInput,
    handleCloseAlert,
    handleCloseSnackbar,
    isError,
    errorMessage,
    handleRedirectToExistingGroup,
    handleGroupNameInputHelperText,
  } = props;

  const renderGroupList = (props: ListChildComponentProps): JSX.Element => {
    const { index, style } = props;
    return (
      <ListItem style={style} disablePadding>
        <ListItemButton
          onClick={() => handleRedirectToExistingGroup(groupList[index].id)}
        >
          <ListItemText
            sx={{ borderBottom: 1.5 }}
            primary={groupList[index].name}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box
      display='flex'
      justifyContent='space-evenly'
      alignItems='center'
      component='form'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '40ch' },
        height: '55ch',
      }}
      noValidate
      autoComplete='off'
    >
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          width: 'auto',
          mb: 3,
        }}
      >
        <Typography
          sx={{ mb: 4 }}
          fontFamily={'BlinkMacSystemFont'}
          variant='h6'
          textAlign={'center'}
        >
          {createNewGroupMessage}
        </Typography>
        <Stack spacing={pokerCreateGroupPageStackSpacing}>
          <TextField
            required
            error={
              usernameInput.length !== 0 &&
              (usernameInput.length < minGroupNameLength ||
                usernameInput.length > maxGroupNameLength)
            }
            id='outlined-required'
            label='Group name'
            helperText={handleGroupNameInputHelperText()}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <TextField
            id='outlined-multiline-flexible'
            error={descriptionInput.length > maxGroupDescriptionLength}
            helperText={
              descriptionInput.length > maxGroupDescriptionLength
                ? groupDescriptionMaxLenInputError
                : ''
            }
            label='Group description'
            multiline
            maxRows={pokerCreateGroupMultilineMaxRows}
            onChange={(e) => setdescriptionInput(e.target.value)}
          />
          <Button
            variant='contained'
            disabled={
              usernameInput.length < minGroupNameLength ||
              usernameInput.length > maxGroupNameLength ||
              descriptionInput.length > maxGroupDescriptionLength
            }
            onClick={handleCreateGroup}
          >
            Create
          </Button>
        </Stack>
      </Paper>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          width: 'auto',
          mb: 3,
        }}
      >
        <Box display={'flex'} flexDirection='column' justifyContent={'center'}>
          <Typography
            fontFamily={'BlinkMacSystemFont'}
            sx={{ mb: 3 }}
            textAlign={'center'}
          >
            {groupsRightPanelMessage}
          </Typography>
          {groupList.length ? (
            <FixedSizeList
              height={400}
              width={'40ch'}
              itemSize={46}
              itemCount={groupList.length}
              overscanCount={5}
            >
              {renderGroupList}
            </FixedSizeList>
          ) : (
            <Typography>{userNotInGroupMessage}</Typography>
          )}
        </Box>
      </Paper>
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
