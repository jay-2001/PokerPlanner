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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';

import {
  boardsRightPanelMessage,
  customChoice,
  customChoicesHelperText,
  maxBoardNameLength,
  minBoardNameLength,
  pokerCreateBoardMultilineMaxRows,
  pokerCreateBoardPageStackSpacing,
  snackbarAutoHideDuration,
  boardDescriptionMaxLenInputError,
  maxBoardDescriptionLength,
  choicesList,
  userNotInBoardMessage,
  createNewBoardMessage,
} from '@Constants/constants';
import { PokerCreateBoardPropsInterface } from '@Constants/interfaces';

/**
 * A component which shows the create board page with two input fields
 * one for entering board name, and other for entering board description
 * Has a drop down choice field which is used to choose the voting system for the board
 * And if a user selects custom voting system, gets another input field to enter the
 * custom choices and at last, there is a button used to create board.
 *
 * Also shows a list of board that the logged in user is a part of.
 */
export default (props: PokerCreateBoardPropsInterface): JSX.Element => {
  const {
    isError,
    errorMessage,
    handleCloseAlert,
    handleCloseSnackbar,
    boardNameInput,
    setBoardNameInput,
    boardDescriptionInput,
    setBoardDescriptionInput,
    handleCreateBoard,
    handleRedirectToExistingBoard,
    boardList,
    votingSystem,
    setVotingSystem,
    estimationChoices,
    setEstimationChoices,
    handleCustomChoicesError,
    handleBoardNameInputHelperText,
  } = props;

  const renderBoardList = (props: ListChildComponentProps): JSX.Element => {
    const { index } = props;
    return (
      <ListItem sx={{ borderBottom: 1.5, mb: 2 }} disablePadding>
        <ListItemButton
          onClick={() => handleRedirectToExistingBoard(boardList[index].id)}
        >
          <ListItemText primary={boardList[index].name} />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderMenuItems = (item: string, idx: number) => {
    return <MenuItem value={idx}>{item}</MenuItem>;
  };

  return (
    <Box
      display='flex'
      justifyContent='space-evenly'
      alignItems='center'
      component='form'
      sx={{
        '& .MuiTextField-root': { m: 1.5, width: '40ch' },
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
          {createNewBoardMessage}
        </Typography>
        <Stack spacing={pokerCreateBoardPageStackSpacing}>
          <TextField
            required
            error={
              boardNameInput.length !== 0 &&
              (boardNameInput.length < minBoardNameLength ||
                boardNameInput.length > maxBoardNameLength)
            }
            id='outlined-required'
            label='Board name'
            helperText={handleBoardNameInputHelperText()}
            onChange={(e) => setBoardNameInput(e.target.value)}
          />
          <TextField
            id='outlined-multiline-flexible'
            error={boardDescriptionInput.length > maxBoardDescriptionLength}
            label='Board description'
            multiline
            maxRows={pokerCreateBoardMultilineMaxRows}
            helperText={
              boardDescriptionInput.length > maxBoardDescriptionLength
                ? boardDescriptionMaxLenInputError
                : ''
            }
            onChange={(e) => setBoardDescriptionInput(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel
              sx={{ ml: 1.5, width: 357 }}
              id='demo-simple-select-label'
            >
              Voting System
            </InputLabel>
            <Select
              sx={{ ml: 1.5, width: 357 }}
              required
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={votingSystem}
              label='Voting System'
              onChange={(e) => setVotingSystem(e.target.value as number)}
            >
              {choicesList.map(renderMenuItems)}
            </Select>
          </FormControl>
          <TextField
            required
            error={handleCustomChoicesError()}
            helperText={
              handleCustomChoicesError() ? customChoicesHelperText : ''
            }
            id='outlined-required'
            label='Add custom choices'
            sx={{ display: votingSystem === customChoice ? 'inherit' : 'none' }}
            onChange={(e) => setEstimationChoices(e.target.value)}
          />
          <Button
            variant='contained'
            disabled={
              boardNameInput.length < minBoardNameLength ||
              boardNameInput.length > maxBoardNameLength ||
              boardDescriptionInput.length > maxBoardDescriptionLength ||
              (votingSystem === customChoice &&
                (estimationChoices.length === 0 || handleCustomChoicesError()))
            }
            onClick={handleCreateBoard}
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
            sx={{ mb: 3 }}
            fontFamily={'BlinkMacSystemFont'}
            textAlign={'center'}
          >
            {boardsRightPanelMessage}
          </Typography>
          {boardList.length ? (
            <FixedSizeList
              height={400}
              width={'40ch'}
              itemSize={46}
              itemCount={boardList.length}
              overscanCount={5}
            >
              {renderBoardList}
            </FixedSizeList>
          ) : (
            <Typography fontFamily={'BlinkMacSystemFont'}>
              {userNotInBoardMessage}
            </Typography>
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
