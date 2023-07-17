from django.urls import path

from poker_board import consumers

websocket_urlpatterns = [
    path('session/<int:id>/', consumers.PokerBoardAsyncConsumer.as_asgi()),    
]
