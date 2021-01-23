from datetime import datetime
from django.db.models.aggregates import Count, Max, Min

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Kick


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
            return Response(status=400, exception=True)

        return Response(
            data=Kick.get_hourly_kick_count_for_date(parsed_date), status=200
        )


class FetalMovementChartView(APIView):
    def get(self, request, *args, **kwargs):
        qs = (
            Kick.objects.datetimes("kick_time", "day")
            .annotate(
                count=Count("pk"),
                start=Min("kick_time__hour"),
                stop=Max("kick_time__hour"),
            )
            .values("count", "start", "stop", "kick_time__date")
        )

        data_per_day = []
        for item in qs:
            data_per_day.append(
                {
                    "date": item["kick_time__date"],
                    "start": item["start"],
                    "stop": item["stop"],
                    "count": item["count"],
                }
            )
        return Response(data=data_per_day, status=200)


class KickDatesView(APIView):
    """
    Return all the dates the baby has been kicking
    """

    def get(self, request, *args, **kwargs):
        days = Kick.objects.dates("kick_time", "day")
        return Response(data=sorted(days, reverse=True), status=200)
