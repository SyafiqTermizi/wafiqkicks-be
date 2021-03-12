from django.urls import path

from .views import (
    DailyChartView,
    DailyKickSummaryView,
    FetalMovementChartView,
    KickCountUpView,
    KickDatesView,
)

urlpatterns = (
    path("count-up/", KickCountUpView.as_view(), name="count_up"),
    path("daily-summary/", DailyKickSummaryView.as_view(), name="daily_summary"),
    path("daily-chart/", DailyChartView.as_view(), name="daily_chart"),
    path(
        "fetal-movement-chart/",
        FetalMovementChartView.as_view(),
        name="fetal-movement-chart",
    ),
    path("dates/", KickDatesView.as_view(), name="dates"),
)
