from django.urls import path, include
from rest_framework.routers import SimpleRouter

from board_session.views import BoardSessionViewSet

router = SimpleRouter()
router.register('', BoardSessionViewSet)

urlpatterns = [
    path('boards/<int:bk>/session/', include(router.urls)),
]
