# Generated by Django 3.1.7 on 2021-03-12 09:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kicks', '0003_auto_20210122_1934'),
    ]

    operations = [
        migrations.AddField(
            model_name='kick',
            name='owned_by',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='kicks', to='users.user'),
            preserve_default=False,
        ),
    ]
