from datetime import timedelta

from django.db import models
from django.utils import timezone

from .utils import get_start_hour


class KickManager(models.Manager):
    def get_kick_count_for_hour(self, hour, *args, **kwargs):
        return (
            self.get_queryset()
            .filter(kick_time__gte=hour, kick_time__lte=(hour + timedelta(hours=1)))
            .count()
        )

    def get_today_kicks(self, *args, **kwargs):
        """
        return qs of all kicks that's after 9 a.m
        """
        return self.get_queryset().filter(kick_time__gte=get_start_hour())

    def get_today_kick_count(self, *args, **kwargs):
        """
        return count of kick that's after 9 a.m
        """
        return self.get_today_kicks().count()

    def get_kicks_by_hour_for_date(self, datetime, *args, **kwargs):
        """
        return hours of the baby is kicking for a date
        """
        return (
            self.get_queryset()
            .filter(
                kick_time__day=datetime.day,
                kick_time__month=datetime.month,
                kick_time__year=datetime.year,
            )
            .datetimes("kick_time", "hour")
        )


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
        today_kicks = Kick.objects.get_today_kicks()
        today_kick_count = today_kicks.count()

        if not today_kicks.exists():
            raise cls.DoesNotExist

        first_kick = today_kicks.earliest().kick_time
        latest_kick = today_kicks.latest().kick_time

        return {"kicks": today_kick_count, "first": first_kick, "last": latest_kick}

    @classmethod
    def can_kick(cls):
        """
        Check if user is allowed to create kick. If kick is less than a minute
        ago, return False
        """
        try:
            last_kick_time = Kick.objects.latest().kick_time
        except Kick.DoesNotExist:
            return True
        else:
            delta = timezone.now() - last_kick_time

            # only allow user to update data once every minute
            if delta.total_seconds() > 59:
                return True

        return False
