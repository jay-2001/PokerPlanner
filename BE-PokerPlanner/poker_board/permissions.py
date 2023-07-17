from rest_framework.permissions import IsAuthenticated


class BoardPermissions(IsAuthenticated):
    """
    A permission class to handle the permissions to perform crud on poker_board.
    Inherits IsAuthenticated from rest_framework and adds object level permission.
    """
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        return obj.manager.id == request.user.id
