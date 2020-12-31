from django.db import models


class Kick(models.Model):
    kick_time = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-kick_time"]

    def __str__(self) -> str:
        return self.kick_time
