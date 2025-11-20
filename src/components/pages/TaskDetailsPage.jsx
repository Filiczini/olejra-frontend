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
  // Form state is used only in edit mode
  const [form, setForm] = useState({ title: "", description: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // controls edit mode

  // Load task details
  useEffect(() => {
    let cancelled = false;

    async function fetchTask() {
      try {
        setLoading(true);
        const res = await getTask(id);
        if (cancelled) return;

        setTask(res.data);
        // Prepare form state based on loaded task
        setForm({
          title: res.data.title ?? "",
          description: res.data.description ?? "",
          status: res.data.status ?? STATUS_FLOW[0],
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

  function handleBack() {
    navigate("/board");
  }

  function handleEditClick() {
    if (!task) return;
    // Sync form with current task state before editing
    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? STATUS_FLOW[0],
    });
    setError(null);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    // Reset form back to current task values and switch to read-only view
    if (task) {
      setForm({
        title: task.title ?? "",
        description: task.description ?? "",
        status: task.status ?? STATUS_FLOW[0],
      });
    }
    setError(null);
    setIsEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!task) return;

    const noChanges = form.title === task.title && (form.description ?? "") === (task.description ?? "") && (form.status ?? "") === (task.status ?? "");

    // If nothing changed we simply exit edit mode without sending a request
    if (noChanges) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      const res = await updateTask(task.id, {
        // Backend should support updating status together with title/description
        title: form.title,
        description: form.description,
        status: form.status,
      });
      // Update local task with server response and go back to read-only view
      setTask(res.data);
      setError(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="task-details">
        <button type="button" onClick={handleBack} className="task-details__back-btn">
          ← Back to board
        </button>
        <p>Loading task…</p>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="task-details">
        <button type="button" onClick={handleBack} className="task-details__back-btn">
          ← Back to board
        </button>
        <p>{error || "Task not found."}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details">
        <button type="button" onClick={handleBack} className="task-details__back-btn">
          ← Back to board
        </button>
        <p>Task not found.</p>
      </div>
    );
  }

  const statusLabel = statusNames[task.status] ?? task.status;
  const statusIndex = STATUS_FLOW.indexOf(task.status);
  const statusPosition = statusIndex >= 0 ? `${statusIndex + 1} / ${STATUS_FLOW.length}` : "";

  return (
    <div className="task-details">
      <button type="button" onClick={handleBack} className="task-details__back-btn">
        ← Back to board
      </button>

      <div className="task-details__header">
        <h1>Task details</h1>
        {!isEditing && (
          <button type="button" className="task-details__edit-btn" onClick={handleEditClick}>
            <span className="task-details__edit-icon" aria-hidden="true">
              ✏️
            </span>
            <span>Edit</span>
          </button>
        )}
      </div>

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

        <div className="task-details__main">
          {!isEditing ? (
            <>
              <h2 className="task-details__title">{task.title}</h2>
              <div className="task-details__description">{task.description ? <p>{task.description}</p> : <p className="task-details__placeholder">No description yet.</p>}</div>
            </>
          ) : (
            <form className="task-details__form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" value={form.title} onChange={handleChange} maxLength={255} required />
              </div>

              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} maxLength={2000} placeholder="Describe the task..." />
              </div>

              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={form.status} onChange={handleChange}>
                  {STATUS_FLOW.map((status) => (
                    <option key={status} value={status}>
                      {statusNames[status] ?? status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-details__actions">
                <button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button type="button" className="task-details__cancel-btn" onClick={handleCancelEdit} disabled={saving}>
                  Cancel
                </button>
              </div>

              {error && <p className="task-details__error">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
