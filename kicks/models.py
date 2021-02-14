from django.db import models
from django.db.models import Count
from django.db.models.aggregates import Max, Min
from django.db.models.functions.datetime import Trunc
from django.utils import timezone

from .utils import get_start_hour


class KickManager(models.Manager):
    def get_today_kicks(self, *args, **kwargs):
        """
        return qs of all kicks that's after 9 a.m
        """
        return self.get_queryset().filter(kick_time__gte=get_start_hour())


class Kick(models.Model):
    kick_time = models.DateTimeField(auto_now=True)
    objects = KickManager()

    class Meta:
        ordering = ["-kick_time"]
        get_latest_by = "kick_time"

    def __str__(self) -> str:
        return timezone.localtime(
            value=self.kick_time, timezone=timezone.get_current_timezone()
        ).strftime("%d/%m/%Y %H:%M")

    @classmethod
    def get_daily_summary(cls):
        """
        return dailly summary of kicks
        The data returned:
            1. First kick time
            2. Last kick time
            3. Total kick for today
        """

        today_kicks_qs = cls.objects.get_today_kicks().aggregate(
            first=Min("kick_time"), last=Max("kick_time"), kicks=Count("pk")
        )

        if not today_kicks_qs["kicks"]:
            raise cls.DoesNotExist

        return {
            "kicks": today_kicks_qs["kicks"],
            "first": today_kicks_qs["first"],
            "last": today_kicks_qs["last"],
        }

    @classmethod
    def get_hourly_kick_count_for_date(cls, date_time):
        hourly_qs = list(
            cls.objects.filter(kick_time__date=date_time.date())
            .annotate(hours=Trunc("kick_time", "hour"))
            .values("hours")
            .order_by("kick_time")
        )

        kicks_per_hour = {}
        for item in hourly_qs:
            try:
                kicks_per_hour[item["hours"].strftime("%-I %p")] += 1
            except KeyError:
                kicks_per_hour[item["hours"].strftime("%-I %p")] = 1
        return kicks_per_hour

    @classmethod
    def get_fetal_movement_chart(cls):
        qs = (
            cls.objects.datetimes("kick_time", "day")
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
                    "date": item["kick_time__date"].strftime("%d %b"),
                    "start": item["start"],
                    "stop": item["stop"],
                    "count": item["count"],
                }
            )
        return data_per_day

    @classmethod
    def can_kick(cls):
        """
        Check if user is allowed to create kick. User allowed to create kick when:
        1. Time between last kick is more than a minute
        2. Kick for a day is less than 10
        3. It is currently 9a.m or later
        """
        kick_qs = cls.objects.get_today_kicks().aggregate(
            count=Count("pk"), last_kick=Max("kick_time")
        )

        # check if current time is 9a.m
        is_more_than_nine_am = timezone.now().astimezone().hour >= 9

        if is_more_than_nine_am and kick_qs["count"] == 0:
            return True

        delta = timezone.now() - kick_qs["last_kick"]
        if (
            is_more_than_nine_am
            and (kick_qs["count"] < 10)
            and (delta.total_seconds() > 59)
        ):
            return True

        return False
