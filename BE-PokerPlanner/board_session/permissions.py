from rest_framework.permissions import IsAuthenticated


class BoardSessionMemberPermissions(IsAuthenticated):
    """
    A permission class to handle the permissions that only board members have access to that session.
    Inherits IsAuthenticated from rest_framework and adds object level permission.
    """
    def has_object_permission(self, request, view, obj):
        return obj.board.users.filter(id=request.user.id).exists()
