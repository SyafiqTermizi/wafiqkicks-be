import pytz
from django.db import models
from django.utils import timezone


def convert_to_localtime(utc_time):
    fmt = '%d/%m/%Y %H:%M'
    utc = utc_time.replace(tzinfo=pytz.UTC)
    localtz = utc.astimezone(timezone.get_current_timezone())
    return localtz.strftime(fmt)


class Kick(models.Model):
    kick_time = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-kick_time"]

    def __str__(self) -> str:
        return convert_to_localtime(self.kick_time)
