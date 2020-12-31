from django.db import models


class Kick(models.Model):
    kick_time = models.DateTimeField(auto_now=True)
