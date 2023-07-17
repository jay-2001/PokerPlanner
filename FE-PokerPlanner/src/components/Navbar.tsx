import React from 'react';

import { Button, Link } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { NavbarComponentProps } from '@Constants/interfaces';

const Navbar = (props: NavbarComponentProps): JSX.Element => {
  const {
    handleRegisterClick,
    handleLoginClick,
    handleLogoutClick,
    handleProfileClick,
  } = props;

  const drawerWidth = 240;

  const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
  })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed'>
        <Toolbar>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
          >
            <Link href={'/home'} sx={{ color: 'white' }}>
              Poker Planner
            </Link>
          </Typography>
          {!localStorage.getItem('token') && (
            <Button onClick={handleRegisterClick} color='inherit'>
              Register
            </Button>
          )}
          {localStorage.getItem('token') && (
            <Button onClick={handleProfileClick} color='inherit'>
              Profile
            </Button>
          )}
          {localStorage.getItem('token') === null ? (
            <Button onClick={handleLoginClick} color='inherit'>
              Login
            </Button>
          ) : (
            <Button onClick={handleLogoutClick} color='inherit'>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Main>
        <DrawerHeader />
      </Main>
    </Box>
  );
};

export default Navbar;
