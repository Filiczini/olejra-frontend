// olejra-frontend/src/components/pages/TaskDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTask, updateTask } from "../../api/tasks";
import { STATUS_FLOW } from "../../utils/status";
import "./TaskDetailsPage.css";

// Human-readable labels for statuses; should match BoardPage.
const statusNames = {
  BACKLOG: "Backlog",
  TODO: "To-do",
  IN_PROGRESS: "In-progress",
  DONE: "Done",
};

export default function TaskDetailsPage() {
  const { id } = useParams(); // /tasks/:id
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load task details
  useEffect(() => {
    let cancelled = false;

    async function fetchTask() {
      try {
        setLoading(true);
        const res = await getTask(id);
        if (cancelled) return;

        setTask(res.data);
        setForm({
          title: res.data.title ?? "",
          description: res.data.description ?? "",
        });
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load task details", err);
        setError("Failed to load task.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTask();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!task) return;

    // Nothing changed → skip request
    if (form.title === task.title && (form.description ?? "") === (task.description ?? "")) {
      return;
    }

    try {
      setSaving(true);
      const res = await updateTask(task.id, {
        title: form.title,
        description: form.description,
      });
      setTask(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to update task", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    navigate("/board");
  }

  if (loading) {
    return (
      <div className="task-details">
        <button type="button" onClick={handleBack}>
          ← Back to board
        </button>
        <p>Loading task…</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-details">
        <button type="button" onClick={handleBack}>
          ← Back to board
        </button>
        <p>{error || "Task not found."}</p>
      </div>
    );
  }

  const statusLabel = statusNames[task.status] ?? task.status;
  const statusIndex = STATUS_FLOW.indexOf(task.status);
  const statusPosition = statusIndex >= 0 ? `${statusIndex + 1} / ${STATUS_FLOW.length}` : "";

  return (
    <div className="task-details">
      <button type="button" onClick={handleBack}>
        ← Back to board
      </button>

      <h1>Task details</h1>
      <div className="task-details__content">
        <div className="task-details__meta">
          <p>
            <strong>ID:</strong> {task.id}
          </p>
          <p>
            <strong>Status:</strong> {statusLabel} {statusPosition && <span>({statusPosition})</span>}
          </p>
          <p>
            <strong>Created at:</strong> {new Date(task.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated at:</strong> {new Date(task.updatedAt).toLocaleString()}
          </p>
        </div>

        <form className="task-details__form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} maxLength={255} required />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} maxLength={2000} placeholder="Describe the task..." />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

        {error && <p className="task-details__error">{error}</p>}
      </div>
    </div>
  );
}
