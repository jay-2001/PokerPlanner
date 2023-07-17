"""poker_planner URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, re_path

api_urls = [
    re_path(r'^', include('board_session.urls')),
    re_path(r'^boards/', include('poker_board.urls')),
    re_path(r'^groups/', include('poker_group.urls')),
    re_path(r'^tickets/', include('poker_ticket.urls')),
    re_path(r'^user/', include('poker_user.urls')),
    re_path(r'^',include('poker_ticket.urls')),
]

urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^', include(api_urls)),
]
