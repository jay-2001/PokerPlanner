from django.urls import include, path, re_path
from rest_framework.routers import SimpleRouter

from poker_board.views import (
    BoardAPIViewSet, LoggedInUserBoardsApiView, PokerChangeUserRoleAPIView, PokerUserRoleAPIView,
    AcceptInviteViewSet, InviteViewSet
)

router = SimpleRouter()
router.register('', BoardAPIViewSet, basename='boardapi')

urlpatterns = [
    re_path(r'(?P<bk>\d+)/user/(?P<pk>\d+)/$', PokerChangeUserRoleAPIView.as_view()),
    re_path(r'(?P<bk>\d+)/user/$', PokerUserRoleAPIView.as_view()),
    re_path(r'^list/$', LoggedInUserBoardsApiView.as_view()),
    path('<int:pk>/invite/', InviteViewSet.as_view()),
    path('<int:pk>/acceptinvite/', AcceptInviteViewSet.as_view()),
    path('', include(router.urls)),
]
