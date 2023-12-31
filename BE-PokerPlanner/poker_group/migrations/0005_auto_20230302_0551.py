# Generated by Django 2.2 on 2023-03-02 05:51

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poker_group', '0004_auto_20230220_1843'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pokergroup',
            name='description',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pokergroup',
            name='name',
            field=models.CharField(max_length=20, unique=True, validators=[django.core.validators.MinLengthValidator(3)]),
        ),
    ]
