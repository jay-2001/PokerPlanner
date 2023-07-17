from django.urls import include, re_path
from rest_framework.routers import SimpleRouter

from poker_group.views import GroupAPIViewSet, LoggedInUserGroupsApiView

router = SimpleRouter()
router.register('', GroupAPIViewSet, basename='groupapi')

urlpatterns = [
    re_path(r'^list/', LoggedInUserGroupsApiView.as_view(), name='grouplist'),
    re_path(r'^', include(router.urls))
]
