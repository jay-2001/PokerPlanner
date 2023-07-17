from django.conf import settings
from django.db import models

import constants
from poker_board.models import PokerBoard
from versioning_control.models import VersioningControl


class Ticket(VersioningControl):
    """
    A class for Ticket model.

    ...

    Fields
    ----------
    jira_ticket : str
        jira ticket id coming from jira apis
    summary : str
        summary of the ticket
    description : str
        description of the ticket
    pokerboard : foreign key
        stores info of the pokerboard it is associated with
    is_estimated : boolean
        tells if the ticket is estimated or not
    final_estimation : float
        stores the final estimation on the ticket
    user_estimation : many-to-many field
        stores all the estimation given by users on the ticket
    """
    jira_ticket = models.CharField(max_length=constants.NAME_MAX_LEN, unique=True)
    summary = models.CharField(null=True, blank=True, max_length=constants.TICKET_SUMMARY_MAX_LEN)
    description = models.TextField(
        null=True, blank=True, max_length=constants.DESCRIPTION_MAX_LEN
    )
    pokerboard = models.ForeignKey(
        PokerBoard, on_delete=models.CASCADE, related_name='poker_ticket'
    )
    is_estimated = models.BooleanField(default=False)
    final_estimation = models.PositiveIntegerField(null=True, blank=True)
    user_estimation = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='PokerUserEstimation',
        related_name='poker_user_estimation'
    )

    def __str__(self):
        return str(self.jira_ticket)


class PokerUserEstimation(VersioningControl):
    """
    A class to store through relation between PokerUser and Ticket.

    ...

    Fields
    ----------
    user : foreign key
        foreign key to PokerBoard model
    ticket : foreign key
        foreign key to Ticket model
    estimate : int
        stores the estimate of the user user_id on ticket ticket_id
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    estimate = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        """
        A class to describe extra properties of this PokerUserEstimation model

        ...

        Has a unique together attribute which means that user and ticket together
        should be unique.
        """
        unique_together = ('user', 'ticket')
