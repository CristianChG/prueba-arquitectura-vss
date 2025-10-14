from celery import Celery
from celery_config import broker_url, result_backend
import time

celery = Celery("tasks", broker=broker_url, backend=result_backend)

@celery.task
def make_sum(a, b):
    return a + b

@celery.task
def long_dummy():
    time.sleep(10)
    return {"done": True, "message": "simulated training finished"}
