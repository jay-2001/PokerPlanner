import { combineReducers } from 'redux';

import { BoardCreateReducer } from '@Redux/reducers/BoardCreateReducer';
import { BoardListReducer } from '@Redux/reducers/BoardListReducer';
import { BoardSessionReducer } from '@Redux/reducers/BoardSessionReducer';
import { ChangeUserRoleReducer } from '@Redux/reducers/ChangeUserRoleReducer';
import { GroupCreateReducer } from '@Redux/reducers/GroupCreateReducer';
import { GroupDetailReducer } from '@Redux/reducers/GroupDetailsReducer';
import { GroupListReducer } from '@Redux/reducers/GroupListReducer';
import { IsBoardLoadingReducer } from '@Redux/reducers/IsBoardLoading';
import { IsErrorReducer } from '@Redux/reducers/IsErrorReducer';
import { IsGroupLoadingReducer } from '@Redux/reducers/IsGroupLoading';
import { IsProfileLoadingReducer } from '@Redux/reducers/IsProfileLoading';
import { IsTicketLoadingReducer } from '@Redux/reducers/IsTicketLoading';
import { LoadingReducer } from '@Redux/reducers/LoadingReducer';
import { LoginReducer } from '@Redux/reducers/LoginReducer';
import { FetchBoardDetailsReducer } from '@Redux/reducers/PokerBoardReducer';
import { RegisterReducer } from '@Redux/reducers/RegisterReducer';
import { ErrorReducer } from '@Redux/reducers/SetErrorReducer';
import UserProfileReducer from '@Redux/reducers/UserProfileReducer';
import { UserBoardReducer } from '@Redux/reducers/UserProfileBoardReducer';
import { UserGroupReducer } from '@Redux/reducers/UserProfileGroupReducer';
import { UserTicketReducer } from '@Redux/reducers/UserProfileTicketReducer';
import { GetUsersRoleReducer } from '@Redux/reducers/UserRoleReducer';
import { VerificationReducer } from '@Redux/reducers/VerificationReducer';

const reducers = combineReducers({
  register: RegisterReducer,
  login: LoginReducer,
  loading: LoadingReducer,
  verify: VerificationReducer,
  createGroup: GroupCreateReducer,
  groupDetail: GroupDetailReducer,
  groupList: GroupListReducer,
  error: ErrorReducer,
  isError: IsErrorReducer,
  createBoard: BoardCreateReducer,
  boardList: BoardListReducer,
  UserProfile: UserProfileReducer,
  IsTicketLoading: IsTicketLoadingReducer,
  IsBoardLoading: IsBoardLoadingReducer,
  IsGroupLoading: IsGroupLoadingReducer,
  IsProfileLoading: IsProfileLoadingReducer,
  boardSession: BoardSessionReducer,
  PokerBoard: FetchBoardDetailsReducer,
  ChangeUserRole: ChangeUserRoleReducer,
  GetUsersRole: GetUsersRoleReducer,
  UserGroup: UserGroupReducer,
  UserBoard: UserBoardReducer,
  UserTicket: UserTicketReducer,
});

export default reducers;
