from typing import Any, Optional

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import AbstractBaseUser
from django.http import HttpRequest


class EmailBackend(BaseBackend):
    """
    Allow user to authenticate using email and password
    """

    def authenticate(
        self,
        request: HttpRequest,
        email: Optional[str],
        password: Optional[str],
        **kwargs: Any
    ) -> Optional[AbstractBaseUser]:
        if email and password:
            try:
                UserModel = get_user_model()
                user = UserModel.objects.get(email=email)
            except UserModel.DoesNotExist:
                # Run the default password hasher once to reduce the timing
                # difference between an existing and a nonexistent user (#20760).
                UserModel().set_password(password)
            else:
                if user.check_password(password) and user.is_active:
                    return user
