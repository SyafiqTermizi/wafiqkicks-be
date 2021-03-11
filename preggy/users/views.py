from django import template
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.serializers import ValidationError

from .models import User
from .serializers import SignInSerializer, SignUpSerializer, FindUserByEmailSerializer


class SignInView(APIView):
    serializer_class = SignInSerializer

    def get_serializer_context(self):
        return {"request": self.request, "format": self.format_kwarg, "view": self}

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        return self.serializer_class(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})


class SignUpView(APIView):
    serializer_class = SignUpSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: we'll add "confirm via email" feature if we receive spam
        serializer.save()
        return Response(serializer.data)


class ForgetPasswordFindByEmailView(APIView):
    """
    This endpoint accepts email_address. Then it sends an email to the user if the email is valid.

    Accepts:
        email_address: String
    Returns
        status 200
    """

    serializer_class = FindUserByEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError:
            # Return status 200, even if the email doesn't exist
            return Response(status=200)

        template_string = render_to_string(
            "email/password_reset_email.html",
            context=self.get_email_context(serializer.user),
        )

        serializer.user.email_user(_("Reset password"), template_string)
        return Response(status=200)

    def get_email_context(self, user: User):
        token = default_token_generator.make_token(user)
        encoded_user_id = urlsafe_base64_encode(force_bytes(user.pk))
        return {"token": token, "uid": encoded_user_id}
