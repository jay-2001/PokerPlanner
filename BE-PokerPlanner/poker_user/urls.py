from django.urls import re_path

from poker_user import views

app_name = 'poker_user'

urlpatterns = [
    re_path(r'^register/', views.RegistrationView.as_view(), name='register'),
    re_path(r'^login/', views.LoginView.as_view(), name='login'),
    re_path(r'verify/(?P<pk>[\w\.-]+)$', views.VerifyEmailView.as_view(), name='verify'),
    re_path(r'logout/(?P<pk>[\w\.-]+)$', views.LogoutView.as_view(), name='logout'),
    re_path(
        r'^$', views.LoggedInUserProfileApiView.as_view()
    ),
    re_path(
        r'^(?P<pk>\d+)/$', views.UpdateLoggedInUserProfileApiView.as_view()
    ),
]
