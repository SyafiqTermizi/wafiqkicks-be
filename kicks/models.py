from django.db import models
from django.utils import timezone


class Kick(models.Model):
    kick_time = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-kick_time"]
        get_latest_by = "kick_time"

    def __str__(self) -> str:
        return timezone.localtime(
            value=self.kick_time, timezone=timezone.get_current_timezone()
        ).strftime("%d/%m/%Y %H:%M")
