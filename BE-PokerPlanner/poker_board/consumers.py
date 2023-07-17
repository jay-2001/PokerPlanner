import asyncio
import json
import statistics

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from poker_board import constants as board_constants
from board_session.models import BoardSession
from poker_ticket import (
    models as poker_ticket_models, serializers as poker_ticket_serializers
)


class WebScoketStore:
    '''
    Websocket Store basically handle variable for playing pokerboard game 
    so that we don't needed to make database query.
    '''

    def __init__(self):
        self.store = {}
        self.store_user_id = {}
        self.tickets = {}
        self.timer_task = {}
        self.timer = {} 

    def create_game_instance(self, game, timer_count, game_member):
        """
        Creates a new instance of the game with the specified name and initializes
        necessary data structures for the game. 

        Args:
        - game: A string representing the name of the game instance to be created.

        Returns: None
        """
        if self.store.get(game):
            return

        self.store[game] = {}
        self.store_user_id[game] = {}
        self.tickets[game] = []
        self.timer_task[game] = ''
        self.timer[game] = timer_count

        self.initial_data(game_member, game)

    def get_timer_task(self, game):
        """
        Returns the current timer task associated with the specified game instance.

        Args:
        - game: A string representing the name of the game instance.

        Returns:
        - The current timer task associated with the specified game instance.
        """
        return self.timer_task[game]
    
    def set_timer_task(self, game, value):
        """
        Sets the timer task for the specified game instance to the specified value.

        Args:
        - game: A string representing the name of the game instance.
        - value: A string representing the timer task to be set.

        Returns: None
        """
        self.timer_task[game] = value
    
    def set_timer(self, time, game):
        """Set the value of the timer to the given time."""
        
        self.timer[game] = time

    def get_timer(self, game):
        """Return the current value of the timer."""
        
        return self.timer[game]
    
    def decrement_timer(self, game):
        """Decrement the timer by 1 second."""
        
        self.timer[game] -= 1

    def websocket_store(self, game):
        """Return a JSON representation of the WebSocket store."""
        
        return self.store[game]
    
    def get_current_ticket(self, game):
        """Return a JSON representation of the current ticket being estimated."""

        return json.loads(json.dumps(
            poker_ticket_serializers.UserTicketEstimationSerializer(self.tickets[game][0]).data
        )) if len(self.tickets[game]) else None
    
    def skip_ticket(self, game):
        """
        Remove the current ticket from the list of tickets being estimated 
        and append it to the end.
        """
        
        if self.tickets[game]:
            self.tickets[game].append(self.tickets[game].pop(0))

    def initial_data(self, game_members, game):
        """Initialize the WebSocket store with data about the game members."""
        for users in list(game_members):
           self.store[game][users["email"]] = "not estimated"
           self.store_user_id[game][users["email"]] = users["id"]
        return self.store[game]   
    
    def load_database_tickets(self, tickets, game):
        """Load the list of poker tickets from the database."""

        self.tickets[game] = list(tickets)

    def user_estimation(self, email, estimation, game):
        """Store the estimation made by a user for a ticket."""

        self.store[game][email] = estimation
        return self.store[game]
    
    def final_estimation(self, ticket_id, game):
        """Store the final estimation made by all users for a ticket in the database."""

        user_estimations = [
            poker_ticket_models.PokerUserEstimation(
                user_id=self.store_user_id[game][email], ticket_id=ticket_id, estimate=estimation
            ) for email, estimation in self.store[game].items() if estimation != "not estimated"
        ]
        return user_estimations
    
    def ticket_analysis(self, game):
        """
        Compute and return basic statistics about the ticket estimations.

        This method is a class method, meaning it's called on the class object
        rather than on an instance of the class. It uses the `self.store` class
        attribute, which is a dictionary that stores the ticket estimations.

        If there are no ticket estimations, the method returns the string
        "TICKET IS NOT ESTIMATED BY ANYONE". Otherwise, it returns a dictionary
        with the following keys:
        - "min_ticket_estimation": the minimum estimation among all estimations
        - "max_ticket_estimation": the maximum estimation among all estimations
        - "avg_ticket_estimation": the average estimation among all estimations

        Returns:
        --------
        Union[str, dict]: A string or a dictionary containing the ticket statistics.
        """

        ticket_est = [e for e in list(self.store[game].values()) if isinstance(e, int)]
        tikcet_statistics_analysis = {
                board_constants.MIN_TICKET_ESTIMATION: min(ticket_est),
                board_constants.MAX_TICKET_ESTIMATION: max(ticket_est),
                board_constants.AVG_TICKET_ESTIMATION: statistics.mean(ticket_est)
            } if len(ticket_est) else board_constants.NOBODY_TICKET_ESTIMATION
        return tikcet_statistics_analysis
    
