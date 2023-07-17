from django.db.models import Q
from rest_framework.filters import OrderingFilter
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics

from poker_group import pagination
from poker_group.models import PokerGroup
from poker_group.permissions import GroupPermissions
from poker_group.serializers import PokerGroupSerializer, UserGroupFetchSerializer


class GroupAPIViewSet(ModelViewSet):
    """
    A viewset class used to make api for CRUD on PokerGroup.
    Inherits ModelViewSet which contains all the necessary actions.

    attributes
    --------------
    permission_classes : tells what kind of permissions are needed to perform crud on it.
    qeryset : tells what queryset should be used to perform CRUD on PokerGroup
    serializer_class : tells what serializer to use to serialize data coming from response

    """
    permission_classes = [GroupPermissions,]
    queryset = PokerGroup.objects.prefetch_related('members').all()
    serializer_class = PokerGroupSerializer
    filter_backends = [OrderingFilter]
    ordering = ['id']

    def get_queryset(self):
        return self.queryset.filter(
            Q(admin=self.request.user) | Q(members__id__in=[self.request.user.id])
        ).distinct()


class LoggedInUserGroupsApiView(generics.ListAPIView):
    """
    Description: This Api fetches the groups details of logged-in user
    Request: GET request
    Response: 
    {
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
        "id": 21,
        "admin_first_name": "abc",
        "admin_last_name": "abc",
        "name": "hellow",
        "description": "jiqfiqjfoqfm",
        "admin": 12,
        "members": [
            1
        ]
        },
        {
        "id": 22,
        "admin_first_name": "abc",
        "admin_last_name": "abc",
        "name": "ijwoqi",
        "description": "",
        "admin": 12,
        "members": []
        }
    ]
    }
    """
    queryset = PokerGroup.objects.all()
    serializer_class = UserGroupFetchSerializer
    pagination_class = pagination.CustomPagination
    filter_backends = [OrderingFilter]
    ordering = ['name']
    
    def get_queryset(self):
        return self.queryset.filter(Q(members__id=self.request.user.id) | Q(admin=self.request.user))
