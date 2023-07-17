import React from 'react';

import { Button } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import LoadingSpinner from '@Components/LoadingSpinner';
import { LineChart } from '@Components/UserProfileTicketChart';
import {
  EDIT_DETAILS,
  EDIT_PASSWORD,
  FULL_NAME,
  EMAIL,
  MY_GROUPS,
  MY_BOARDS,
  NO_GROUPS_FOUND,
  NO_BOARDS_FOUND,
  MY_TICKETS,
  NO_TICKETS_FOUND,
} from '@Constants/constants';
import {
  Column,
  ColumnBoard,
  ColumnTicket,
  GroupDetail,
  BoardDetail,
  PropType,
  Ticket,
} from '@Constants/interfaces';
import '@Styles/UserProfile.css';

const columns: Column[] = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'admin_name', label: 'Admin Name', minWidth: 50 },
  { id: 'description', label: 'Description', minWidth: 50 },
];

const columnboard: ColumnBoard[] = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'board_manager', label: 'Board Manager', minWidth: 50 },
  { id: 'board_type', label: 'Ticket Type', minWidth: 50 },
  { id: 'board_description', label: 'Description', minWidth: 50 },
];

const columnticket: ColumnTicket[] = [
  { id: 'jira_ticket', label: 'Ticket ID', minWidth: 100 },
  { id: 'final_estimate', label: 'Final Estimate', minWidth: 50 },
  { id: 'summary', label: 'Summary', minWidth: 50 },
  { id: 'description', label: 'Description', minWidth: 50 },
];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

/**
 * To show the details of the user and tickets he has estimated, boards he is part of, groups he
 * is present in
 * @param props
 * @returns {JSX.Element}
 */
