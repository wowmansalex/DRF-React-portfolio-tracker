# Generated by Django 4.0.7 on 2022-09-12 07:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crypto_api', '0002_alter_transaction_coin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log_data',
            name='portfolio_linked',
            field=models.CharField(max_length=255),
        ),
    ]
