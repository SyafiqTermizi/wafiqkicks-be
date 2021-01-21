from django.db import models
from django.db.models import Count
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
        today_kicks = cls.objects.get_today_kicks()

        if not today_kicks.exists():
            raise cls.DoesNotExist

        return {
            "kicks": today_kicks.count(),
            "first": today_kicks.earliest().kick_time,
            "last": today_kicks.latest().kick_time,
        }

    @classmethod
    def get_hourly_kick_count_for_date(cls, date_time):
        qs = list(
            cls.objects.filter(kick_time__date=date_time.date())
            .annotate(hours=Trunc("kick_time", "hour"))
            .values("hours")
            .annotate(kicks=Count("id"))
            .order_by("kick_time")
        )

        kicks_per_hour = {}
        for item in qs:
            try:
                kicks_per_hour[item["hours"].strftime("%-I %p")] += 1
            except KeyError:
                kicks_per_hour[item["hours"].strftime("%-I %p")] = 1
        return kicks_per_hour

    @classmethod
    def can_kick(cls):
        """
        Check if user is allowed to create kick. If kick is less than a minute
        ago, return False
        """
        try:
            last_kick_time = cls.objects.latest().kick_time
        except cls.DoesNotExist:
            return True
        else:
            delta = timezone.now() - last_kick_time
            today_kick_count = cls.objects.get_today_kicks().count()

            # only allow user to create kick once every minute
            if (today_kick_count < 10) and (delta.total_seconds() > 59):
                return True

        return False
