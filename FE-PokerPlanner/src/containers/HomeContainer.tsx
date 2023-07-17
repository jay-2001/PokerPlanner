import { useNavigate } from 'react-router-dom';

import Home from '@Components/Home';
import { useEffect } from 'react';

/**
 * Home page component.
 *
 * This component displays two card on click pokerboard card
 * it navigate to pokerboard and when click on group card you navigate to group
 */
const HomeContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const handlePokerBoardCardClick = (): void => {
    navigate('/boards');
  };
  const handleGroupCardClick = (): void => {
    navigate('/groups');
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []);

  return (
    <Home
      handlePokerBoardCardClick={handlePokerBoardCardClick}
      handleGroupCardClick={handleGroupCardClick}
    />
  );
};

export default HomeContainer;
