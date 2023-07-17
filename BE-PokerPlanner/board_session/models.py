from django.db import models

import constants
from versioning_control.models import VersioningControl


class BoardSession(VersioningControl):
    """
    A class for storing the session of a board.

    ...

    Fields
    ----------
    board : foreign key
        foreign key to the pokerboard model to store session of a particular board
    timer : positive integer field
        stores the timer for that session of the board
    is_active : boolean
        a boolean used to store if the session is active or completed
    """
    board = models.ForeignKey('poker_board.PokerBoard', on_delete=models.CASCADE)
    timer = models.PositiveIntegerField(default=constants.DEFAULT_GAME_TIMER_IN_SECONDS)
    is_active = models.BooleanField(default=True)
