import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./BoardPage.css";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      const csrf = sessionStorage.getItem("csrfToken");
      await api.post(
        "/auth/logout",
        {},
        {
          headers: { "x-csrf-token": csrf },
        }
      );
      sessionStorage.removeItem("csrfToken");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="board">
      <div className="board__header">
        <h1 className="board__title">Моя дошка задач</h1>
        <button className="logout-btn" onClick={handleLogout} aria-label="Вийти з акаунту" title="Вийти">
          Вийти
        </button>
      </div>

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
