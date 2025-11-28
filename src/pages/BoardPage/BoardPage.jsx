import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { advanceTask } from "../../api/tasks";
import { STATUSES, getStatusLabel, canTransition } from "../../utils/status";
import { Layout } from "../../components/layout/Layout";
import { Column } from "../../components/board/Column";

import "./BoardPage.css";

export default function BoardPage() {
  const [loading, setLoading] = useState({});
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
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

  // Fetch current user for header
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get("/auth/me");
        if (cancelled) return;
        setUser(res.data.user);
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/");
        } else {
          console.error("Failed to load current user", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

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
    <Layout userName={user ? `Hello, ${user.email}` : ""} onLogout={handleLogout}>
      <div className="board">
        <div className="board__columns">
          {STATUSES.map((status) => (
            <Column
              key={status}
              title={getStatusLabel(status)}
              tasks={columns[status]} // pass tasks array for this status
              loadingById={loading} // full loading map
              onOpenDetails={(taskId) => navigate(`/tasks/${taskId}`)}
              onAdvance={handleAdvance}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
