# Generated by Django 2.2 on 2023-02-20 18:43

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('poker_group', '0003_auto_20230220_1141'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pokergroupmember',
            name='joined_at',
        ),
        migrations.AddField(
            model_name='pokergroup',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pokergroup',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='pokergroupboard',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pokergroupboard',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='pokergroupmember',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pokergroupmember',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
