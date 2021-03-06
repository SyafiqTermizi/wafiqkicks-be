from datetime import datetime

from django.utils import timezone


def get_start_hour(hour: int = 9):
    """
    Return time to start count the kicks
    """
    today = datetime.now().astimezone(timezone.get_current_timezone())
    start_time = datetime(
        year=today.year, month=today.month, day=today.day, hour=hour
    ).astimezone(timezone.get_current_timezone())

    return start_time
