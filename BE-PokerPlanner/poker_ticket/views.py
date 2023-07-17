from rest_framework import generics as rest_generics
from rest_framework.filters import OrderingFilter
from rest_framework.viewsets import ModelViewSet

from poker_ticket import pagination
from poker_ticket import models as ticket_models
from poker_ticket import serializers as ticket_serializers
from poker_ticket.permissions import TicketPermissions


class FetchJiraTicketAPIView(rest_generics.CreateAPIView):
    """
    Create API view to fetch ticket from jira and save it to Ticket table for particular pokerboad.
    request foramt:
    {
        "jira_query_params":"1"
    }
    success response format
        {
            status: 201,
            []
        }
    
    """
    serializer_class = ticket_serializers.FetchJiraTicketSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'pokerboard': self.kwargs['bk'], 'operation': self.request.query_params['operation']
        })
        return context


class TicketView(ModelViewSet):
    """
    Description: List operation of Ticket on given pokerboard id
    base url: /boards/<pokerboard_id:1>/ticket/
    [1]. Fetch all Ticket in pokerboard 
    GET request:/boards/<pokerboard_id:1>/ticket/
    success response format
        {
            status: 200,
            [
                {
                    "jira_ticket": "new_ticket1",
                    "pokerboard": 2,
                    "summary": "hi",
                    "description": null
                },
                {
                    "jira_ticket": "new_ticket2",
                    "pokerboard": 2,
                    "summary": "bye",
                    "description": null
                }
            ]
        }
    
    [2]. Fetch Detail about ticket with id
    GET request:/boards/<pokerboard_id:1>/ticket/<ticket_id>
    success response format
        {
            status: 200,
            {
                "jira_ticket": "new_ticket2",
                "pokerboard": 2,
                "summary": "bye",
                "description": null
            }
        }
    
    [3]. Delete ticket with id
    DELETE request:/boards/<pokerboard_id:1>/ticket/<ticket_id>
    success response format
        {
            status: 200
            []
        }
        
    [4]. Create ticket on pokerboard with id
    DELETE request:/boards/<pokerboard_id:1>/ticket/
    request format:
        request format:
        {
            "jira_ticket": "new_ticket11",
            "summary": "hi",
            "description": null
        }
    success response format
        {
            status: 200
            {
                "jira_ticket": "new_ticket11",
                "pokerboard": 2,
                "summary": "hi",
                "description": null
            }
        }
    
    [5]. Update Field in ticket
        request format:
            request format:
            {
                "summary": "jay"
            }
        success response format
            {
                status: 200
                {
                    "jira_ticket": "new_ticket11",
                    "pokerboard": 2,
                    "summary": "jay",
                    "description": null
                }
            }
    """
    permission_classes = [TicketPermissions]
    queryset = ticket_models.Ticket.objects.all()
    serializer_class = ticket_serializers.TicketSerializer
    
    def get_queryset(self):
        return self.queryset.filter(pokerboard__id=self.kwargs['bk'])
    

class TicketCommentView(rest_generics.CreateAPIView):
    serializer_class = ticket_serializers.CommentTicketSerializer


class PokerBoardEstimatedTicketsListView(rest_generics.ListAPIView):
    """
    Description: API to get the list of all the tickets that are estimated on the board
    Request: GET method
    Response format: 
    [
        {
            "jira_ticket": "ticket A"
        },
        {
            "jira_ticket": "PP-2;https://nikshit.atlassian.net/rest/api/2/issuetype/10004"
        }
    ]
    """
    serializer_class = ticket_serializers.PokerBoardEstimatedTicketSerializer
    
    def get_queryset(self):
        return ticket_models.Ticket.objects.filter(is_estimated=True, pokerboard__id=self.kwargs['bk'])


class LoggedInUserTicketsApiView(rest_generics.ListAPIView):
    """
    Description: To fetch all the tickets of logged in user
    Request: GET request
    Response format: 
    {
    "count": 3,
    "next": "http://127.0.0.1:8000/tickets/list/?page=2",
    "previous": null,
    "results": [
        {
        "id": 2,
        "ticket_detail": {
            "id": 2,
            "jira_ticket": "ticket A",
            "summary": "jvbcjnvjnvc",
            "description": "",
            "is_estimated": true,
            "final_estimation": 13,
            "pokerboard": 18
        },
        "estimate": 1
        },
        {
        "id": 3,
        "ticket_detail": {
            "id": 3,
            "jira_ticket": "ticket B",
            "summary": "this is a ticket",
            "description": "enwedniedhiod",
            "is_estimated": true,
            "final_estimation": 12,
            "pokerboard": 5
        },
        "estimate": 13
        }
    ]
    }
    """
    serializer_class = ticket_serializers.UserTicketFetchSerializer
    pagination_class = pagination.CustomPagination
    filter_backends = [OrderingFilter]
    ordering = ['ticket__jira_ticket']

    def get_queryset(self):
        return ticket_models.PokerUserEstimation.objects.select_related('ticket').filter(
            user=self.request.user
        )


class TicketEstimationView(rest_generics.UpdateAPIView):
    """
    A view to add estimaton for a jira ticket's estimation.

    POST Request:  /boards/<int:bk>/ticket/estimation/

    request: 
            {
                "issue": "PP-3",
                "estimation": 123
            }

    respone: 
            status code: 200OK
            {
                "issue": "PP-3",
                "estimation": 123
            }
    """
    permission_classes = [TicketPermissions]
    serializer_class = ticket_serializers.TicketEstimationSerializer
    
    def get_queryset(self):
        return ticket_models.Ticket.objects.filter(id=self.kwargs['pk'], pokerboard__id=self.kwargs['bk'])
