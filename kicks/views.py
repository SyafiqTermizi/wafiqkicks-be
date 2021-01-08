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
        if Kick.can_kick():
            Kick.objects.create()
            return Response(status=201)
        return Response(status=403)


class DailyKickSummaryView(APIView):
    """
    This endpoint will return daily kick summary.
    """

    def get(self, request, *args, **kwargs):
        try:
            data = Kick.get_daily_summary()
        except Kick.DoesNotExist:
            raise NotFound
        return Response(data=data, status=200)


class DailyChartView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            parsed_date = datetime.strptime(
                request.query_params.get("date", ""), "%Y-%m-%d"
            )
        except ValueError:
            hours = Kick.objects.get_today_kicks_by_hour()
        else:
            hours = Kick.objects.get_kicks_by_hour_for_date(parsed_date)

        kicks_per_hour = {}
        for hour in hours:
            kicks_per_hour[
                hour.strftime("%-I %p")
            ] = Kick.objects.get_kick_count_for_hour(hour)

        return Response(data=kicks_per_hour, status=200)


class KickDatesView(APIView):
    """
    Return all the dates the baby has been kicking
    """

    def get(self, request, *args, **kwargs):
        days = Kick.objects.dates("kick_time", "day")

        return Response(data=days, status=200)
