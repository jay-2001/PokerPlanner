from rest_framework.viewsets import ModelViewSet

from board_session.models import BoardSession
from board_session.permissions import BoardSessionMemberPermissions
from board_session.serializers import BoardSessionSerializer


class BoardSessionViewSet(ModelViewSet):
    """
    A viewset class used to make api for CRUD on BoardSession model.
    Inherits ModelViewSet which contains all the necessary actions.

    attributes
    --------------
    permission_classes : tells what kind of permissions are needed to perform crud on it.
    qeryset : tells what queryset should be used to perform CRUD on BoardSession
    serializer_class : tells what serializer to use to serialize data coming from response

    request
    --------------
    Request is something like this
        url endpoint: /boards/<int:board_id>/session/<int:game_session_id>/
        body: {
            "timer": <timer> (Optional)
        }
    
    response
    --------------
    Response is something like this
    {
        "id": <id_of_session>
        "board": <Complete instance of board with each board detail>
        "timer": <timer>
        "is_active": <is_active> (tells if the session is ongoing or completed)
    }

    """
    permission_classes = [BoardSessionMemberPermissions]
    queryset = BoardSession.objects.all()
    serializer_class = BoardSessionSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['kwargs'] = self.kwargs
        return context

    def get_queryset(self):
        return self.queryset.filter(board_id=self.kwargs['bk'])
