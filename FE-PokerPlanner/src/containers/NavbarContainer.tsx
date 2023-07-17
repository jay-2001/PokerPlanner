import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Navbar from '@Components/Navbar';
import { LogOutAction } from '@Redux/actions/LoginAction';
import { AppDispatch } from '@Redux/store/store';

const NavbarContainer = (): JSX.Element => {
  const isLoggin = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    dispatch(LogOutAction(isLoggin));
    localStorage.clear();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleProfileClick = () => {
    navigate('/userprofile');
  };

  return (
    <Navbar
      handleLoginClick={handleLoginClick}
      handleLogoutClick={handleLogoutClick}
      handleRegisterClick={handleRegisterClick}
      handleProfileClick={handleProfileClick}
    />
  );
};
export default NavbarContainer;