const UserProfile = (props: PropType) => {
  const {
    handleChangePage,
    handleChangePageBoard,
    handleChangePageTicket,
    handleClose,
    handleCloseBar,
    updatePassword,
    updateFields,
    userDetail,
    groupsOfUser,
    boardsOfUser,
    ticketsOfUser,
    error,
    iserror,
    page,
    pageBoard,
    pageTicket,
    isProfileLoading,
    isGroupLoading,
    isBoardLoading,
    isTicketLoading,
  } = props;

  return (
    <div>
      <div>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={iserror}
            autoHideDuration={6000}
            onClose={handleCloseBar}
          >
            <Alert
              onClose={handleClose}
              severity='error'
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>
        </Stack>
        {isProfileLoading ? (
          <LoadingSpinner />
        ) : (
          <div className='container'>
            <div className='main-body'>
              <div className='row gutters-sm'>
                <div className='col-md-8'>
                  <div className='card mb-3'>
                    <div className='card-body'>
                      {!error && (
                        <div style={{ float: 'right' }}>
                          <Button
                            variant='contained'
                            size='small'
                            type='button'
                            onClick={updateFields}
                          >
                            {EDIT_DETAILS}
                          </Button>
                          <Button
                            variant='contained'
                            style={{ marginLeft: '2px' }}
                            size='small'
                            type='button'
                            onClick={updatePassword}
                          >
                            {EDIT_PASSWORD}
                          </Button>
                        </div>
                      )}
                      <div className='row'>
                        <img
                          src='https://bootdey.com/img/Content/avatar/avatar7.png'
                          alt='Admin'
                          className='rounded-circle'
                          width='150'
                        ></img>
                        <div className='col-sm-3'>
                          <h6 className='mb-0'>{FULL_NAME}</h6>
                        </div>
                        <div className='col-sm-9 text-secondary'>
                          {userDetail?.first_name && (
                            <p>
                              {userDetail?.first_name || ''}{' '}
                              {userDetail?.last_name || ''}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-sm-3'>
                          <h6 className='mb-0'>{EMAIL}</h6>
                        </div>
                        <div className='col-sm-9 text-secondary'>
                          <p>{userDetail['email'] || ''} </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginLeft: '6%' }}>
        {isGroupLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <Typography variant='h5' gutterBottom>
              {MY_GROUPS}
            </Typography>
            {groupsOfUser.results?.length ? (
              <div>
                <Paper
                  sx={{
                    width: '90%',
                    overflow: 'hidden',
                    marginTop: '1%',
                    marginBottom: '2%',
                  }}
                >
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                backgroundColor: 'rgb(25, 118, 210)',
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupsOfUser.results.map(
                          (groupInstance: GroupDetail) => {
                            return (
                              <TableRow hover role='checkbox' tabIndex={-1}>
                                {columns.map((column) => {
                                  const value =
                                    column.id === 'name'
                                      ? groupInstance.name
                                      : column.id === 'description'
                                      ? `${groupInstance?.description?.substr(
                                          0,
                                          40
                                        )}`
                                      : groupInstance.admin_first_name +
                                        ' ' +
                                        groupInstance?.admin_last_name;

                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {column.format &&
                                      typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    style={{ marginLeft: '40%' }}
                    disabled={groupsOfUser.previous === null}
                    onClick={() => handleChangePage(page - 1)}
                  >
                    Prev
                  </Button>
                  <Button
                    disabled={groupsOfUser.next === null}
                    onClick={() => handleChangePage(page + 1)}
                  >
                    Next
                  </Button>
                </Paper>
              </div>
            ) : (
              <p>{NO_GROUPS_FOUND}</p>
            )}
          </div>
        )}
        {isBoardLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <Typography variant='h5' gutterBottom>
              {MY_BOARDS}
            </Typography>
            {boardsOfUser?.results?.length ? (
              <div>
                <Paper
                  sx={{
                    width: '90%',
                    overflow: 'hidden',
                    marginTop: '1%',
                    marginBottom: '2%',
                  }}
                >
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead>
                        <TableRow>
                          {columnboard.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                backgroundColor: 'rgb(25, 118, 210)',
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {boardsOfUser?.results.map(
                          (boardInstance: BoardDetail) => {
                            return (
                              <TableRow hover role='checkbox' tabIndex={-1}>
                                {columnboard.map((column) => {
                                  const value =
                                    column.id === 'name'
                                      ? boardInstance.name
                                      : column.id === 'board_manager'
                                      ? boardInstance.manager_first_name +
                                        ' ' +
                                        boardInstance?.manager_last_name
                                      : column.id === 'board_type'
                                      ? boardInstance.voting_system
                                      : boardInstance?.description;
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {column.format &&
                                      typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    style={{ marginLeft: '40%' }}
                    disabled={boardsOfUser.previous === null}
                    onClick={() =>
                      handleChangePageBoard(
                        boardsOfUser.previous === null
                          ? pageBoard
                          : pageBoard - 1
                      )
                    }
                  >
                    Prev
                  </Button>
                  <Button
                    disabled={boardsOfUser.next === null}
                    onClick={() =>
                      handleChangePageBoard(
                        boardsOfUser.next === null ? pageBoard : pageBoard + 1
                      )
                    }
                  >
                    Next
                  </Button>
                </Paper>
              </div>
            ) : (
              <p>{NO_BOARDS_FOUND}</p>
            )}
          </div>
        )}
        {isTicketLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <Typography variant='h5' gutterBottom>
              {MY_TICKETS}
            </Typography>
            {ticketsOfUser?.results?.length ? (
              <div>
                <Paper
                  sx={{
                    width: '90%',
                    overflow: 'hidden',
                    marginTop: '1%',
                    marginBottom: '2%',
                  }}
                >
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead>
                        <TableRow>
                          {columnticket.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                backgroundColor: 'rgb(25, 118, 210)',
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ticketsOfUser.results?.map(
                          (ticketInstance: Ticket) => {
                            return (
                              <TableRow hover role='checkbox' tabIndex={-1}>
                                {columnticket.map((column) => {
                                  const value =
                                    column.id === 'jira_ticket'
                                      ? ticketInstance.ticket_detail.jira_ticket
                                      : column.id === 'final_estimate'
                                      ? ticketInstance.ticket_detail
                                          .final_estimation
                                      : column.id === 'summary'
                                      ? ticketInstance.ticket_detail.summary
                                      : ticketInstance.ticket_detail
                                          .description;
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {column.format &&
                                      typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    style={{ marginLeft: '40%' }}
                    disabled={ticketsOfUser.previous === null}
                    onClick={() =>
                      handleChangePageTicket(
                        ticketsOfUser.previous === null
                          ? pageTicket
                          : pageTicket - 1
                      )
                    }
                  >
                    Prev
                  </Button>
                  <Button
                    disabled={ticketsOfUser.next === null}
                    onClick={() =>
                      handleChangePageTicket(
                        ticketsOfUser.next === null
                          ? pageTicket
                          : pageTicket + 1
                      )
                    }
                  >
                    Next
                  </Button>
                </Paper>
              </div>
            ) : (
              <p>{NO_TICKETS_FOUND}</p>
            )}
          </div>
        )}
      </div>
      <LineChart />
    </div>
  );
};

export default UserProfile;
