// olejra-frontend/src/components/pages/BoardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import "./BoardPage.css";
import { STATUSES, getStatusLabel, canTransition } from "../../utils/status";
import { advanceTask } from "../../api/tasks";

export default function BoardPage() {
  const [loading, setLoading] = useState({});
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Fetch tasks for board
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get("/tasks");
        if (cancelled) return;
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load board", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdvance(task) {
    const from = task.status;
    const currentIndex = STATUSES.indexOf(from);
    const to = STATUSES[currentIndex + 1];

    // Only allow moving to the next status
    if (!to || !canTransition(from, to)) {
      console.warn("Invalid local transition", { from, to });
      return;
    }

    // Skip if already loading this task
    if (loading[task.id]) return;

    setLoading((prev) => ({ ...prev, [task.id]: true }));

    try {
      const res = await advanceTask(task.id, from, to);
      setTasks((prevArr) => prevArr.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/");
      } else if (err?.response?.status === 400) {
        console.error("Advance rejected by backend", err);
        // Тут потім можна додати refetch борди
      } else {
        console.error("Advance failed", err);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [task.id]: false }));
    }
  }

  const columns = { BACKLOG: [], TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const task of tasks) {
    if (columns[task.status]) {
      columns[task.status].push(task);
    }
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <div className="board">
      <div className="board__header">
        <h1 className="board__title">Olejra - choose the future !</h1>
        <button className="logout-btn" onClick={handleLogout} aria-label="Вийти з акаунту" title="Вийти">
          Exit
        </button>
      </div>

      <div className="board__columns">
        {STATUSES.map((status) => (
          <div key={status} className={`column ${columns[status].length ? "column--active" : ""}`}>
            <h3 className="column__title">{getStatusLabel(status)}</h3>

            {columns[status].map((task) => (
              <div key={task.id} className="task">
                <span className="task__title" onClick={() => navigate(`/tasks/${task.id}`)} tabIndex={0}>
                  {task.title}
                </span>
                {task.status !== "DONE" && (
                  <button onClick={() => handleAdvance(task)} disabled={loading[task.id]} className="task__button" title="Move to next column">
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
