import os
from dotenv import load_dotenv
load_dotenv()

broker_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
result_backend = os.getenv("REDIS_URL", "redis://redis:6379/0")
task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]
timezone = "UTC"
enable_utc = True
