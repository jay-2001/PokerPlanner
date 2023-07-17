import {
  DefaultChoicesInterface,
  LoginUserInterface,
  RegisterUserInterafce,
  VerificationInterface,
} from '@Constants/interfaces';

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const listRegex = /^[0-9]+(?:-[0-9]+)?(,[0-9]+(?:-[0-9]+)?)*$/;
export const minGroupNameLength = 2;
export const maxGroupNameLength = 20;
export const maxGroupDescriptionLength = 500;
export const pokerCreateGroupPageStackSpacing = 2;
export const pokerCreateGroupMultilineMaxRows = 4;
export const snackbarAutoHideDuration = 3000;
export const groupNameInputError = 'Group name must have 2 characters';
export const removeAlertTitle = 'Are you sure you want to remove this member?';
export const removeAlertDescription =
  'The user will be removed from the group on clicking delete button';
export const addMembersAlertTitle = 'Add members to the group';
export const addMembersAlertDescription =
  'Type in the email of the user to be added';
export const removeMembersQueryParam = 'remove_members';
export const addMembersQueryParam = 'add_members';
export const removeGroupsQueryParam = 'remove_groups';
export const addGroupsQueryParam = 'add_groups';
export const updateGroupErrorMessage =
  'You do not have permission to perform this action';
export const groupDescriptionMaxLengthToDisplay = 90;
export const addMemberErrorText = 'Invalid email';
export const showLess = 'Show less';
export const showMore = 'Show more';
export const groupsRightPanelMessage = 'Groups you are a part of';
export const groupDescriptionMaxLenInputError =
  'Group description must not have more than 500 characters';
export const groupMaxLenNameInputError =
  'Group name must not have more than 20 characters';
export const forbiddenStatusCode = 403;
export const boardsRoute = '/boards';
export const groupsRoute = '/groups';
export const loginRoute = '/login';
export const fibonacciNumbersList = [1, 2, 3, 5, 8, 13, 21, 34];
export const oddNumbersList = [1, 3, 5, 7, 9, 11, 13, 15];
export const evenNumbersList = [2, 4, 6, 8, 10, 12, 14, 16];
export const serialNumberList = [1, 2, 3, 4, 5, 6, 7, 8];
export const defaultChoices: DefaultChoicesInterface = {
  0: fibonacciNumbersList,
  1: oddNumbersList,
  2: evenNumbersList,
  3: serialNumberList,
};
export const estimationChoicesLimit = 8;
export const customChoicesHelperText =
  'Enter numbers and separate them with commas without spaces. Ex: 1,2,3,4';
export const minBoardNameLength = 2;
export const maxBoardNameLength = 50;
export const maxBoardDescriptionLength = 500;
export const boardMinLenNameInputError = 'Board name must have 2 characters';
export const boardMaxLenNameInputError =
  'Board name must not have more than 50 characters';
export const boardDescriptionMaxLenInputError =
  'Board description must not have more than 500 characters';
export const pokerCreateBoardMultilineMaxRows = 4;
export const customChoice = 4;
export const boardsRightPanelMessage = 'Boards you are a part of';
export const pokerCreateBoardPageStackSpacing = 2;
export const choicesList = [
  'Fibonacci (1, 2, 3, 5...)',
  'Odd (1, 3, 5, 7...)',
  'Even (2, 4, 6, 8...)',
  'Serial (1, 2, 3, 4...)',
  'Custom',
];

export const loginUserInitialState: LoginUserInterface = {
  email: '',
  password: '',
  isLogin: false,
  token: '',
};

export const registerUserInitialState: RegisterUserInterafce = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
};

export const verficationUserInitialState: VerificationInterface = {
  isVerified: false,
  message: '',
};

export const validEmail =
  /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validPassword = new RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$'
);

export const validName = new RegExp('^(?=.*?[A-Za-z]).{0,30}$');

export const isNameValid = (name: string) =>
  name !== '' && (name.length < 1 || !validName.test(name));

export const isConfirmPasswordValid = (
  password: string,
  confirmPassword: string
) => password !== confirmPassword && confirmPassword !== '' && password !== '';

export const isEmailValid = (email: string) =>
  email !== '' && !validEmail.test(email);

export const isPasswordValid = (password: string) =>
  password !== '' && (password.length < 8 || !validPassword.test(password));

export const nameError = (name: string) => {
  if (!validName.test(name)) return 'Name should be only characters and max length of name 30';

  if (name.length < 1) return 'Name should be 1 letter long';
};

export const passwordError = (password: string) => {
  if (!validPassword.test(password))
    return 'Password must have a lowercase, an uppercase letter, a number, and a special character and must be atleast 8 characters long and can have a max length of 128';
};

export const ConfirmPasswordError = () => {
  return 'Password and Confirm password does not match';
};

export const pokerBoardHomePageDescription =
  'Create a pokerboard and start estimating tickets to better plan your sprint';

export const pokerGroupHomePageDescription =
  'Create a group to save yourself from the hassle of inviting people on board one by one';

