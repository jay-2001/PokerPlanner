from rest_framework.permissions import IsAuthenticated


class GroupPermissions(IsAuthenticated):
    """
    A permission class to handle the permissions to perform crud on poker_group.
    Inherits IsAuthenticated from rest_framework and adds object level permission.
    """
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        return obj.admin.id == request.user.id
