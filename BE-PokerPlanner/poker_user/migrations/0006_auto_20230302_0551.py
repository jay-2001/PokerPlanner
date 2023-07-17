# Generated by Django 2.2 on 2023-03-02 05:51

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poker_user', '0005_auto_20230221_0941'),
    ]

    operations = [
        migrations.AddField(
            model_name='pokeruser',
            name='jira_api_token',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='pokeruser',
            name='jira_domain',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='address_line_1',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='address_line_2',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='city',
            field=models.CharField(blank=True, max_length=90, null=True),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='email',
            field=models.EmailField(max_length=255, unique=True, validators=[django.core.validators.MinLengthValidator(6)], verbose_name='email address'),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='first_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='last_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='pokeruser',
            name='state',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]