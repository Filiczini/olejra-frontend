// olejra-frontend/src/components/pages/BoardPage.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./BoardPage.css";
import { useNavigate } from "react-router-dom";
import { STATUS_FLOW, canTransition } from "../../utils/status";
import { advanceTask } from "../../api/tasks";

const statusNames = {
  BACKLOG: "Backlog",
  TODO: "To-do",
  IN_PROGRESS: "In-progress",
  DONE: "Done",
};

export default function BoardPage() {
  const [loading, setLoading] = useState({});
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const statuses = STATUS_FLOW;

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

  async function handleAdvance(task) {
    const from = task.status;
    const currentIndex = STATUS_FLOW.indexOf(from);
    const to = STATUS_FLOW[currentIndex + 1];

    // Local guard: only allow moving to the next status
    if (to == null || !canTransition(from, to)) {
      console.warn("Invalid local transition", { from, to });
      return;
    }

    // Prevent duplicate requests for the same task
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
        // Optional: refetch board state
      } else {
        console.error("Advance failed", err);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [task.id]: false }));
    }
  }

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
        <h1 className="board__title">Olejra - choose the future !</h1>
        <button className="logout-btn" onClick={handleLogout} aria-label="Вийти з акаунту" title="Вийти">
          Exit
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
