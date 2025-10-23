import { useEffect, useState } from "react";
import { api } from "../../api/axios";

const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];
const statusNames = { BACKLOG: "Backlog", TODO: "To-do", IN_PROGRESS: "In-progress", DONE: "Done" };

export default function BoardPage() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  const handleAdvance = async (id) => {
    const res = await api.post(`/tasks/${id}/advance`);
    setTasks((prevArr) => prevArr.map((task) => (task.id === id ? res.data : task)));
  };

  const columns = { BACKLOG: [], TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const task of tasks) columns[task.status]?.push(task);

  return (
    <div className="board-container">
      <h2>Дошка задач</h2>
      <div className="columns">
        {statuses.map((status) => (
          <div key={status} className="column">
            <h3>{statusNames[status]}</h3>
            {columns[status].map((task) => (
              <div key={task.id} className="task">
                {task.title}
                {task.status !== "DONE" && (
                  <button onClick={() => handleAdvance(task.id)} style={{ float: "right" }}>
                    →
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
