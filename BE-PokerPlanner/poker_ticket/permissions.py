from rest_framework.permissions import IsAuthenticated


class TicketPermissions(IsAuthenticated):
    """
    A permission class to handle the permissions to perform crud on ticket.
    Aim: Only manager can edit ticket details like summary, description.
    Inherits IsAuthenticated from rest_framework and adds object level permission.
    """
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        return obj.pokerboard.manager.id == request.user.id
