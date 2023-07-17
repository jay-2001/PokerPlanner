import { MouseEventHandler, SyntheticEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { SnackbarCloseReason } from '@mui/base';

import { AppDispatch } from '@Redux/store/store';

export interface CreateGroupInterface {
  groupName: string;
  groupDescription?: string;
}

export interface CreateBoardInterface {
  boardName: string;
  boardDescription?: string;
  voting_system: number | undefined;
  estimation_choices: number[];
}

export interface SetGroupDetailsInterface {
  id: number | undefined;
  name: string;
  description: string;
  admin: PokerUserInterface | undefined;
  members: PokerUserInterface[];
}

export interface SetBoardDetailsInterface {
  id: number | undefined;
  name: string;
  description: string;
  manager: PokerUserInterface | undefined;
  users: PokerUserInterface[];
  groups: SetGroupDetailsInterface[];
  estimation_choices: number[];
}

export interface PokerCreateGroupPropsInterface {
  handleCreateGroup: MouseEventHandler;
  groupList: SetGroupDetailsInterface[];
  usernameInput: string;
  setUsernameInput: React.Dispatch<React.SetStateAction<string>>;
  descriptionInput: string;
  setdescriptionInput: React.Dispatch<React.SetStateAction<string>>;
  handleCloseAlert: (event: SyntheticEvent<Element, Event>) => void;
  handleCloseSnackbar: (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
  isError: boolean;
  errorMessage: string;
  handleRedirectToExistingGroup: Function;
  handleGroupNameInputHelperText: Function;
}

export interface PokerGroupPropsInterface {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  response: SetGroupDetailsInterface;
  groupID: string | undefined;
  dispatch: AppDispatch;
  member: string;
  setMember: React.Dispatch<React.SetStateAction<string>>;
  handleAddMember: Function;
  userToDelete: string;
  setUserToDelete: React.Dispatch<React.SetStateAction<string>>;
  isClose: boolean;
  setIsClose: React.Dispatch<React.SetStateAction<boolean>>;
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmailValidation: Function;
  isError: boolean;
  errorMessage: string;
  handleCloseAlert: (event: SyntheticEvent<Element, Event>) => void;
  handleCloseSnackbar: (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
  handleDescription: Function;
  isAdmin: boolean;
  description: string;
}

export interface PokerCreateBoardPropsInterface {
  isError: boolean;
  errorMessage: string;
  handleCloseAlert: (event: SyntheticEvent<Element, Event>) => void;
  handleCloseSnackbar: (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
  boardNameInput: string;
  setBoardNameInput: React.Dispatch<React.SetStateAction<string>>;
  boardDescriptionInput: string;
  setBoardDescriptionInput: React.Dispatch<React.SetStateAction<string>>;
  handleCreateBoard: MouseEventHandler;
  handleRedirectToExistingBoard: Function;
  boardList: SetBoardDetailsInterface[];
  votingSystem: number;
  setVotingSystem: React.Dispatch<React.SetStateAction<number>>;
  estimationChoices: string;
  setEstimationChoices: React.Dispatch<React.SetStateAction<string>>;
  handleCustomChoicesError: Function;
  handleBoardNameInputHelperText: Function;
}

export interface DefaultChoicesInterface {
  [key: number]: number[];
}

export interface LoginUserInterface {
  email: string;
  password: string;
  isLogin: boolean;
  token: string;
  errorStatusCode?: number;
}

export interface PokerUserInterface {
  id?: number;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  zip_code?: string;
  state?: string;
  city?: string;
  gender?: number;
  date_of_birth?: string;
}

export interface RegisterUserInterafce {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  statusCode?: number;
  error?: string;
}

export interface VerificationInterface {
  isVerified: boolean;
  message: string;
}

export interface RegisterPropsInterface {
  handleClick: MouseEventHandler;
  response: RegisterUserInterafce;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  mail: string;
  setMail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  isLoading: boolean;
}

export interface LoginComponentProps {
  response: LoginUserInterface;
  handleClick: MouseEventHandler;
  emailInput: string;
  setEmailInput: React.Dispatch<React.SetStateAction<string>>;
  passwordInput: string;
  setPasswordInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

export interface VerifyComponentProps {
  data: string | null;
  verified: VerificationInterface;
}

export interface RegisterComponentProps {
  handleClick: MouseEventHandler;
  response: RegisterUserInterafce;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  mail: string;
  setMail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  localstorage: string | null;
}

export interface NavbarComponentProps {
  handleRegisterClick: MouseEventHandler;
  handleLoginClick: MouseEventHandler;
  handleLogoutClick: MouseEventHandler;
  handleProfileClick: MouseEventHandler;
}

export interface HomeComponentProps {
  handlePokerBoardCardClick: MouseEventHandler;
  handleGroupCardClick: MouseEventHandler;
}

export interface DataType {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  password?: string;
  confirm_password?: string;
  jira_domain?: string;
  jira_api_token?: string;
}

export interface UserProfileDetail {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  date_joined?: Date;
  last_login?: Date;
  phone_number: string;
  address_line_1?: string;
  address_line_2?: string;
  zip_code?: string;
  password?: string;
  confirm_password?: string;
}

export interface UserDetail {
  user_email: string;
  user: number;
  role: number;
}

export interface GroupDetail {
  name: string;
  description: string;
  admin_first_name: string;
  admin_last_name: string;
}

export interface Group {
  previous: string;
  next: string;
  count: string;
  results: GroupDetail[];
}

export interface BoardDetail {
  name: string;
  description: string;
  manager_first_name: string;
  manager_last_name: string;
  voting_system: string;
}

export interface Board {
  previous: string;
  next: string;
  count: string;
  results: BoardDetail[];
}

export interface TicketDetail {
  jira_ticket: string;
  summary: string;
  description: string;
  final_estimation: number;
}

export interface Ticket {
  id: number;
  ticket_detail: TicketDetail;
  estimate: number;
}

export interface Tickets {
  count: number;
  previous: string;
  next: string;
  results: Ticket[];
}

export interface UserProfileState {
  user: UserProfileDetail;
}

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface ColumnBoard {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface ColumnTicket {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface UpdateUserDetailPropType {
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  handleUpdate: React.FormEventHandler<HTMLFormElement>;
  firstNameError: string;
  lastNameError: string;
  handleFirstNameError: () => string;
  handleLastNameError: () => string;
  message: string;
  firstName: string;
  lastName: string;
  disabled: boolean;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  jiraDomain: string;
  setJiraDomain: React.Dispatch<React.SetStateAction<string>>;
  jiraAPIToken: string;
  setJiraAPIToken: React.Dispatch<React.SetStateAction<string>>;
  handleJiraDomainError: Function;
  handleJiraAPITokenError: Function;
  jiraDomainError: boolean;
  jiraAPITokenError: boolean;
}

export interface PokerTicketInterface {
  jira_ticket?: string;
  summary?: string;
  description?: string;
}

export interface PokerBoardSessionInterface {
  id: number | undefined;
  board: SetBoardDetailsInterface;
  is_active: boolean;
  timer: number | undefined;
}

export interface BoardGameMessageInterface {
  event: string;
  email: string;
  card: string;
}

export interface UserEstimationsInterface {
  [key: string]: string | number;
}

export interface PokerBoardStartGameComponentProps {
  ticket: PokerTicketInterface;
  handleCardClick: MouseEventHandler;
  userSelection: string;
  usersWhoSelected: string[];
  boardSession: PokerBoardSessionInterface;
  timeLeft: number;
  locallyStoredUserID: number;
  managerPanelList: BoardGameMessageInterface[];
  currentGameState: number;
  handleStartTimer: MouseEventHandler;
  handleSkipTicket: MouseEventHandler;
  finalEstimation: string;
  setFinalEstimation: React.Dispatch<React.SetStateAction<string>>;
  checkFinalEstimationError: Function;
  handleNextTicket: MouseEventHandler;
  userEstimations: any;
  handleEndGame: MouseEventHandler;
  role: number;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  boardID: string;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: MouseEventHandler;
  isCommentModalOpen: boolean;
  setIsCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean;
}

export interface UpdatePasswordPropType {
  handleUpdate?: React.MouseEventHandler<HTMLButtonElement>;
  error: string;
  message: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
  password: string;
  confirmPassword: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export interface PropType {
  handleChangePage: (page: number) => void;
  handleChangePageBoard: (page: number) => void;
  handleChangePageTicket: (page: number) => void;
  handleClose?: (event: React.SyntheticEvent<Element, Event>) => void;
  handleCloseBar?: (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
  updatePassword?: React.MouseEventHandler<HTMLButtonElement>;
  updateFields?: React.MouseEventHandler<HTMLButtonElement>;
  userDetail: UserProfileDetail;
  groupsOfUser: Group;
  boardsOfUser: Board;
  ticketsOfUser: Tickets;
  error: string;
  iserror: boolean;
  page: number;
  pageBoard: number;
  pageTicket: number;
  isProfileLoading: boolean;
  isGroupLoading: boolean;
  isBoardLoading: boolean;
  isTicketLoading: boolean;
}

export interface SingleBoardInterface {
  id: number;
  name: string;
  description: string;
  poker_ticket: PokerTicketInterface[];
  users: UserProfileDetail[];
  groups: GroupDetail[];
  count: number;
  manager: UserProfileDetail;
  ticket_list: PokerTicketInterface[];
  estimated_tickets_cnt: number;
}

export interface BoardInterface {
  board: SingleBoardInterface;
}

export interface ExistingUserType {
  poker: number;
  role: number;
  user: number;
  user_email: string;
}

export type ExistingUsers = ExistingUserType[];

export interface SessionInterface {
  id: number;
  timer: number;
  is_active: boolean;
  board: SingleBoardInterface;
}

export interface PokerPropInterface {
  page: number;
  rowsPerPage: number;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  choice: number;
  isBoardLoading: boolean;
  boardDetail: SingleBoardInterface;
  isClose: boolean;
  setIsClose: React.Dispatch<React.SetStateAction<boolean>>;
  setMember: React.Dispatch<React.SetStateAction<string>>;
  isCloseGroup: boolean;
  setIsCloseGroup: React.Dispatch<React.SetStateAction<boolean>>;
  group: string;
  setGroup: React.Dispatch<React.SetStateAction<string>>;
  addMembersToBoardAlertTitle: string;
  addMembersToBoardsAlertDescription: string;
  addGroupsToBoardAlertTitle: string;
  addGroupsToBoardAlertDescription: string;
  addGroupToBoardErrorText: string;
  handleEmailValidation: () => boolean;
  handleGroupNameValidation: () => boolean;
  addMemberToBoardErrorText: string;
  member: string;
  handleAddMember: () => void;
  handleAddGroup: () => void;
  isManager: boolean;
  handleDeleteBoard: () => void;
  openExistingMembers: boolean;
  openExistingGroups: boolean;
  error: string;
  isError: boolean;
  handleCloseBar: (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
  handleCloseSnakeBar: (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleTicketSearch: (e: any) => void;
  handleRoleSave: Function;
  existingUsers: ExistingUsers;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  open: boolean;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  timer: number;
  setChoice: React.Dispatch<React.SetStateAction<number>>;
  setOpenExistingMembers: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenExistingGroups: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleCreateGameSession: MouseEventHandler;
  handleDeleteMember: Function;
  handleDeleteGroup: Function;
  openTickets: boolean;
  setOpenTickets: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AcceptInviteProps {
  isInviteAcceptSuccess: boolean,
  errorMsg: string,
}
