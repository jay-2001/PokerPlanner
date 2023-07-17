"""
ASGI config for poker_planner project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
import django

from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from poker_board.token_authentication_stack import TokenAuthMiddlewareStack

from poker_board import routing as poker_board_routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'poker_planner.settings')
django.setup()

application = ProtocolTypeRouter({
    'http': AsgiHandler(),
    'websocket': TokenAuthMiddlewareStack(
        URLRouter(
            poker_board_routing.websocket_urlpatterns
        ) 
    )
})
