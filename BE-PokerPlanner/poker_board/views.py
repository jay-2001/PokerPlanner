from rest_framework import generics
from rest_framework.filters import OrderingFilter
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from poker_board import pagination
from poker_board.models import PokerRole
from poker_board.permissions import BoardPermissions
from poker_board.serializers import (
    AcceptInviteSerailizer, InviteSerailizer, PokerBoard, PokerBoardSerializer,
    PokerRoleSerializer, PokerRoleChangeSerializer, UserBoardFetchSerializer
)


class BoardAPIViewSet(ModelViewSet):
    """
    A viewset class used to make api for CRUD on PokerBoard.
    Inherits ModelViewSet which contains all the necessary actions.

    attributes
    --------------
    permission_classes : tells what kind of permissions are needed to perform crud on it.
    qeryset : tells what queryset should be used to perform CRUD on PokerBoard
    serializer_class : tells what serializer to use to serialize data coming from response

    """
    permission_classes = [BoardPermissions,]
    queryset = PokerBoard.objects.prefetch_related('users').all()
    serializer_class = PokerBoardSerializer
    filter_backends = [OrderingFilter]
    ordering = ['id']

    def get_queryset(self):
        return self.queryset.filter(users__id=self.request.user.id)


class PokerChangeUserRoleAPIView(generics.UpdateAPIView):
    """
    Description: API to change role of a single user on pokerboard
    Request format: 
    {
     "role": 0
    }
    Response format: 
    {
        "poker": 19,
        "user": 3,
        "role": 0
    }
    """
    permission_classes = [BoardPermissions,]
    queryset = PokerRole.objects.all()
    serializer_class = PokerRoleChangeSerializer
    
    def get_object(self):
        return self.queryset.get(user__id=self.kwargs['pk'], poker__id=self.kwargs['bk'])


class PokerUserRoleAPIView(generics.ListAPIView):
    """
    Description: API to get the roles of all the users on pokerboard
    Request: GET method
    Response format: 
    [
        {
            "poker": 19,
            "user": 1,
            "role": 1,
            "user_email": "nikshit.monga@joshtechnologygroup.com"
        },
        {
            "poker": 19,
            "user": 8,
            "role": 1,
            "user_email": "rashmija@gmail.com"
        }
    ]
    """
    serializer_class = PokerRoleSerializer
    filter_backends = [OrderingFilter]
    ordering = ['id']
    
    def get_queryset(self):
        return PokerRole.objects.filter(poker__id=self.kwargs['bk'])


class LoggedInUserBoardsApiView(generics.ListAPIView):
    """ 
    Desciption: This api fetches all the boards of the logged-in user
    Request: GET request
    Response:
    {
    "count": 5,
    "next": "http://127.0.0.1:8000/boards/list/?page=2",
    "previous": null,
    "results": [
        {
        "id": 16,
        "voting_system": "Fibonacci",
        "manager_first_name": "rashmija",
        "manager_last_name": "pandey",
        "name": "BoardA",
        "description": "",
        "estimation_choices": [
            1,
            2,
            3,
            5,
            8,
            13,
            21,
            34
        ],
        "manager": 1,
        "users": [
            1
        ]
        },
        {
        "id": 19,
        "voting_system": "Fibonacci",
        "manager_first_name": "rashmija",
        "manager_last_name": "pandey",
        "name": "BoardAa",
        "description": "",
        "estimation_choices": [
            1,
            2,
            3,
            5,
            8,
            13,
            21,
            34
        ],
        "manager": 1,
        "users": [
            1
        ]
        }
    ]
    }
    """
    queryset = PokerBoard.objects.all()
    serializer_class = UserBoardFetchSerializer
    pagination_class = pagination.CustomPagination
    filter_backends = [OrderingFilter]
    ordering = ['name']
    
    def get_queryset(self):
        return self.queryset.filter(users__id=self.request.user.id)
class InviteViewSet(UpdateAPIView):
    """
    A view class used to make api call to invite user in pokerboard

    attributes
    --------------
    permission_classes : only manager can invite user.
    qeryset : tells what queryset should be used to perform CRUD on PokerBoard
    serializer_class : tells what serializer to use to serialize data coming from response

    url: PATCH boards/<borad_id>/invite/
    
    request:
    {
        "user_emails": ["user1@gmail.com", "user2@gmail.com"]
        "group_names": ["group1", "group2"]
    }

    response:
    status code: 200 OK
    {}

    """
    permission_classes = [BoardPermissions,]
    queryset = PokerBoard.objects.prefetch_related('users').all()
    serializer_class = InviteSerailizer


class AcceptInviteViewSet(UpdateAPIView):
    """
    A view set that handles accepting an invitation to join a pokerboard.

    Parameters:
    -----------
    UpdateAPIView : class
        A Django generic view for updating an existing object.

    Example:
    --------
    To accept an invitation to join a pokerboard, use the following URL with a PUT request:
    PATCH/boards/<int:pk>/acceptinvite/

    response:
    status code: 200 OK
    {}
    """

    queryset = PokerBoard.objects.prefetch_related('users')
    serializer_class = AcceptInviteSerailizer

    def get_queryset(self):
        return super().get_queryset().filter(id=self.kwargs['pk'])
