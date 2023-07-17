# Generated by Django 2.2 on 2023-02-21 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poker_ticket', '0006_auto_20230220_1843'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='final_estimation',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='is_estimated',
            field=models.BooleanField(default=False),
        ),
    ]
