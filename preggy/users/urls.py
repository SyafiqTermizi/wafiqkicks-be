from django.urls import path

from .views import GetAuthTokenView

urlpatterns = (path("api-login/", GetAuthTokenView.as_view(), name="api_login"),)
