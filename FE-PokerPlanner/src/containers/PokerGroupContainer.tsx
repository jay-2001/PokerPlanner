import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PokerGroup from '@Components/PokerGroup';
import {
  emailRegex,
  groupDescriptionMaxLengthToDisplay,
  loginRoute,
} from '@Constants/constants';
import { SetGroupDetailsInterface } from '@Constants/interfaces';
import { setError } from '@Redux/actions/ErrorAction';
import {
  addGroupMember,
  resetGroupDetails,
  setGroupDetails,
} from '@Redux/actions/GroupDetailsAction';
import { setIsError } from '@Redux/actions/IsErrorAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * A container which is used to render the PokerGroup component
 * All the necessary states and functionalities for the PokerGroup component
 * are written here
 * @returns {JSX.Element} PokerGroup Component.
 */
export default (): JSX.Element => {
  const isError = useSelector((state: RootState) => state.isError);
  const errorMessage = useSelector((state: RootState) => state.error);
  const [member, setMember] = useState<string>('');
  const [isClose, setIsClose] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { groupID } = useParams();
  const response = useSelector((state: RootState) => state.groupDetail);
  const navigate = useNavigate();
  const locallyStoredToken = localStorage.getItem('token');
  const locallyStoredID = localStorage.getItem('user_id');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (!locallyStoredToken) {
      navigate(loginRoute);
    }
    if (groupID && locallyStoredToken) {
      dispatch(setGroupDetails(groupID)).then(
        (res: SetGroupDetailsInterface) => {
          if (locallyStoredID) {
            const id = +locallyStoredID;
            setIsAdmin(id === res?.admin?.id);
          }
        }
      );
    }
    return () => {
      dispatch(resetGroupDetails());
    };
  }, [groupID]);

  const handleClose = (): void => {
    dispatch(setIsError(false));
    dispatch(setError(''));
  };

  const handleDescription = (): string => {
    setDescription(response.description);
    let descriptionToShow;
    if (!response.description) {
      descriptionToShow = '';
    } else if (response.description.length <= groupDescriptionMaxLengthToDisplay) {
      descriptionToShow = response.description;
    } else {
      descriptionToShow = !expand
        ? `${response.description.substr(0, groupDescriptionMaxLengthToDisplay)}...`
        : response.description;
    }
    return descriptionToShow;
  };

  const handleAddMember = (): void => {
    if (groupID && locallyStoredToken)
      dispatch(addGroupMember(groupID, member));
  };

  const handleEmailValidation = (): boolean => {
    return member.length !== 0 && !emailRegex.test(member);
  };

  return (
    <PokerGroup
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      response={response}
      dispatch={dispatch}
      groupID={groupID}
      member={member}
      setMember={setMember}
      handleAddMember={handleAddMember}
      userToDelete={userToDelete}
      setUserToDelete={setUserToDelete}
      isClose={isClose}
      setIsClose={setIsClose}
      expand={expand}
      setExpand={setExpand}
      handleEmailValidation={handleEmailValidation}
      isError={isError}
      errorMessage={errorMessage}
      handleCloseAlert={handleClose}
      handleCloseSnackbar={handleClose}
      handleDescription={handleDescription}
      isAdmin={isAdmin}
      description={description}
    />
  );
};
