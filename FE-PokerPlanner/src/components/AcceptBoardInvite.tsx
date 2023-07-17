import { ThumbDown, ThumbUp } from '@mui/icons-material';
import { Box, LinearProgress, Typography } from '@mui/material';

import {
  invitePageIconSize,
  invitePageTypographyMargin,
  inviteSuccessMsg,
} from '@Constants/constants';
import { AcceptInviteProps } from '@Constants/interfaces';

/**
 * A presentational component that renders a form for the user to enter an invitation link
 * to confirm their acceptance of invite and complete the invitation process.
 *
 * @param props The properties for the component to trigger the invitation process
 *              and any other relevant data or event handlers.
 * @returns show green tick if invitation is accepted successfully.
 */
export default (props: AcceptInviteProps): JSX.Element => {
  const { isInviteAcceptSuccess, errorMsg } = props;

  const Verified = (): JSX.Element => {
    return (
      <>
        <LinearProgress color='primary' sx={{ marginTop: -6 }} />
        <Typography align='center' sx={{ margin: invitePageTypographyMargin }}>
          <ThumbUp sx={{ fontSize: invitePageIconSize }} color='primary' />
          <Typography variant='h4'>{inviteSuccessMsg}</Typography>
        </Typography>
      </>
    );
  };

  const Error = (): JSX.Element => {
    return (
      <Typography align='center' sx={{ margin: invitePageTypographyMargin }}>
        <ThumbDown sx={{ fontSize: invitePageIconSize }} color='error' />
        <Typography variant='h4'>{errorMsg}</Typography>
      </Typography>
    );
  };

  return (
    <Box>
      {isInviteAcceptSuccess && <Verified />}
      {!isInviteAcceptSuccess && <Error />}
    </Box>
  );
};
