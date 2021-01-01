from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Kick
from .utils import get_start_hour


class KickCountUpView(APIView):
    """
    An endpoint to create new kicks.Kick model. Every POST request to this view
    will create new row kicks.Kick
    """

    def post(self, request, *args, **kwargs):
        try:
            last_kick_time = Kick.objects.latest().kick_time
        except Kick.DoesNotExist:
            pass
        else:
            delta = timezone.now() - last_kick_time

            # only allow user to update data once every minute
            if delta.total_seconds() < 59:
                return Response(status=403)

        Kick.objects.create()
        return Response(status=201)


class DailyKickSummaryView(APIView):
    """
    This endpoint will return daily kick summary.
    The data returned:
        1. First kick time
        2. Last kick time
        3. Total kick for today
    """

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
        try:
            parsed_date = datetime.strptime(
                request.query_params.get("date", ""), "%Y-%m-%d"
            )
        except ValueError:
            hours = Kick.objects.filter(kick_time__gte=get_start_hour()).datetimes(
                "kick_time", "hour"
            )
        else:
            hours = Kick.objects.filter(
                kick_time__day=parsed_date.day,
                kick_time__month=parsed_date.month,
                kick_time__year=parsed_date.year,
            ).datetimes("kick_time", "hour")

        kicks_per_hour = {}
        for hour in hours:
            kicks_per_hour[hour.strftime("%-I %p")] = Kick.objects.filter(
                kick_time__gte=hour, kick_time__lte=(hour + timedelta(hours=1))
            ).count()

        return Response(data=kicks_per_hour, status=200)


class KickDatesView(APIView):
    """
    Return all the dates the baby has been kicking
    """

    def get(self, request, *args, **kwargs):
        days = Kick.objects.dates("kick_time", "day")

        return Response(data=days, status=200)
