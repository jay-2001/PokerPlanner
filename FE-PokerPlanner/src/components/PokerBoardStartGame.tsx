import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import FaceIcon from '@mui/icons-material/Face';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import {
  allEstimationsTitleMessage,
  boardsRoute,
  commentFailureDescription,
  commentFailureTitle,
  commentSuccessDescription,
  commentSuccessTitle,
  finalEstimationHelperText,
  finalEstimationMaxValueError,
  gameEndedDescription,
  gameStateChoices,
  maxAllowedCommentLen,
  noEstimationsYetMessage,
  nonManagerPanelTitle,
  roles,
  ticketCommentError,
} from '@Constants/constants';
import { PokerBoardStartGameComponentProps } from '@Constants/interfaces';

/**
 * A component which is the main game page where user will be giving their estimations
 * It shows information like ticket summary, description, user estimation, and users who
 * have estimated till now
 */
export default (props: PokerBoardStartGameComponentProps): JSX.Element => {
  const {
    handleCardClick,
    ticket,
    userSelection,
    usersWhoSelected,
    boardSession,
    timeLeft,
    locallyStoredUserID,
    managerPanelList,
    currentGameState,
    handleStartTimer,
    handleSkipTicket,
    finalEstimation,
    setFinalEstimation,
    checkFinalEstimationError,
    handleNextTicket,
    userEstimations,
    handleEndGame,
    role,
    isModalOpen,
    setIsModalOpen,
    navigate,
    boardID,
    comment,
    setComment,
    handleAddComment,
    isCommentModalOpen,
    setIsCommentModalOpen,
    isError,
  } = props;

  const isUserManager = (): boolean => {
    return boardSession.board?.manager?.id === locallyStoredUserID;
  };

  const renderUsersList = (props: ListChildComponentProps): JSX.Element => {
    const { index, style } = props;
    return (
      <ListItem style={style} disablePadding>
        <ListItemText primary={usersWhoSelected[index]} />
      </ListItem>
    );
  };

  const renderManagerList = (props: ListChildComponentProps): JSX.Element => {
    const { index, style } = props;
    return (
      <ListItem style={style} disablePadding>
        <ListItemText
          primary={`${managerPanelList[index].email}: ${managerPanelList[index].card}`}
        />
      </ListItem>
    );
  };

  const renderFinalEstimationPanel = (): JSX.Element => {
    return isUserManager() ? (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <TextField
            sx={{ m: 2 }}
            required
            id='outlined-required'
            label='Final estimation'
            value={finalEstimation}
            onChange={(e) => setFinalEstimation(e.target.value)}
            error={checkFinalEstimationError() || +finalEstimation > 2147483647}
            helperText={
              checkFinalEstimationError()
                ? finalEstimationHelperText
                : +finalEstimation > 2147483647
                ? finalEstimationMaxValueError
                : ''
            }
          />
          <Button
            sx={{ m: 2, background: '#1a35a2', color: 'white' }}
            variant='contained'
            onClick={handleEndGame}
          >
            End game
          </Button>
          <Button
            disabled={
              !finalEstimation.length ||
              checkFinalEstimationError() ||
              +finalEstimation > 2147483647
            }
            sx={{ m: 2, background: '#1a35a2', color: 'white' }}
            variant='contained'
            onClick={handleNextTicket}
          >
            Next ticket
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <TextField
            sx={{ m: 2 }}
            variant='outlined'
            label='Comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            error={comment.length > maxAllowedCommentLen}
            helperText={
              comment.length > maxAllowedCommentLen ? ticketCommentError : ''
            }
          />
          <Button
            sx={{ m: 2, background: '#1a35a2', color: 'white' }}
            variant='contained'
            disabled={
              comment.length === 0 || comment.length > maxAllowedCommentLen
            }
            onClick={handleAddComment}
          >
            Comment
          </Button>
        </Box>
      </Box>
    ) : (
      <Box></Box>
    );
  };

  const renderBeforeStartingTimer = () => {
    return isUserManager() ? (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Button
          sx={{ m: 4, color: 'white' }}
          variant='contained'
          color='success'
          onClick={handleStartTimer}
        >
          Start Timer
        </Button>
        <Button
          sx={{ m: 4, color: 'white' }}
          variant='contained'
          color='warning'
          onClick={handleSkipTicket}
        >
          Skip Ticket
        </Button>
      </Box>
    ) : (
      <Box></Box>
    );
  };

  const renderCompleteUserEstimations = (): JSX.Element[] => {
    return Object.keys(userEstimations).map((email: string, idx: number) => {
      return (
        <List key={idx}>
          <ListItem>
            <ListItemText primary={`${email}: ${userEstimations[email]}`} />
          </ListItem>
        </List>
      );
    });
  };

  return (
    <Box sx={{ background: '#eceeee', m: -6, height: '90ch' }}>
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
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            mt: 5,
            mb: 5,
            ml: 7,
          }}
        >
          <Paper sx={{ background: '#1a35a2', color: 'white', ml: 6 }}>
            <Typography
              variant='body1'
              sx={{
                textAlign: 'center',
                fontFamily: 'BlinkMacSystemFont',
                mt: 2,
                pr: 6,
                pl: 3,
              }}
            >
              {boardSession.board.name}
            </Typography>
          </Paper>
          <Paper
            sx={{
              background: '#1a35a2',
              color: 'white',
              display: 'flex',
              flexDirection: 'row',
              pr: 6,
              pl: 2,
              ml: '55rem',
            }}
          >
            <FaceIcon sx={{ mt: 2, mr: 2 }} />
            <ListItemText
              sx={{ maxWidth: '6rem' }}
              disableTypography
              primary={
                <Typography fontFamily={'BlinkMacSystemFont'}>You</Typography>
              }
              secondary={
                <Typography fontFamily={'BlinkMacSystemFont'}>
                  {role === roles.player ? 'Player' : 'Spectator'}
                </Typography>
              }
            />
          </Paper>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            height: '30ch',
            mt: '2rem',
          }}
        >
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '30ch',
              width: '50ch',
              mr: '7rem',
            }}
          >
            <AppBar
              position='static'
              color='default'
              elevation={0}
              sx={{
                background: '#1a35a2',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              <Toolbar>
                <Grid
                  container
                  spacing={2}
                  alignItems='center'
                  justifyContent='center'
                >
                  <Grid item>
                    <Typography
                      fontFamily={'BlinkMacSystemFont'}
                      color={'white'}
                      variant='h6'
                      component='div'
                    >
                      {'Ticket details'}
                    </Typography>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <Typography
              sx={{
                ml: 1,
                mt: 2,
                fontFamily: 'BlinkMacSystemFont',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
              variant='h4'
              component='div'
            >
              {ticket.summary}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                ml: 1,
                fontFamily: 'BlinkMacSystemFont',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
              variant='h6'
              component='div'
            >
              {ticket.description}
            </Typography>
          </Paper>
          <Box
            sx={{
              display: isUserManager() ? 'none' : 'flex',
            }}
          >
            {!(
              currentGameState === gameStateChoices.afterTimerEndsState &&
              timeLeft === 0
            ) ? (
              <Paper
                sx={{
                  flexDirection: 'column',
                  height: 'auto',
                  width: '45ch',
                }}
              >
                <AppBar
                  position='static'
                  color='default'
                  elevation={0}
                  sx={{
                    background: '#1a35a2',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Toolbar>
                    <Grid
                      container
                      spacing={2}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Grid item>
                        <Typography
                          fontFamily={'BlinkMacSystemFont'}
                          color={'white'}
                          variant='h6'
                          component='div'
                        >
                          {nonManagerPanelTitle}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Toolbar>
                </AppBar>
                <Box sx={{ mt: 1, ml: 5 }}>
                  {usersWhoSelected.length ? (
                    <FixedSizeList
                      style={{ marginLeft: '4ch' }}
                      height={230}
                      width={'44ch'}
                      itemSize={30}
                      itemCount={usersWhoSelected.length}
                      overscanCount={5}
                    >
                      {renderUsersList}
                    </FixedSizeList>
                  ) : (
                    <Typography
                      sx={{ mt: 1, ml: 5, fontFamily: 'BlinkMacSystemFont' }}
                      variant='body1'
                      component='div'
                    >
                      {noEstimationsYetMessage}
                    </Typography>
                  )}
                </Box>
              </Paper>
            ) : (
              <Paper
                sx={{
                  flexDirection: 'column',
                  height: 'auto',
                  width: '50ch',
                }}
              >
                <AppBar
                  position='static'
                  color='default'
                  elevation={0}
                  sx={{
                    background: '#1a35a2',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Toolbar>
                    <Grid
                      container
                      spacing={2}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Grid item>
                        <Typography
                          fontFamily={'BlinkMacSystemFont'}
                          color={'white'}
                          variant='h6'
                          component='div'
                        >
                          {allEstimationsTitleMessage}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Toolbar>
                </AppBar>
                <Box sx={{ mt: 1, ml: 5 }}>
                  {renderCompleteUserEstimations()}
                </Box>
              </Paper>
            )}
          </Box>
          <Paper
            sx={{
              display: isUserManager() ? 'inherit' : 'none',
              flexDirection: 'column',
              height: 'auto',
              width: '50ch',
              alignItems: 'center',
            }}
          >
            <AppBar
              position='static'
              color='default'
              elevation={0}
              sx={{
                background: '#1a35a2',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              <Toolbar>
                <Grid
                  container
                  spacing={2}
                  alignItems='center'
                  justifyContent='center'
                >
                  <Grid item>
                    <Typography
                      fontFamily={'BlinkMacSystemFont'}
                      color={'white'}
                      variant='h6'
                      component='div'
                    >
                      {'Manager panel'}
                    </Typography>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <Box>
              {managerPanelList.length !== 0 ? (
                <FixedSizeList
                  style={{ marginLeft: '4ch', marginTop: '1ch' }}
                  height={230}
                  width={'44ch'}
                  itemSize={50}
                  itemCount={managerPanelList.length}
                  overscanCount={5}
                >
                  {renderManagerList}
                </FixedSizeList>
              ) : (
                <Typography fontFamily={'BlinkMacSystemFont'}>
                  {noEstimationsYetMessage}
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
        {currentGameState === gameStateChoices.timerOngoingState && (
          <Box
            sx={{
              mt: '3rem',
              ml: '-6rem',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AccessTimeFilledIcon
              sx={{ fontSize: '3rem', color: '#1a35a2', ml: '4rem' }}
            />
            <Typography
              sx={{ ml: 1, fontFamily: 'BlinkMacSystemFont' }}
              variant='body1'
            >
              {timeLeft} seconds
            </Typography>
            {isUserManager() && (
              <Button
                sx={{ ml: 4, color: 'white' }}
                variant='contained'
                color='error'
                onClick={handleStartTimer}
              >
                Reset Timer
              </Button>
            )}
            {userSelection !== '' && (
              <Typography
                sx={{
                  ml: '10rem',
                  fontFamily: 'BlinkMacSystemFont',
                }}
                variant='h6'
                component='div'
              >
                Your estimate: {userSelection}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ mt: '4rem' }}>
          {currentGameState === gameStateChoices.beforeTimerStartsState &&
            renderBeforeStartingTimer()}
          {currentGameState === gameStateChoices.timerOngoingState &&
            role === roles.player && (
              <Box>
                <Typography
                  fontFamily={'BlinkMacSystemFont'}
                  variant='body1'
                  textAlign={'center'}
                >
                  Choose your card 👇
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <List sx={{ display: 'flex', flexDirection: 'row' }}>
                    {boardSession.board.estimation_choices.map(
                      (card: number, index: number) => (
                        <ListItem key={index}>
                          <Button
                            value={card}
                            variant='contained'
                            sx={{
                              background: '#1a35a2',
                              color: 'white',
                              height: '5.5rem',
                            }}
                            onClick={handleCardClick}
                            disabled={timeLeft === 0}
                          >
                            {card}
                          </Button>
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
              </Box>
            )}
          {currentGameState === gameStateChoices.afterTimerEndsState &&
            renderFinalEstimationPanel()}
        </Box>
        <Dialog
          open={isModalOpen}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            fontFamily={'BlinkMacSystemFont'}
            id='alert-dialog-title'
          >
            Game ended
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              fontFamily={'BlinkMacSystemFont'}
              id='alert-dialog-description'
            >
              {gameEndedDescription}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant='contained'
              sx={{ background: '#1a35a2', fontFamily: 'BlinkMacSystemFont' }}
              onClick={(e) => {
                navigate(`${boardsRoute}/${boardID}`);
                setIsModalOpen(false);
              }}
              autoFocus
            >
              Get back
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            fontFamily={'BlinkMacSystemFont'}
            id='alert-dialog-title'
          >
            {!isError ? commentSuccessTitle : commentFailureTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              fontFamily={'BlinkMacSystemFont'}
              id='alert-dialog-description'
            >
              {!isError ? commentSuccessDescription : commentFailureDescription}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};
