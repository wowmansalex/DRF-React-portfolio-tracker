# Generated by Django 4.0.7 on 2022-09-13 15:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('crypto_api', '0006_alter_portfolio_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='portfolio',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]