from django.urls import path

from .views import (
    SignInView,
    SignUpView,
    ForgetPasswordFindByEmailView,
    ForgetPasswordResetView,
)

urlpatterns = (
    path("signin/", SignInView.as_view(), name="signin"),
    path("signup/", SignUpView.as_view(), name="signup"),
    path(
        "forget-password/",
        ForgetPasswordFindByEmailView.as_view(),
        name="forget_password",
    ),
    path(
        "forget-password/confirm/",
        ForgetPasswordResetView.as_view(),
        name="forget_password_confirm",
    ),
)
