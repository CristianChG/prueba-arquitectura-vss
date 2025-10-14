import { useState } from "react";

function App() {
  const [ping, setPing] = useState("");
  const [task, setTask] = useState<any>(null);

  const handlePing = async () => {
    const r = await fetch("/api/ping");
    setPing(JSON.stringify(await r.json()));
  };

  const handleTask = async () => {
    const r = await fetch("/api/task/sum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: 3, b: 7 }),
    });
    setTask(await r.json());
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Prueba Arquitectura</h1>
      <button onClick={handlePing}>Ping API</button>
      <pre>{ping}</pre>
      <button onClick={handleTask}>Lanzar tarea Celery</button>
      <pre>{JSON.stringify(task, null, 2)}</pre>
    </div>
  );
}

export default App;
