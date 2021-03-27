from datetime import datetime
from rest_framework import serializers


class FromToDateSerializer(serializers.Serializer):
    from_date = serializers.DateField()
    to_date = serializers.DateField()
