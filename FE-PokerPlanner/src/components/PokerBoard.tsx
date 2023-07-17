import React from 'react';

import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Fade from '@mui/material/Fade';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';

import LoadingSpinner from '@Components/LoadingSpinner';
import {
  GroupDetail,
  PokerPropInterface,
  UserDetail,
} from '@Constants/interfaces';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'name', minWidth: 170 },
  { id: 'description', label: 'description', minWidth: 100 },
  {
    id: 'summary',
    label: 'summary',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

/**
 * To open full screen dialog its transition provided by MUI
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * Adds styling to the modal provided by MUI
 */
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/**
 * Pokerboard dashboard to add members ,add groups ,delete the board, display all existing members on
 * the board, display all the groups added on the board, tickets estimated count
 * @param props
 * @returns {JSX.Element}
 */
export const PokerBoard = (props: PokerPropInterface) => {
  const {
    page,
    rowsPerPage,
    handleChangeRowsPerPage,
    choice,
    isBoardLoading,
    boardDetail,
    isClose,
    setIsClose,
    setMember,
    isCloseGroup,
    setIsCloseGroup,
    group,
    setGroup,
    addMembersToBoardAlertTitle,
    addMembersToBoardsAlertDescription,
    addGroupsToBoardAlertTitle,
    addGroupsToBoardAlertDescription,
    addGroupToBoardErrorText,
    handleEmailValidation,
    handleGroupNameValidation,
    addMemberToBoardErrorText,
    member,
    handleAddMember,
    handleAddGroup,
    isManager,
    handleDeleteBoard,
    openExistingMembers,
    openExistingGroups,
    error,
    isError,
    handleCloseBar,
    handleCloseSnakeBar,
    setSearchInput,
    handleTicketSearch,
    handleRoleSave,
    existingUsers,
    handleModalOpen,
    handleModalClose,
    open,
    setTimer,
    timer,
    setChoice,
    setOpenExistingMembers,
    setOpenExistingGroups,
    setPage,
    handleCreateGameSession,
    handleDeleteMember,
    handleDeleteGroup,
    openTickets,
    setOpenTickets,
  } = props;

  const checkManager = () => {
    const locallyStoredUserID = localStorage.getItem('user_id') || '-1';
    return +locallyStoredUserID === boardDetail.manager.id;
  }

  return (
    <div>
      {isBoardLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ marginLeft: '2%', marginRight: '2%' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
              open={isError}
              autoHideDuration={6000}
              onClose={handleCloseBar}
            >
              <Alert
                onClose={handleCloseSnakeBar}
                severity='error'
                sx={{ width: '100%' }}
              >
                {error}
              </Alert>
            </Snackbar>
          </Stack>
          <div style={{ display: 'flex', marginBottom: '2%', marginTop: '1%' }}>
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
                {addMembersToBoardAlertTitle}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  {addMembersToBoardsAlertDescription}
                </DialogContentText>
                <TextField
                  required
                  error={handleEmailValidation()}
                  helperText={
                    handleEmailValidation() ? addMemberToBoardErrorText : ''
                  }
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
              variant='outlined'
              sx={{ mt: 4, mr: 5, display: !isManager ? 'none' : 'inherit' }}
              onClick={() => setIsClose(false)}
            >
              Add member
            </Button>
            <Dialog
              open={!isCloseGroup}
              onClose={() => {
                setIsCloseGroup(true);
                setGroup('');
              }}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='alert-dialog-title'>
                {addGroupsToBoardAlertTitle}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  {addGroupsToBoardAlertDescription}
                </DialogContentText>
                <TextField
                  required
                  error={handleGroupNameValidation()}
                  helperText={
                    handleGroupNameValidation() ? addGroupToBoardErrorText : ''
                  }
                  sx={{ mt: 2 }}
                  id='outlined-required'
                  label='Name'
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setIsCloseGroup(true);
                    setGroup('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleAddGroup();
                    setIsCloseGroup(true);
                    setGroup('');
                  }}
                  disabled={group.length === 0 || handleGroupNameValidation()}
                  autoFocus
                >
                  Add
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              variant='outlined'
              sx={{ mt: 4, mr: 5, display: !isManager ? 'none' : 'inherit' }}
              onClick={() => setIsCloseGroup(false)}
            >
              Add Group
            </Button>

            <Button
              variant='outlined'
              sx={{ mt: 4, mr: 5, display: !isManager ? 'none' : 'inherit' }}
              onClick={() => handleDeleteBoard()}
            >
              Delete Board
            </Button>
            <Card style={{ height: '50px', width: '300px', marginLeft: '30%' }}>
              <CardContent style={{ display: 'flex' }}>
                <Typography gutterBottom variant='h6' component='div'>
                  Tickets Estimated: {boardDetail.estimated_tickets_cnt}{' '}
                  <ArrowDropDownIcon onClick={() => setOpenTickets(true)} />
                </Typography>
              </CardContent>
            </Card>
            <Dialog
              fullScreen
              open={openTickets}
              onClose={() => setOpenTickets(false)}
              TransitionComponent={Transition}
            >
              <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                  <IconButton
                    edge='start'
                    color='inherit'
                    onClick={() => setOpenTickets(false)}
                    aria-label='close'
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <List>
                {boardDetail?.ticket_list?.length ? (
                  boardDetail.ticket_list?.map((ticketInstance: any) => {
                    return (
                      <div>
                        <ListItem>
                          <ListItemText
                            primary={ticketInstance.jira_ticket.split(';')[0]}
                          />
                        </ListItem>
                        <Divider />
                      </div>
                    );
                  })
                ) : (
                  <p>No Tickets Found</p>
                )}
              </List>
            </Dialog>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h4' gutterBottom>
              {boardDetail.name}
            </Typography>
            <Box
              style={{
                width: '37%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                variant='outlined'
                onClick={() => setOpenExistingMembers(true)}
              >
                Show Existing Members
              </Button>
              <Dialog
                fullScreen
                open={openExistingMembers}
                onClose={() => setOpenExistingMembers(false)}
                TransitionComponent={Transition}
              >
                <AppBar sx={{ position: 'relative' }}>
                  <Toolbar>
                    <IconButton
                      edge='start'
                      color='inherit'
                      onClick={() => setOpenExistingMembers(false)}
                      aria-label='close'
                    >
                      <CloseIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <List>
                  {existingUsers.length ? (
                    existingUsers?.map((userInstance: UserDetail) => {
                      return (
                        <Box>
                          <ListItem>
                            {userInstance.role === 1 ? (
                              <ListItemText
                                primary={userInstance.user_email}
                                secondary='Spectator'
                              />
                            ) : (
                              <ListItemText
                                primary={userInstance.user_email}
                                secondary='Player'
                              />
                            )}
                            <Button
                              autoFocus
                              onClick={() =>
                                handleRoleSave(
                                  userInstance.user,
                                  userInstance.role === 0 ? 1 : 0
                                )
                              }
                            >
                              Change Role
                            </Button>
                            <DeleteIcon
                              onClick={() =>
                                handleDeleteMember(userInstance.user_email)
                              }
                            />
                          </ListItem>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography variant='body1'>No Members Found</Typography>
                  )}
                </List>
              </Dialog>
              <Button
                variant='outlined'
                onClick={() => setOpenExistingGroups(true)}
              >
                Show Existing Groups
              </Button>
              <Dialog
                fullScreen
                open={openExistingGroups}
                onClose={() => setOpenExistingGroups(false)}
                TransitionComponent={Transition}
              >
                <AppBar sx={{ position: 'relative' }}>
                  <Toolbar>
                    <IconButton
                      edge='start'
                      color='inherit'
                      onClick={() => setOpenExistingGroups(false)}
                      aria-label='close'
                    >
                      <CloseIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <List>
                  {boardDetail?.groups?.length ? (
                    boardDetail.groups.map((groupInstance: GroupDetail) => {
                      return (
                        <ListItem>
                          <ListItemText primary={groupInstance.name} />
                          <DeleteIcon
                            onClick={() =>
                              handleDeleteGroup(groupInstance.name)
                            }
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                    <p>No Groups Found</p>
                  )}
                </List>
              </Dialog>
            </Box>
          </div>
          <div>
            <Typography
              variant='h6'
              gutterBottom
              style={{ marginBottom: '2%' }}
            >
              {boardDetail.description}
            </Typography>
          </div>
          <div style={{ marginBottom: '3%' }}>
            <TextField
              id='standard-basic'
              label='Search'
              variant='standard'
              style={{ width: '78%', marginTop: '0.6%' }}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button
              variant='outlined'
              style={{ width: '10%', marginTop: '1.7%', marginLeft: '0.8%' }}
              onClick={(e) => handleTicketSearch(e)}
            >
              Search
            </Button>
            <FormControl sx={{ m: 1, mt: 2.3, minWidth: 120 }}>
              <InputLabel id='demo-controlled-open-select-label'>
                Choices
              </InputLabel>
              <Select
                value={choice}
                label='Choose'
                onChange={(event: SelectChangeEvent<typeof choice>) =>
                  setChoice(+event.target.value)
                }
                size='small'
              >
                <MenuItem value={0}>JQL</MenuItem>
                <MenuItem value={1}>Ticket id</MenuItem>
                <MenuItem value={2}>Sprint</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <Paper sx={{ width: '100%' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label='sticky table'>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center' colSpan={5}>
                        Tickets
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ top: 57, minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {boardDetail?.poker_ticket &&
                      boardDetail?.poker_ticket.map((row: any) => {
                        return (
                          <TableRow hover role='checkbox' tabIndex={-1}>
                            {columns.map((column) => {
                              const value =
                                column.id === 'name'
                                  ? row?.jira_ticket?.split(';')[0]
                                  : column.id === 'summary'
                                  ? row?.summary
                                  : row?.description
                                  ? row?.description
                                  : 'No description found';
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component='div'
                count={boardDetail.poker_ticket.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event: unknown, newPage: number) =>
                  setPage(newPage)
                }
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
          {checkManager() && <Button
            sx={{ mt: 2, mb: 5, ml: 70 }}
            onClick={() => handleModalOpen()}
          >
            Start Game
          </Button>}
          <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={open}
            onClose={handleModalClose}
            closeAfterTransition
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <Typography
                  id='transition-modal-title'
                  variant='h6'
                  component='h2'
                >
                  Enter the timer
                </Typography>
                <TextField
                  type='number'
                  label='Timer'
                  variant='outlined'
                  onChange={(e) => setTimer(+e.target.value)}
                  value={timer}
                />
                <Button onClick={handleCreateGameSession}>Start</Button>
              </Box>
            </Fade>
          </Modal>
        </div>
      )}
    </div>
  );
};
