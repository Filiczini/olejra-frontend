import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./BoardPage.css";

const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];

// Human-friendly labels
const statusNames = {
  BACKLOG: "Backlog",
  TODO: "To-do",
  IN_PROGRESS: "In-progress",
  DONE: "Done",
};

export default function BoardPage() {
  const [tasks, setTasks] = useState([]);

  // On mount: fetch tasks from the API
  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  const handleAdvance = async (id) => {
    const res = await api.post(`/tasks/${id}/advance`); // Server returns the updated task (with new status)
    setTasks((prevArr) => prevArr.map((task) => (task.id === id ? res.data : task)));
  };

  const columns = { BACKLOG: [], TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const task of tasks) columns[task.status]?.push(task);

  return (
    <div className="board">
      <h2 className="board__title">Дошка задач</h2>

      <div className="board__columns">
        {statuses.map((status) => (
          <div key={status} className={`column ${columns[status].length ? "column--active" : ""}`}>
            <h3 className="column__title">{statusNames[status]}</h3>

            {columns[status].map((task) => (
              <div key={task.id} className="task">
                <span className="task__title">{task.title}</span>
                {task.status !== "DONE" && (
                  <button onClick={() => handleAdvance(task.id)} className="task__button" title="Move to next column">
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
