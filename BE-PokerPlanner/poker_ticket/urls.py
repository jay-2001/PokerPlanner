from django.urls import include, path, re_path
from rest_framework.routers import SimpleRouter

from poker_ticket.views import (
   FetchJiraTicketAPIView, LoggedInUserTicketsApiView, PokerBoardEstimatedTicketsListView,
   TicketView, TicketEstimationView, TicketCommentView,
)

routers = SimpleRouter()
routers.register('', TicketView)

urlpatterns = [
   re_path(r'^list/$', LoggedInUserTicketsApiView.as_view(), name='ticketlist'),
   re_path(r'^boards/(?P<bk>\d+)/tickets/$', PokerBoardEstimatedTicketsListView.as_view()),
   re_path(r'^boards/(?P<bk>\d+)/ticket/jira/', FetchJiraTicketAPIView.as_view(), name='jira_ticket'),
   re_path(r'^boards/(?P<bk>\d+)/ticket/comment/$', TicketCommentView.as_view(), name='comment'),
   re_path(
      r'^boards/(?P<bk>\d+)/ticket/(?P<pk>\d+)/estimation/$', TicketEstimationView.as_view(), name='estimation'
   ),
   re_path(r'^boards/(?P<bk>\d+)/ticket/', include(routers.urls), name='ticket'),
]
