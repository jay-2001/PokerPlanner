import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PokerBoardStartGame from '@Components/PokerBoardStartGame';
import {
  boardsRoute,
  eventChoices,
  gameStateChoices,
  integerRegex,
  loginRoute,
  webSocketBaseUrl,
} from '@Constants/constants';
import {
  BoardGameMessageInterface,
  PokerTicketInterface,
  UserEstimationsInterface,
} from '@Constants/interfaces';
import { addComment } from '@Redux/actions/AddCommentAction';
import { setBoardSession } from '@Redux/actions/BoardSessionAction';
import { AppDispatch, RootState } from '@Redux/store/store';

/**
 * A container which is used to render the PokerBoardStartGame component
 * All the necessary states and functionalities for the PokerBoardStartGame component
 * are written here
 * @returns {JSX.Element} PokerBoardStartGame Component.
 */
export default (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<WebSocket>();
  const [ticket, setTicket] = useState<PokerTicketInterface>({});
  const { boardSessionID, boardID } = useParams();
  const [userSelection, setUserSelection] = useState<string>('');
  const [usersWhoSelected, setUsersWhoSelected] = useState<string[]>([]);
  const [managerPanelList, setManagerPanelList] = useState<
    BoardGameMessageInterface[]
  >([]);
  const boardSession = useSelector((state: RootState) => state.boardSession);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentGameState, setCurrentGameState] = useState<number>(
    gameStateChoices.beforeTimerStartsState
  );
  const locallyStoredUserID = localStorage.getItem('user_id') || '-1';
  const locallyStoredToken = localStorage.getItem('token') || '';
  const [finalEstimation, setFinalEstimation] = useState<string>('');
  const [userEstimations, setUserEstimations] =
    useState<UserEstimationsInterface>({});
  const [role, setRole] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const isError = useSelector((state: RootState) => state.isError);

  const isSocketRefValid = (): boolean | undefined => {
    return socketRef.current?.readyState === WebSocket.OPEN;
  };

  const initializingGamePage = (): void => {
    if (isSocketRefValid()) {
      socketRef?.current?.send(
        JSON.stringify({
          event: eventChoices.currentTicket,
        })
      );
      socketRef?.current?.send(
        JSON.stringify({
          event: eventChoices.resetTimer,
        })
      );
    }
  };

  const emitCardSelect = ({ cardSelected }: { cardSelected: string }): void => {
    if (isSocketRefValid()) {
      socketRef?.current?.send(
        JSON.stringify({
          event: eventChoices.selectedCard,
          card: cardSelected,
        })
      );
    }
  };

  const handleTicketCleanup = (): void => {
    setTimeLeft(0);
    setCurrentGameState(gameStateChoices.beforeTimerStartsState);
    setFinalEstimation('');
    setUsersWhoSelected([]);
    setManagerPanelList([]);
    setUserSelection('');
    setUserEstimations({});
  };

  const addToUserList = (currentEmail: string): void => {
    if (
      !usersWhoSelected.some(
        (existingEmail: string) => existingEmail === currentEmail
      )
    ) {
      setUsersWhoSelected([...usersWhoSelected, currentEmail]);
    }
  };

  const addToManagerPanelList = (payload: BoardGameMessageInterface): void => {
    const userIdx = managerPanelList.findIndex(
      (user) => user.email === payload.email
    );
    if (userIdx !== -1) {
      setManagerPanelList(
        managerPanelList.map((user) =>
          user.email === payload.email ? { ...payload } : { ...user }
        )
      );
    } else {
      setManagerPanelList([...managerPanelList, { ...payload }]);
    }
  };

  if (socketRef.current) {
    socketRef.current.onmessage = (e: MessageEvent) => {
      const receivedData = JSON.parse(e.data);
      switch (receivedData.type) {
        case eventChoices.role:
          setRole(receivedData.data);
          break;
        case eventChoices.currentTicket:
          handleTicketCleanup();
          setTicket(receivedData.data);
          break;
        case eventChoices.timer:
          setTimeLeft(receivedData.data);
          setCurrentGameState(gameStateChoices.timerOngoingState);
          if (timeLeft === 1) {
            setCurrentGameState(gameStateChoices.afterTimerEndsState);
          }
          break;
        case eventChoices.selectedCard:
          setUserSelection(receivedData.data.card);
          addToUserList(receivedData.data.email);
          break;
        case eventChoices.selectedCardByAnotherPlayer:
          addToUserList(receivedData.data.email);
          break;
        case eventChoices.selectedCardDetailsForManager:
          addToManagerPanelList(receivedData.data);
          break;
        case eventChoices.allUserEstimations:
          setUserEstimations(receivedData.data);
          break;
      }
    };

    socketRef.current.onclose = () => {
      handleTicketCleanup();
      setIsModalOpen(true);
    };
  }

  useEffect(() => {
    if (
      currentGameState === gameStateChoices.afterTimerEndsState &&
      timeLeft === 0
    ) {
      if (isSocketRefValid()) {
        socketRef?.current?.send(
          JSON.stringify({
            event: eventChoices.allUserEstimations,
          })
        );
      }
    }
  }, [currentGameState, timeLeft]);

  useEffect(() => {
    if (boardSessionID && boardID) {
      dispatch(setBoardSession(boardID, boardSessionID))
        .then((res) => {
          if (!res.is_active) {
            navigate(`${boardsRoute}/${boardID}`);
          }
          setTimeLeft(res.timer);
        })
        .catch(() => {
          navigate('/home');
        });
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate(loginRoute);
    }
    socketRef.current = new WebSocket(
      `${webSocketBaseUrl}${boardSessionID}/?token=${locallyStoredToken}`
    );
    socketRef.current.onopen = () => {
      if (isSocketRefValid()) {
        socketRef?.current?.send(
          JSON.stringify({
            event: eventChoices.fetchTickets,
          })
        );
        initializingGamePage();
      }
    };
  }, []);

  const handleCardClick = (e: React.MouseEvent): void => {
    const target = e.target as HTMLButtonElement;
    emitCardSelect({ cardSelected: target.value });
  };

  const handleStartTimer = (): void => {
    if (isSocketRefValid())
      socketRef?.current?.send(
        JSON.stringify({
          event: eventChoices.startTimer,
        })
      );
  };

  const handleSkipTicket = (): void => {
    if (isSocketRefValid()) {
      socketRef?.current?.send(
        JSON.stringify({
          event: eventChoices.skipTicket,
        })
      );
      initializingGamePage();
    }
  };

  const checkFinalEstimationError = (): boolean => {
    return finalEstimation.length !== 0 && !integerRegex.test(finalEstimation);
  };

  const handleNextTicket = (): void => {
    if (isSocketRefValid()) {
      socketRef?.current?.send(
        JSON.stringify({
          event: eventChoices.finalEstimation,
          estimation: +finalEstimation,
        })
      );
      initializingGamePage();
    }
  };

  const handleEndGame = () => {
    if (isSocketRefValid()) {
      socketRef?.current?.send(
        JSON.stringify({
          event: eventChoices.endGame,
        })
      );
    }
  };

  const handleAddComment = () => {
    if (boardID) {
      dispatch(addComment(boardID, comment, ticket.jira_ticket || ''));
      setComment('');
      setIsCommentModalOpen(true);
    }
  };

  return (
    <PokerBoardStartGame
      handleCardClick={handleCardClick}
      ticket={ticket}
      userSelection={userSelection}
      usersWhoSelected={usersWhoSelected}
      boardSession={boardSession}
      timeLeft={timeLeft}
      locallyStoredUserID={+locallyStoredUserID}
      managerPanelList={managerPanelList}
      currentGameState={currentGameState}
      handleStartTimer={handleStartTimer}
      handleSkipTicket={handleSkipTicket}
      finalEstimation={finalEstimation}
      setFinalEstimation={setFinalEstimation}
      checkFinalEstimationError={checkFinalEstimationError}
      handleNextTicket={handleNextTicket}
      userEstimations={userEstimations}
      handleEndGame={handleEndGame}
      role={role}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      navigate={navigate}
      boardID={boardID || ''}
      comment={comment}
      setComment={setComment}
      handleAddComment={handleAddComment}
      isCommentModalOpen={isCommentModalOpen}
      setIsCommentModalOpen={setIsCommentModalOpen}
      isError={isError}
    />
  );
};
