from datetime import datetime

from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import Kick


class AuthenticatedAPIView(APIView):
    permission_classes = [IsAuthenticated]


class KickCountUpView(AuthenticatedAPIView):
    """
    An endpoint to create new kicks.Kick model. Every POST request to this view
    will create new row kicks.Kick
    """

    def post(self, request, *args, **kwargs):
        if Kick.can_kick(user=request.user):
            Kick.objects.create(owned_by=request.user)
            return Response(status=201)
        return Response(status=403)


class DailyKickSummaryView(AuthenticatedAPIView):
    """
    This endpoint will return daily kick summary.
    """

    def get(self, request, *args, **kwargs):
        try:
            data = Kick.get_daily_summary(user=request.user)
        except Kick.DoesNotExist:
            raise NotFound
        return Response(data=data, status=201)


class DailyChartView(AuthenticatedAPIView):
    def get(self, request, *args, **kwargs):
        try:
            parsed_date = datetime.strptime(
                request.query_params.get("date", ""), "%Y-%m-%d"
            )
        except ValueError:
            return Response(status=400, exception=True)

        return Response(
            data=Kick.get_hourly_kick_count_for_date(
                user=request.user,
                date_time=parsed_date,
            ),
            status=200,
        )


class FetalMovementChartView(AuthenticatedAPIView):
    def get(self, request, *args, **kwargs):
        fmc_data = Kick.get_fetal_movement_chart(user=request.user)
        return Response(data=fmc_data, status=200)


class KickDatesView(AuthenticatedAPIView):
    """
    Return all the dates the baby has been kicking
    """

    def get(self, request, *args, **kwargs):
        days = Kick.objects.filter(owned_by=request.user).dates("kick_time", "day")
        return Response(data=sorted(days, reverse=True), status=200)
