import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Verify from '@Components/Verify';
import {
  LoginUserInterface,
  VerificationInterface,
} from '@Constants/interfaces';
import { VerificationAction } from '@Redux/actions/VerificationAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * A container component that renders a verification component for the user to activation link and
 * confirm their email address.
 *
 * @returns A React component that renders a verification page if user is verified successfully.
 */
function VerifyContainer() {
  const [searchParams] = useSearchParams();
  const queryParamsToken = searchParams.get('token') || '';
  const dispatch = useDispatch<AppDispatch>();
  const data: LoginUserInterface = useSelector(
    (state: RootState) => state.login
  );
  const verified: VerificationInterface = useSelector(
    (state: RootState) => state.verify
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      dispatch(VerificationAction(queryParamsToken));
    }
    const fun = () => {
      if (data.token !== '') {
        navigate('/home');
      }
    };
    setTimeout(fun, 1500);
  }, [data.token]);

  return <Verify data={localStorage.getItem('token')} verified={verified} />;
}
export default VerifyContainer;
