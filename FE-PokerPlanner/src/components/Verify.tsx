import VerifiedIcon from '@mui/icons-material/Verified';
import { LinearProgress, Typography } from '@mui/material';

import {
  successfulVerificationMessage,
  verificationLinkExpiredMessage,
} from '@Constants/constants';
import { VerifyComponentProps } from '@Constants/interfaces';

/**
 * A presentational component that renders a form for the user to enter a verification link to confirm their email
 * address and complete the signup process.
 *
 * @param props The properties for the component to trigger the verification process
 *              and any other relevant data or event handlers.
 * @returns show green tick if account is created successfully.
 */
const Verify = (props: VerifyComponentProps): JSX.Element => {
  const { data, verified } = props;

  const Verified = (): JSX.Element => {
    return (
      <>
        <LinearProgress color='primary' sx={{ marginTop: -6 }} />
        <Typography align='center' sx={{ margin: 20 }}>
          <VerifiedIcon sx={{ fontSize: 200 }} color='success' />
          <Typography variant='h4'>{successfulVerificationMessage}</Typography>
        </Typography>
      </>
    );
  };

  const Error = (): JSX.Element => {
    return (
      <Typography align='center' sx={{ margin: 20 }}>
        <Typography variant='h4'>{verificationLinkExpiredMessage}</Typography>
      </Typography>
    );
  };

  return (
    <div>
      {data && verified.isVerified && <Verified />}
      {verified.isVerified === false && <Error />}
    </div>
  );
};

export default Verify;
