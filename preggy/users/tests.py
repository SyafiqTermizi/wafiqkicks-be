from unittest.mock import patch
from django.test import TestCase
from rest_framework import serializers

from preggy.users.serializers import SignInSerializer, SignUpSerializer


class TestSignInSerializer(TestCase):
    def test_validate_email_valid(self):
        """
        SignInSerializer.validate_email_or_username should set SignInSerializer.is_email
        to True if a valid email is passed
        """
        serializer = SignInSerializer()
        serializer.validate_email_or_username("test@test.com")

        self.assertEquals(serializer.is_email, True)

    def test_validate_email_invalid(self):
        """
        SignInSerializer.validate_email_or_username should not set
        SignInSerializer.is_email to True if an invalid email is passed
        """
        serializer = SignInSerializer()
        serializer.validate_email_or_username("Invalid email. Duh.")

        self.assertEquals(serializer.is_email, False)


class TestSignUpSerializer(TestCase):
    def test_validate_method_mismatched_password(self):
        """
        SignUpSerializer.validate should raise validation error if password and
        confirm_password contains not equal value
        """
        serializer = SignUpSerializer()
        with self.assertRaises(serializers.ValidationError):
            serializer.validate(
                {
                    "password": "password",
                    "confirm_password": "asdfasdfsd",
                },
            )

    def test_validate_method_matched_password(self):
        """
        SignUpSerializer.validate should not raise validation error if password and
        confirm_password contains equal value
        """
        serializer = SignUpSerializer()
        assert serializer.validate(
            {
                "password": "password123321",
                "confirm_password": "password123321",
            },
        )
