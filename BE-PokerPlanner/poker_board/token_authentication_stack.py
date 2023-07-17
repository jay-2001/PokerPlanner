from urllib.parse import parse_qs

from channels.auth import AuthMiddleware
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_multitoken.models import MultiToken


@database_sync_to_async
def get_user(scope):
    """
    This function retrieves the user from the database based on a token in the query string 
    of the WebSocket scope. If no token is present or the token is invalid or the corresponding 
    user is inactive, the function returns an instance of the AnonymousUser class, which is a 
    built-in user model in Django Channels.

    Arguments:
    - scope: A dictionary containing the scope of the WebSocket connection.

    Returns:
    - An instance of the User model representing the authenticated user, or an instance of the 
    AnonymousUser model representing an anonymous user.

    This function is decorated with @database_sync_to_async to allow for database queries 
    to be executed asynchronously in a Django Channels application.
    """
    query_string = parse_qs(scope['query_string'].decode())
    token = query_string.get('token')
    if not token:
        return AnonymousUser()
    try:
        user = MultiToken.objects.get(key=token[0]).user

    except Exception as exception:
        return AnonymousUser()
    if not user.is_active:
        return AnonymousUser()
    return user


class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)


def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))
