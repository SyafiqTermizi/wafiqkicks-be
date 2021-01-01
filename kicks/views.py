from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Kick
from .utils import get_start_hour


class KickCountUpView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            last_kick_time = Kick.objects.latest().kick_time
        except Kick.DoesNotExist:
            pass
        else:
            delta = timezone.now() - last_kick_time
            if delta.total_seconds() < 59:
                return Response(status=403)

        Kick.objects.create()
        return Response(status=201)


class DailyKickSummaryView(APIView):
    def get(self, request, *args, **kwargs):
        today_kicks = Kick.objects.filter(kick_time__gte=get_start_hour())

        today_kick_count = today_kicks.count()

        if not today_kick_count:
            raise NotFound

        first_kick = today_kicks.earliest().kick_time
        latest_kick = today_kicks.latest().kick_time
        res = {"kicks": today_kick_count, "first": first_kick, "last": latest_kick}

        return Response(data=res, status=200)


class DailyChartView(APIView):
    def get(self, request, *args, **kwargs):

        hours = Kick.objects.filter(kick_time__gte=get_start_hour()).datetimes(
            "kick_time", "hour"
        )

        kicks_per_hour = {}
        for hour in hours:

            kicks_per_hour[hour.strftime("%-I %p")] = Kick.objects.filter(
                kick_time__gte=hour, kick_time__lte=(hour + timedelta(hours=1))
            ).count()

        return Response(data=kicks_per_hour, status=200)
