import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';

import { ERROR, DOES_NOT_EXIST, BACK_TO_PROFILE } from '@Constants/constants';

const primary = purple[500];

/**
 * To show a 404 page and and optionn to return back to the profile
 * @returns {JSX.Element}
 */
export const NoPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant='h1' style={{ color: 'white' }}>
        {ERROR}
      </Typography>
      <Typography variant='h6' style={{ color: 'white' }}>
        {DOES_NOT_EXIST}
      </Typography>
      <Button variant='contained' onClick={() => navigate('/userprofile')}>
        {BACK_TO_PROFILE}
      </Button>
    </Box>
  );
};
