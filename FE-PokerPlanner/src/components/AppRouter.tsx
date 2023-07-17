import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { NoPage } from '@Components/NoPage';
import { boardsRoute, groupsRoute } from '@Constants/constants';
import {
  FAULTY_ROUTES,
  POKER_BOARD,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  USER_PROFILE,
} from '@Constants/Routes';
import AcceptBoardInviteContainer from '@Containers/AcceptBoardInviteContainer';
import HomeContainer from '@Containers/HomeContainer';
import LoginContainer from '@Containers/LoginContainer';
import NavbarContainer from '@Containers/NavbarContainer';
import { PokerBoardContainer } from '@Containers/PokerBoardContainer';
import PokerBoardStartGameContainer from '@Containers/PokerBoardStartGameContainer';
import PokerCreateBoardContainer from '@Containers/PokerCreateBoardContainer';
import PokerCreateGroupContainer from '@Containers/PokerCreateGroupContainer';
import PokerGroupContainer from '@Containers/PokerGroupContainer';
import RegisterContainer from '@Containers/RegisterContainer';
import VerifyContainer from '@Containers/VerifyContainer';
import { UserProfileContainer } from '@Containers/UserProfileContainer';
import { UpdateUserDetailContainer } from '@Containers/UpdateUserDetailContainer';
import { UpdateUserPasswordContainer } from '@Containers/UpdateUserPasswordContainer';

/**
 * A layout for the project used to render error in validations,
 * loading message in follow feature,
 * and sidebar in each component of the project because of Outlet.
 * @example
 * even in the user details or profile component, sidebar is visible
 * @returns {JSX.Element} Returns a JSX element with all the necessary components to render
 */
const AppLayout = (): JSX.Element => (
  <>
    <NavbarContainer />
    <Outlet />
  </>
);

/**
 * The main router which is used to create all the routes like profile route, login route.
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path={groupsRoute} element={<PokerCreateGroupContainer />} />
      <Route path={`${groupsRoute}/:groupID`} element={<PokerGroupContainer />} />
      <Route path={boardsRoute} element={<PokerCreateBoardContainer />} />
      <Route path='/login' element={<LoginContainer />} />
      <Route path='/register' element={<RegisterContainer />} />
      <Route path='/verify' element={<VerifyContainer />} />
      <Route path='/home' element={<HomeContainer />} />
      <Route path={USER_PROFILE} element={<UserProfileContainer />} />
      <Route path={UPDATE_PROFILE} element={<UpdateUserDetailContainer />} />
      <Route path={UPDATE_PASSWORD} element={<UpdateUserPasswordContainer />} />
      <Route path={POKER_BOARD} element={<PokerBoardContainer />} />
      <Route path={FAULTY_ROUTES} element={<NoPage />} />
      <Route
        path={`${boardsRoute}/:boardID/game/:boardSessionID`}
        element={<PokerBoardStartGameContainer />}
      />
      <Route
        path={`${boardsRoute}/:boardID/acceptinvite/`}
        element={<AcceptBoardInviteContainer />}
      />
    </Route>
  )
);

/**
 * This component is used to provide routes in the app.
 * RouterProvider takes in router as props to make routes defined in router object.
 */
const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
