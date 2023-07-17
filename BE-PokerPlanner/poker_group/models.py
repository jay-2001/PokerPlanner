from django.conf import settings
from django.core.validators import MinLengthValidator
from django.db import models

import constants
from poker_board.models import PokerBoard
from versioning_control.models import VersioningControl


class PokerGroup(VersioningControl):
    """
    A class for pokergroup model.

    ...

    Fields
    ----------
    name : str
        name of the board
    description : str
        description of the board
    admin : foreign key
        admin of group and foreign key to the user
    members : many-to-many field
        stores info about users in the group and many to many field with user
    boards : many-to-many field
        stores info about boards of the group and many to many field with board
    """
    name = models.CharField(
        max_length=constants.GROUP_NAME_MAX_LEN, validators=[MinLengthValidator(3)], unique=True
    )
    description = models.TextField(
        null=True, blank=True, max_length=constants.DESCRIPTION_MAX_LEN
    )
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='PokerGroupMember', related_name='poker_group_user'
    )
    boards = models.ManyToManyField(
        PokerBoard, through='PokerGroupBoard', related_name='poker_group_board'
    )

    def __str__(self):
        return str(self.name)


class PokerGroupMember(VersioningControl):
    """
    A class to store through relation between PokerUser and PokerGroup.

    ...

    Fields
    ----------
    user : foreign key
        foreign key to PokerBoard model
    group : foreign key
        foreign key to PokerGroup model
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(PokerGroup, on_delete=models.CASCADE)

    class Meta:
        """
        A class to describe extra properties of this PokerGroupMember model

        ...

        Has a unique together attribute which means that user and group together
        should be unique.
        """
        unique_together = ('user', 'group')


class PokerGroupBoard(VersioningControl):
    """
    A class to store through relation between PokerBoard and PokerGroup.

    ...

    Fields
    ----------
    board : foreign key
        foreign key to PokerBoard model
    group : foreign key
        foreign key to PokerGroup model
    """
    board = models.ForeignKey(PokerBoard, on_delete=models.CASCADE)
    group = models.ForeignKey(PokerGroup, on_delete=models.CASCADE)

    class Meta:
        """
        A class to describe extra properties of this PokerGroupBoard model

        ...

        Has a unique together attribute which means that board and group together
        should be unique.
        """
        unique_together = ('board', 'group')
