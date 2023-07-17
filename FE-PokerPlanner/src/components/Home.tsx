import React from 'react';

import { Box, CardActionArea, Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import {
  homePageCardHeight,
  homePageCardWidth,
  pokerBoardHomePageDescription,
  pokerGroupHomePageDescription,
} from '@Constants/constants';
import { HomeComponentProps } from '@Constants/interfaces';

const HomeMainStyle = {
  display: 'flex',
  margin: '20px',
  justifyContent: 'space-evenly',
};

export default (props: HomeComponentProps): JSX.Element => {
  const { handlePokerBoardCardClick, handleGroupCardClick } = props;
  const pokerboardSvg = require('../asserts/pokerboard.png') as string;
  const groupSvg = require('../asserts/group.png') as string;
  const cardStyle = { width: homePageCardWidth, height: homePageCardHeight };

  return (
    <Box sx={HomeMainStyle}>
      <Card>
        <CardActionArea sx={cardStyle} onClick={handlePokerBoardCardClick}>
          <CardMedia
            component='img'
            height='250'
            image={pokerboardSvg}
            alt='green iguana'
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              Poker Board
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {pokerBoardHomePageDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Divider orientation='vertical' flexItem />
      <Card>
        <CardActionArea sx={cardStyle} onClick={handleGroupCardClick}>
          <CardMedia
            component='img'
            height='250'
            image={groupSvg}
            alt='group img'
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              Group
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {pokerGroupHomePageDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};
