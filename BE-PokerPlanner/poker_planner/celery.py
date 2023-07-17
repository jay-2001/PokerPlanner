import os

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'poker_planner.settings')

app = Celery('poker_planner')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
