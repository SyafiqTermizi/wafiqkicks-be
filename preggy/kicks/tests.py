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
                "from_date": "2021-01-01",
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
                "to_date": "2021-01-01",
            }
        )
        with self.assertRaises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_serializer_valid(self):
        """
        FromToDateSerializer should not raise ValidationError if from_date and
        to_date is provided
        """
        serializer = FromToDateSerializer(
            data={
                "to_date": "2021-01-31",
                "from_date": "2021-01-31",
            }
        )
        self.assertEquals(serializer.is_valid(raise_exception=True), True)

    def test_serializer_invalid_format(self):
        """
        FromToDateSerializer should raise ValidationError if from_date and
        to_date is not in 'YYYY-MM-DD' format
        """
        serializer = FromToDateSerializer(
            data={
                "to_date": "31-01-2021",
                "from_date": "31-01-2021",
            }
        )
        with self.assertRaises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)
