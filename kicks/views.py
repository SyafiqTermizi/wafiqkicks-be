from datetime import datetime
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Kick


class KickCountUpView(APIView):
    def post(self, request, *args, **kwargs):
        last_kick_time = Kick.objects.latest().kick_time
        current_time = timezone.now()
        delta = current_time - last_kick_time

        if delta.total_seconds() < 59:
            return Response(status=403)

        Kick.objects.create()
        return Response(status=201)


class DailyKickSummaryView(APIView):
    def get(self, request, *args, **kwargs):
        today = datetime.now().astimezone(timezone.get_current_timezone())
        nine_night = datetime(
            year=today.year, month=today.month, day=today.day, hour=21
        ).astimezone(timezone.get_current_timezone())
        nine_morning = datetime(
            year=today.year, month=today.month, day=today.day, hour=9
        ).astimezone(timezone.get_current_timezone())

        today_kicks = Kick.objects.filter(
            kick_time__gte=nine_morning, kick_time__lte=nine_night
        )

        today_kick_count = today_kicks.count()
        first_kick = today_kicks.earliest().kick_time
        latest_kick = today_kicks.latest().kick_time
        res = {"kicks": today_kick_count, "first": first_kick, "last": latest_kick}

        return Response(data=res, status=200)
