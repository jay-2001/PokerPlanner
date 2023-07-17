import React, { FunctionComponent } from 'react';

import Box from '@mui/material/Box';

import AppRouter from '@Components/AppRouter';

const App: FunctionComponent = () => (
  <React.StrictMode>
    <Box>
      <AppRouter />
    </Box>
  </React.StrictMode>
);

export default App;