obj = WebScoketStore()


class PokerBoardAsyncConsumer(AsyncJsonWebsocketConsumer):
    '''
    This consumer handles WebSocket connections and sends and receives JSON data.

    Methods:
    [1]. connect: Called when a client connects to the WebSocket and add to groups.
    [2]. disconnect: Called when a client disconnects from the WebSocket groups.
    [3]. is_manager: Return True if login user is pokerboard manager or not.
    [4]. receive_json: Called when the consumer receives a JSON message from the client.
    [5]. authentication_database_query: Require Database query for validate user is auth user or not.
    [6]. save_estimation: Save manager estimation of Ticket to database.
    [7]. ticket_database_query: Fetch Ticket from database and load to websocket store.
    [8]. user_is_authenticated: Close connection if user is not connected.
    [9]. timer: Start timer when game is started and same for all connected user.
    [10]. decrement_timer: Call send message with type timer.
    [11]. create_group: Create group in self instance.
    [12]. add_channels_to_group: Add channels(user) to respective group.
    [13]. send_group_message: Then sends the message to all the consumers that are currently subscribed.
    [14]. discard_channel_from_group: The channel name of the client to remove from the group.
    [15]. send_message: Used to send a message over the WebSocket connection.
    [16]. estimate_card: Filter message data before send to connected channels.
    [17]. manager_room: Send data on manager group.
    [18]. users_estimation: Send users estimated data to all connected user.
    [19]. final_estimation: Send manager final estimation choice to all connected user.
    [20]. get_current_ticket: Return current ticket on which we are going to estimate.
    [21]. end_game: Disconnect all user when event is fire from FE.
    [22]. disable_session: call websocket_disconnect function
    [23]. websocket_disconnect: Disconnect all user from given channels.
    [24]. send_role: On Connection auth user's role send it to user.
    [25]. ticket_analysis: Send Analysis data of Ticket(min, max , avg).
    '''

    async def connect(self):
        """
        Connects the user to the application and completes necessary setup steps.
        
        This method first checks if the user is authenticated using `user_is_authenticated()`.
        It then creates a group using `create_group()`. If the user is a manager, the manager group
        is added to the group using `add_channels_to_group()`. The player group is always added to the
        group using `add_channels_to_group()`. Finally, the user accepts the connection using `accept()`.
        """

        await self.user_is_authenticated()  
        await self.create_group()
        if await self.is_manager():
            await self.add_channels_to_group(self.manager_group)
        await self.add_channels_to_group(self.player_group)
        await self.accept()   
        await self.send_role()
    
    async def disconnect(self, code):
        """
        Disconnects the user from the application and removes the user 
        from any groups they may be a part of.
        
from poker_ticket import 
        This method discards the player group from the group using `discard_channel_from_group()`.
        It also discards the manager group from the group using `discard_channel_from_group()`.
        The `code` parameter is the WebSocket close code that will be sent to the client.
        """

        await self.discard_channel_from_group(self.player_group)
        await self.discard_channel_from_group(self.manager_group)

    async def is_manager(self):
        """
        Determines if the current user is a manager.
        
        This method compares the board_constants.USER key in the scope dictionary to the 'pokerboard_manager'
        attribute of the current instance. If they match, then the user is considered to be a manager
        and True is returned. Otherwise, False is returned.
        
        Returns:
            bool: True if the user is a manager, False otherwise.
        """

        return self.scope[board_constants.USER] == self.pokerbaord_manager

    async def receive_json(self, content):
        content[board_constants.EMAIL] = self.scope[board_constants.USER].email
        if await self.is_manager():
            if content[board_constants.EVENT] == board_constants.START_TIMER:
                obj.set_timer(self.timer_count, self.current_game)
                if obj.get_timer_task(self.current_game) != '':
                    obj.get_timer_task(self.current_game).cancel()
                obj.set_timer_task(self.current_game, asyncio.create_task(self.timer()))
            elif content[board_constants.EVENT] == board_constants.SKIP_TICKET:
                obj.skip_ticket(self.current_game)
            elif content[board_constants.EVENT] == board_constants.USERS_ESTIMATION:
                await self.send_group_message(board_constants.USERS_ESTIMATION, self.player_group, content)
            elif content[board_constants.EVENT] == board_constants.FINAL_ESTIMATION:
                await self.save_estimation(content[board_constants.ESTIAMTION])
                await self.send_group_message(board_constants.FINAL_ESTIMATION, self.player_group, content)
            elif content[board_constants.EVENT] == board_constants.END_GAME:
                await self.send_group_message(board_constants.END_GAME, self.player_group, content)
            elif content[board_constants.EVENT] == board_constants.TICKET_ANALYSIS:
                await self.send_group_message(board_constants.TICKET_ANALYSIS, self.player_group, content)
        
        if content[board_constants.EVENT] == board_constants.FETCH_TICKET:
            await self.ticket_database_query()
        elif content[board_constants.EVENT] == board_constants.GET_CURRENT_TICKET:
            await self.send_group_message(board_constants.GET_CURRENT_TICKET, self.player_group, 
                obj.get_current_ticket(self.current_game)
            )   
        elif content[board_constants.EVENT] == board_constants.CARD_SELECTED and self.role == board_constants.PLAYER:
            obj.user_estimation(content[board_constants.EMAIL], content[board_constants.CARD], self.current_game)
            await self.send_group_message(board_constants.ESTIMATED_CARD, self.player_group, content)
            await self.send_group_message(board_constants.MANAGER_ROOM, self.manager_group, content)

    async def authentication_database_query(self):
        """
        Queries the database to authenticate the WebSocket client.
        
        This method queries the database to authenticate the WebSocket 
        client using the 'id' key from the 'url_route' dictionary in 
        the 'scope' attribute of the current instance. It retrieves the
        BoardSession object corresponding to the given ID and its associated members, 
        and checks if the current user is a member of the board. It also retrieves 
        the board's manager and the timer count for the current session. 
        The results of the database queries are stored in various
        attributes of the current instance for later use.
        """

        self.session = self.scope['url_route']['kwargs']['id']
        self.game_session = await database_sync_to_async(
            BoardSession.objects.get
        )(id = self.session)
        self.game_members = await database_sync_to_async(
            self.game_session.board.users.values
        )('id', 'email')
        self.is_user_member_of_pokerboard = await database_sync_to_async(
            self.game_members.filter
        )(email = self.scope[board_constants.USER].email)
        self.poker_role_instance = await database_sync_to_async(
            self.game_session.board.pokerrole_set.get)(user = self.scope[board_constants.USER]
        )
        
        self.current_game = board_constants.POKERBOARD + str(self.game_session.board.id) + board_constants.SESSION + str(self.game_session.id) 
        self.role = self.poker_role_instance.role
        self.pokerbaord_manager = self.game_session.board.manager
        self.timer_count = self.game_session.timer

    async def save_estimation(self, estimation):
        """
        Saves the estimation for the current ticket to the database.

        This method retrieves the current ticket from the 'obj' and updates 
        its estimation details with the provided board_constants.ESTIAMTION. It then sets the 
        'is_estimated' flag to True for the current ticket and saves the changes to the 
        database. Finally, it updates the 'obj' with the final estimation 
        details of the current ticket. The method does not return anything.
        
        Args:
            estimation: The final estimation value for the current ticket.
        """

        current_ticket = obj.tickets[self.current_game].pop(0)
        current_ticket.is_estimated = True
        current_ticket.final_estimation = estimation
        await database_sync_to_async(current_ticket.save)()
        user_estimations = obj.final_estimation(current_ticket.id, self.current_game)
        await database_sync_to_async(
            poker_ticket_models.PokerUserEstimation.objects.bulk_create
        )(user_estimations)

    async def ticket_database_query(self):
        """
        Queries the database to retrieve the tickets for the current session.

        This method queries the database to retrieve all the poker tickets associated 
        with the current board session. The retrieved tickets are then passed to the 
        'load_database_tickets()' method of the 'obj' to update the store 
        with the latest tickets. The method does not return anything.
        """

        self.ticket = await database_sync_to_async(
            self.game_session.board.poker_ticket.filter
        )(is_estimated=False)
        
        obj.load_database_tickets(self.ticket, self.current_game)
        
    async def user_is_authenticated(self):
        """
        Checks if the user is authenticated and a member of the current board session.

        This method first checks if the user is authenticated. If the user is not authenticated,
        the method closes the WebSocket connection by calling the 'close()' method. 
        Next, the method calls the 'authentication_database_query()' method to retrieve information
        about the current board session and its members. If the user is not a member of the current 
        board session, the method closes the WebSocket connection.
        Finally, the method initializes the WebSocketStore with the retrieved member data using the
        'initial_data()' method of the 'obj'. 
        The method does not return anything.
        """

        if not self.scope[board_constants.USER].is_authenticated:
            await self.close() 
        await self.authentication_database_query()
        if not self.is_user_member_of_pokerboard.exists():
            await self.close()
        
        obj.create_game_instance(self.current_game, self.timer_count, self.game_members)
        
    async def timer(self):  
        """
        An async method that implements a timer functionality for a WebSocket connection. 
        The timer is implemented using a while loop that will continue running as long as 
        the remaining time is greater than zero. The timer updates and broadcasts the remaining 
        time to the WebSocket connection's player group after every second using the
        `send_group_message` method. Additionally, the `obj.update_timer()` method 
        is called to decrement the remaining time by 1 second.
        """

        while obj.get_timer(self.current_game) >= 0:
            await asyncio.sleep(1)
            await self.send_group_message('timer_update', self.player_group, 
                                          obj.get_timer(self.current_game)
            )
            obj.decrement_timer(self.current_game)

    async def timer_update(self, event):
        """
        A WebSocket event handler that sends the updated timer value to the client.

        Parameters:
        - event (dict): A dictionary containing the event data. It should have a board_constants.DATA key
        that contains the updated timer value.

        Returns:
        - None
        """

        await self.send_message('timer', event[board_constants.DATA])

    async def create_group(self):
        """
        Async method to create two group names for the websocket connection - 
        a player group and a manager group.
        """
        
        self.player_group = f'player_group{self.current_game}'
        self.manager_group = f'manager_group{self.current_game}'

    async def add_channels_to_group(self, group_name):
        """
        Asynchronously adds the current channel to the specified group in the channel layer.
        Arguments:
        - group_name (str): The name of the group to which the channel needs to be added.

        Returns:
        - Coroutine object representing the result of the group add operation.
        """

        return await self.channel_layer.group_add(
            group_name,
            self.channel_name
        )
    
    async def send_group_message(self, type, group_name, data):
        """
        This asynchronous method sends a message to all channels in a group.

        Args:

        type: A string representing the type of the message.
        group_name: A string representing the name of the group to send the message to.
        data: The data payload to be sent with the message.
        Returns:

        A coroutine that sends the message to all channels in the group.
        """

        return await self.channel_layer.group_send(
            group_name,
            {
                'type': type,
                'data': data,
                board_constants.SENDER_CHANNEL_NAME: self.channel_name
            }
        )
    
    async def discard_channel_from_group(self, group_name):
        """
        This function removes the channel associated with the current WebSocket consumer instance 
        from a specific group.

        Arguments:

        group_name (str): The name of the group to remove the channel from.
        """
        return await self.channel_layer.group_discard(
            group_name,
            self.channel_name
        )
    
    async def send_message(self, type, data):
        """
        This method sends a JSON message to the client connected to the channel. It takes two arguments:

        type: A string representing the type of the message being sent.
        data: The data to be sent to the client.
        The method returns a coroutine which sends the message to the connected client.
        """

        return await self.send_json({
            'type': type,
            'data': data
        })

    async def estimate_card(self, event):
        """
        This function estimate_card is an asynchronous function that takes an event as a parameter. 
        The event is a dictionary that contains information about the estimation of a card by a player. 
        This function checks if the sender_channel_name of the event matches the current channel_name of 
        the player. If they match, the function sends a message to the player informing that their card 
        has been selected. If the names do not match, the function sends a message to the player that 
        shows which other player selected a card. The function does not return any value.
        """

        if event[board_constants.SENDER_CHANNEL_NAME] == self.channel_name:
            await self.send_message(board_constants.CARD_SELECTED, event[board_constants.DATA])
        else:
            await self.send_message(board_constants.CARD_SELECTED_BY_PLAYER, { "email" : event[board_constants.DATA][board_constants.EMAIL] })

    async def manager_room(self, event):
        """
        Sends a message to the current WebSocket client with type `card_selected_by_player_for_manager` 
        and the data from the `event` parameter. The message contains information about a card selection 
        made by a player and is intended for the manager of the poker game to see.
        """

        await self.send_message(board_constants.CARD_SELECTED_BY_PLAYER_FOR_MANAGER, event[board_constants.DATA])

    async def users_estimation(self, event):
        """
        Sends a WebSocket message to the connected client with the estimation data of all users.

        Args:
            event: A dictionary that is not used in the method body.

        Returns:
            None.
        """
                
        await self.send_message(board_constants.USERS_ESTIMATION, obj.websocket_store(self.current_game))

    async def final_estimation(self, event):
        """
        Asynchronously sends a message of type board_constants.FINAL_ESTIMATION to the WebSocket consumer.

        Parameters:
        - event (Dict[str, Any]): A dictionary containing the final estimation data.

        Returns:
        - None
        """

        await self.send_message(board_constants.FINAL_ESTIMATION, event[board_constants.DATA])

    async def get_current_ticket(self, event):
        """
        Send the current ticket details to the client.

        Parameters:
            - event: A dictionary containing the WebSocket event data.

        Returns:
            None
        """
        if not event[board_constants.DATA]:
            await self.disable_session()
        else:
            await self.send_message(board_constants.GET_CURRENT_TICKET, event[board_constants.DATA])

    async def end_game(self, event):
        """
        A coroutine function that ends the current game session.

        Args:
            event: A dictionary that contains the event data.

        Returns:
            None.

        Raises:
            None.
        """
        await self.disable_session()

    async def disable_session(self):
        """
        A coroutine function that disables the current game session.

        Args:
            None.

        Returns:
            None.

        Raises:
            None.
        """

        self.game_session.is_active=False
        await database_sync_to_async(self.game_session.save)()
        await self.send_group_message('websocket_disconnect', self.manager_group, 'disconnect')
        await self.send_group_message('websocket_disconnect', self.player_group, 'disconnect')

    async def websocket_disconnect(self, event):
        """
        Called when a WebSocket connection is closed. This method closes the WebSocket
        channel by calling the `close` method.

        Args:
            event: A dictionary containing information about the disconnection event.
                This dictionary may contain additional keys depending on the event.

        Returns:
            None.
        """
        await self.close()

    async def send_role(self):
        """
        Send a JSON message containing the value of the `self.role` attribute.

        This method is asynchronous and uses the `await` keyword to pause its
        execution if necessary. It sends a JSON message to the recipient using
        the `send_json` method of this object.

        Returns:
        --------
        None
        """
        return await self.send_json({
            'type': board_constants.ROLE,
            'data': self.role
        })

    async def ticket_analysis(self, event):
        """
        Send a message containing basic statistics about the ticket estimations.

        This method is asynchronous and uses the `await` keyword to pause its
        execution if necessary. It takes an `event` argument, which is a string
        identifying the type of the message to send.

        The method calls the `obj.ticket_analysis()` class method
        to compute the ticket statistics and sends them as a message to the
        recipient using the `send_message` method of this object.

        Returns:
        --------
        None
        """
        await self.send_message(board_constants.TICKET_ANALYSIS, obj.ticket_analysis(self.current_game))
