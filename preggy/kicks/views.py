from datetime import datetime
from io import BytesIO

from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import FileResponse
from django.template.loader import render_to_string
from django.views import View
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from weasyprint import HTML, CSS

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


class GenerateFetalMovementChartView(LoginRequiredMixin, View):
    """
    Generate PDF for Fetal Movement chart.
    """

    pdf_styling = """
    .container {
        font-size: 12px;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        border: 1px solid black;
    }
    th, td {
        border: 1px solid black; text-align: left; padding: 16px;
    }
    """

    def get(self, request, *args, **kwargs):
        fmc_data = Kick.get_fetal_movement_chart(user=request.user)

        html_string = render_to_string(
            template_name="kicks/fmc.html", context={"fmc_data": fmc_data}
        )
        pdf_byte = HTML(string=html_string, encoding="UTF-8").write_pdf(
            stylesheets=[CSS(string=self.pdf_styling)]
        )

        return FileResponse(
            BytesIO(pdf_byte),
            as_attachment=True,
            filename="fetal-movement-chart.pdf",
        )


class KickDatesView(AuthenticatedAPIView):
    """
    Return all the dates the baby has been kicking
    """

    def get(self, request, *args, **kwargs):
        days = Kick.objects.filter(owned_by=request.user).dates("kick_time", "day")
        return Response(data=sorted(days, reverse=True), status=200)
