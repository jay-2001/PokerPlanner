# Generated by Django 2.2 on 2023-02-17 17:51

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PokerBoard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('description', models.TextField()),
                ('voting_system', models.IntegerField(choices=[(0, 'Fibonacci'), (1, 'Odd'), (2, 'Even'), (3, 'Serial')])),
                ('estimation_choices', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveIntegerField(blank=True), size=None)),
            ],
        ),
        migrations.CreateModel(
            name='PokerRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.IntegerField(choices=[(0, 'Player'), (1, 'Spectator')])),
                ('poker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='poker_board.PokerBoard')),
            ],
        ),
    ]
