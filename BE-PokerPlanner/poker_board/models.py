from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinLengthValidator
from django.db import models

import constants
from versioning_control.models import VersioningControl


class PokerBoard(VersioningControl):
    """
    A class for pokerboard model.

    ...

    Fields
    ----------
    name : str
        name of the board
    description : str
        description of the board
    manager : foreign key
        manager of board and foreign key to the user
    users : many-to-many field
        stores info about users in the board and many to many field with user
    voting_system : int
        an integer field that represents a choice defined in constants
    estimation_choices : Array field
        an array containing all the estimation choices available on the poker board
    """
    name = models.CharField(
        unique=True, max_length=constants.BOARD_NAME_MAX_LEN, validators=[MinLengthValidator(2)]
    )
    description = models.TextField(
        null=True, blank=True, max_length=constants.DESCRIPTION_MAX_LEN
    )
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='PokerRole', related_name='board'
    )
    voting_system = models.IntegerField(
        default=constants.voting_system.fibonacci, choices=constants.VOTING_SYSTEM_CHOICES
    )
    estimation_choices = ArrayField(models.PositiveIntegerField(null=True, blank=True), size=8)

    def __str__(self):
        return str(self.name)


class PokerRole(VersioningControl):
    """
    A class to store through relation between PokerBoard and PokerUser.

    ...

    Fields
    ----------
    user : foreign key
        foreign key to PokerUser model
    poker : foreign key
        foreign key to PokerBoard model
    role : int
        an integer field that represents a choice defined in constants
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    poker = models.ForeignKey(PokerBoard, on_delete=models.CASCADE)
    role = models.IntegerField(default=constants.roles.spectator, choices=constants.ROLE_CHOICES)

    class Meta:
        """
        A class to describe extra properties of this PokerRole model

        ...

        Has a unique together attribute which means that user and poker together
        should be unique.
        """
        unique_together = ('user', 'poker')
