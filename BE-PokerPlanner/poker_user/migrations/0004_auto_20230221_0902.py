# Generated by Django 2.2 on 2023-02-21 09:02

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('poker_user', '0003_auto_20230220_1843'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pokeruser',
            name='gender',
            field=models.IntegerField(choices=[(0, 'Male'), (1, 'Female'), (2, 'Dont want to disclose')], default=2),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='phone_number',
            field=phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None, unique=True),
        ),
    ]
