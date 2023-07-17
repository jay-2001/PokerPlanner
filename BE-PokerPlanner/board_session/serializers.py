from rest_framework import serializers

from board_session.models import BoardSession
from poker_board.serializers import PokerBoardSerializer, PokerBoard


class BoardSessionSerializer(serializers.ModelSerializer):
    """
    A serializer class to serialize the session of a board giving us the timer .
    Overrides create method to add board to the session which is coming as board_id in request
    """
    board = PokerBoardSerializer(required=False)
    class Meta:
        model = BoardSession
        exclude = ['created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['board'] = PokerBoard.objects.get(id=self.context['kwargs']['bk'])
        return super().create(validated_data)
