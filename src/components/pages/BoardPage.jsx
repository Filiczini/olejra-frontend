import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./BoardPage.css";
import { useNavigate } from "react-router-dom";
import AuthGate from "../auth/AuthGate";

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

  // Auth is handled by AuthGate; here we only fetch tasks
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/tasks");
        if (!cancelled) setTasks(res.data);
      } catch (err) {
        console.error("Failed to load board", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdvance = async (id) => {
    try {
      const res = await api.post(`/tasks/${id}/advance`);
      setTasks((prevArr) => prevArr.map((task) => (task.id === id ? res.data : task)));
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/");
      } else {
        console.error("Advance failed", err);
      }
    }
  };

  const columns = { BACKLOG: [], TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const task of tasks) columns[task.status]?.push(task);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
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
