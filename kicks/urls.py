from django.urls import path

from .views import DailyKickSummaryView, KickCountUpView, DailyChartView

urlpatterns = (
    path("count-up/", KickCountUpView.as_view(), name="count_up"),
    path("daily-summary/", DailyKickSummaryView.as_view(), name="daily_summary"),
    path("daily-chart/", DailyChartView.as_view(), name="daily_chart"),
)
