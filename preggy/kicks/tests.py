from django.test import SimpleTestCase
from django.test.testcases import SimpleTestCase
from rest_framework import serializers

from preggy.kicks.serializers import FromToDateSerializer


class TestFromToDateSerializer(SimpleTestCase):
    def test_to_date_required(self):
        """
        FromToDateSerializer should raise ValidationError if to_date is
        not provided
        """
        serializer = FromToDateSerializer(
            data={
                "from_date": "01-01-2021",
            }
        )
        with self.assertRaises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_from_date_required(self):
        """
        FromToDateSerializer should raise ValidationError if from_date is
        not provided
        """
        serializer = FromToDateSerializer(
            data={
                "to_date": "01-01-2021",
            }
        )
        with self.assertRaises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)
