from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers


class AuthTokenSerializer(serializers.Serializer):
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


class UserCreationSerializer(serializers.ModelSerializer):
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

        if password != confirm_password:
            raise serializers.ValidationError(
                _("The two password fields didn’t match."),
                code="password_mismatch",
            )
        return super().validate(attrs)

    def save(self):
        del self.validated_data["confirm_password"]
        data = dict(self.validated_data)

        UserModel = get_user_model()
        return UserModel.objects.create_user(**data)
