from typing import Dict

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .models import User


class SignInSerializer(serializers.Serializer):
    """
    This serializers allows user to enter username or email into a single field when logging in
    """

    email_or_username = serializers.CharField(
        label=_("Email or Username"), write_only=True
    )
    password = serializers.CharField(
        label=_("Password"),
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )
    token = serializers.CharField(label=_("Token"), read_only=True)

    # A flag that is used to indicate whether email_or_username is email or username
    is_email = False

    def validate_email_or_username(self, value):
        # No actual validation happens here. We just set self.is_email=True if given input is email
        try:
            validate_email(value)
        except ValidationError:
            pass
        else:
            self.is_email = True
        return value

    def validate(self, attrs):
        val = attrs.get("email_or_username")
        password = attrs.get("password")

        if self.is_email:
            user = authenticate(
                request=self.context.get("request"), email=val, password=password
            )
        else:
            user = authenticate(
                request=self.context.get("request"), username=val, password=password
            )

        if not user:
            raise serializers.ValidationError(
                _("Unable to log in with provided credentials.")
            )

        attrs["user"] = user
        return attrs


class SignUpSerializer(serializers.ModelSerializer):
    """
    A serializer that creates a user, with no privileges
    """

    password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = get_user_model()
        fields = (
            "username",
            "name",
            "email",
            "password",
            "confirm_password",
        )

    def validate(self, attrs):
        password = attrs.get("password")
        confirm_password = attrs.get("confirm_password")

        # Validate if password and confirm password is the same
        if password != confirm_password:
            raise serializers.ValidationError(
                _("The two password fields didn’t match."),
                code="password_mismatch",
            )

        # Validate if password is valid
        validate_password(password=password)

        return super().validate(attrs)

    def save(self):
        del self.validated_data["confirm_password"]
        data = dict(self.validated_data)

        UserModel = get_user_model()
        return UserModel.objects.create_user(**data)


class FindUserByEmailSerializer(serializers.Serializer):
    """
    This serializer will find user by email. If the user doesn't exist,
    raise validation error
    """

    user = None
    email_address = serializers.EmailField()

    def validate(self, attrs):
        UserModel = get_user_model()
        try:
            self.user = UserModel.objects.get(email=attrs["email_address"])
        except UserModel.DoesNotExist:
            raise serializers.ValidationError(
                _("User with given email does not exists")
            )
        return super().validate(attrs)


class ForgetPasswordResetSerializer(serializers.Serializer):
    """
    validate:
    1. encoded user ID
    2. reset password token
    3. password 1 and password 2 is valid
    """

    token = serializers.CharField()
    uid = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)

    user: User = None

    def validate_uid(self, uid: str) -> str:
        """
        Validate if uid is valid. If the UID is valid, set self.user = user
        """
        User = get_user_model()
        user_pk = urlsafe_base64_decode(uid).decode()

        try:
            self.user = User.objects.get(pk=user_pk)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("Invalid password reset token"))
        return uid

    def validate(self, attrs):
        # Validate if given token is valid
        if not default_token_generator.check_token(self.user, attrs["token"]):
            raise serializers.ValidationError(_("Invalid password reset token"))

        # Validate if password and confirm password is equal
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                _("The two password fields didn’t match."),
                code="password_mismatch",
            )
        return super().validate(attrs)


class ResetPasswordSerializer(serializers.Serializer):
    """
    1. Validate if old password is correct
    2. check if password and confirm password is equal
    """

    old_password = serializers.CharField()
    new_password = serializers.CharField()
    confirm_new_password = serializers.CharField()

    def validate_old_password(self, old_password: str) -> str:
        user: User = self.context["user"]

        if not user.check_password(old_password):
            raise serializers.ValidationError(
                _("Invalid password"),
                code="invalid_password",
            )

        return old_password

    def validate(self, attrs: Dict) -> Dict:
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError(
                _("The two password fields didn’t match."),
                code="password_mismatch",
            )
        return super().validate(attrs)
