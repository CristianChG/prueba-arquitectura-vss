import os
from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text
from celery.result import AsyncResult
from dotenv import load_dotenv
from tasks import make_sum, long_dummy

load_dotenv()
app = Flask(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:admin@db:5432/vacas")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

@app.get("/api/ping")
def ping():
    return jsonify(ok=True, msg="pong")

@app.get("/api/dbtest")
def dbtest():
    with engine.begin() as conn:
        conn.execute(text("CREATE TABLE IF NOT EXISTS test(id SERIAL PRIMARY KEY, note TEXT)"))
        conn.execute(text("INSERT INTO test(note) VALUES ('hello db')"))
        count = conn.execute(text("SELECT COUNT(*) FROM test")).scalar()
    return jsonify(ok=True, rows=count)

@app.post("/api/task/sum")
def task_sum():
    data = request.get_json(force=True)
    a, b = data.get("a", 1), data.get("b", 2)
    task = make_sum.delay(a, b)
    return jsonify(task_id=task.id)

@app.get("/api/task/<task_id>")
def get_status(task_id):
    res = AsyncResult(task_id)
    return jsonify(state=res.state, result=res.result if res.ready() else None)
