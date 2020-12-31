from django.urls import path

from .views import KickCountUpView

urlpatterns = (path("count-up/", KickCountUpView.as_view(), name="count_up"),)