export const homePageCardWidth = 400;
export const homePageCardHeight = 450;
export const statusCodes = {
  created: 201,
  badRequest: 400,
  internalServerError: 500,
  restOfCodes: 999,
};
export const successfulVerificationMessage =
  'Account is Verified Successfully.';
export const verificationLinkExpiredMessage =
  'Link has been expired. You no longer have the access to this link.';
export const UPDATE_USER_PASSWORD = 'Update User Password';
export const UPDATE = 'Update';
export const UPDATE_USER_DETAILS = 'Update User Details';
export const EDIT_DETAILS = 'Edit Details';
export const EDIT_PASSWORD = 'Edit password';
export const FULL_NAME = 'Full Name';
export const EMAIL = 'email';
export const MY_GROUPS = 'My Groups:';
export const MY_BOARDS = 'My Boards:';
export const NO_GROUPS_FOUND = 'No Groups Found';
export const NO_BOARDS_FOUND = 'No boards found';
export const MY_TICKETS = 'My Tickets:';
export const NO_TICKETS_FOUND = 'No Tickets Found';
export const ERROR = '404';
export const DOES_NOT_EXIST = 'The page you are looking for does not exist.';
export const BACK_TO_PROFILE = 'Back to Profile';
export const MIN_LENGTH_PASSWORD_VALIDATION = 5;
export const MAX_LENGTH_VALIDATION = 30;
export const ERROR_FIRST_NAME_MORE = `First Name cannot have length more than ${MAX_LENGTH_VALIDATION}`;
export const ERROR_LAST_NAME_MORE = `Last Name cannot have length more than ${MAX_LENGTH_VALIDATION}`;
export const PROFILE_UPDATE_SUCCESS = 'Profile Updated Successfully';
export const PASSWORD_DONT_MATCH_ERROR = 'Passwords entered do not match.Please try again!';
export const MIN_LENGTH_PASSWORD_ERROR = 'Password should have atleast 5 characters';
export const addMembersToBoardAlertTitle = "Add Users";
export const addMembersToBoardsAlertDescription = "enter email address";
export const addMemberToBoardErrorText = 'Please enter valid email address';
export const MIN_GROUP_LENGTH_VALIDATION = 6;
export const MAX_GROUP_LENGTH_VALIDATION = 20;
export const addGroupsToBoardAlertTitle = 'Add Groups';
export const addGroupsToBoardAlertDescription = 'enter group name';
export const addGroupToBoardErrorText = 'Please enter valid group name';
export const userNotInBoardMessage = 'User is not a part of any board yet';
export const userNotInGroupMessage = 'User is not a part of any group yet';
export const createNewBoardMessage = 'Create a new board to start estimating';
export const createNewGroupMessage = 'Create a new group';
export const nonManagerPanelTitle = 'Users who have estimated till now';
export const noEstimationsYetMessage = 'No one has estimated yet';
export const webSocketBaseUrl = `${process.env.REACT_APP_SOCKET_SERVER}/session/`;
export const integerRegex = /^\d+$/;
export const finalEstimationHelperText = 'Only number is allowed';
export const finalEstimationMaxValueError = 'Value should be less than 2147483647';
export const allEstimationsTitleMessage = 'All estimations from users';
export const gameStateChoices = {
  beforeTimerStartsState: 0,
  timerOngoingState: 1,
  afterTimerEndsState: 2,
};
export const roles = {
  player: 0,
  spectator: 1,
};
export const eventChoices = {
  role: 'role',
  fetchTickets: 'fetch_tickets',
  currentTicket: 'get_current_ticket',
  startTimer: 'start_timer',
  resetTimer: 'reset_timer',
  timer: 'timer',
  selectedCard: 'card_selected',
  selectedCardByAnotherPlayer: 'card_selected_by_player',
  selectedCardDetailsForManager: 'card_selected_by_player_for_manager',
  allUserEstimations: 'users_estimation',
  skipTicket: 'skip_ticket',
  finalEstimation: 'final_estimation',
  endGame: 'end_game',
};
export const maxAllowedCommentLen = 255;
export const ticketCommentError = 'Comment length cannot exceed 255';
export const commentSuccessTitle = 'Comment added';
export const commentFailureTitle = 'Comment could not be added';
export const commentSuccessDescription = 'Comment has been successfully added';
export const commentFailureDescription = 'There was some problem adding comment';
export const gameEndedDescription =
  'Thanks for playing the game, click on the button below to go back to dashboard';
export const jiraCredentialsMaxLen = 255;
export const jiraDomainErrorMessage = 'Domain cannot have more than 255 characters';
export const jiraAPITokenErrorMessage = 'API token cannot have more than 255 characters';
export const invitePageIconSize = 200;
export const invitePageTypographyMargin = 16;
export const inviteSuccessMsg =
  'Invite accepted. Please wait while we redirect you to the board';
export const inviteAcceptSuccessTimer = 3000;
