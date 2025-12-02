// olejra-frontend/src/pages/TaskDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTask, updateTask } from "../api/tasks";
import { STATUSES, getStatusLabel, getStatusPosition } from "../utils/status";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/layout/Container";
import "./TaskDetailsPage.css";

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
          status: res.data.status ?? STATUSES[0],
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
      status: task.status ?? STATUSES[0],
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
        status: task.status ?? STATUSES[0],
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

  const statusLabel = task ? getStatusLabel(task.status) : "";
  const statusIndex = task ? getStatusPosition(task.status) : -1;
  const statusPosition = statusIndex >= 0 ? `${statusIndex + 1} / ${STATUSES.length}` : "";

  return (
    <Layout>
      <Container>
        <div className="task-details">
          <div className="task-details__inner">
            <button type="button" onClick={handleBack} className="task-details__back">
              <span className="task-details__back-icon" aria-hidden="true">
                ←
              </span>
              <span>Back to board</span>
            </button>

            {loading && (
              <div className="task-details__state">
                <p className="task-details__state-text">Loading task…</p>
              </div>
            )}

            {!loading && error && !task && (
              <div className="task-details__state">
                <p className="task-details__state-text">{error || "Task not found."}</p>
              </div>
            )}

            {!loading && !task && !error && (
              <div className="task-details__state">
                <p className="task-details__state-text">Task not found.</p>
              </div>
            )}

            {!loading && task && (
              <>
                <header className="task-details__header">
                  <div className="task-details__title-wrap">
                    <p className="task-details__breadcrumb">Board · Task</p>
                    <h1 className="task-details__title">Task details</h1>
                  </div>

                  {!isEditing && (
                    <button type="button" className="task-details__edit-btn" onClick={handleEditClick}>
                      <span className="task-details__edit-icon" aria-hidden="true">
                        ✏️
                      </span>
                      <span>Edit</span>
                    </button>
                  )}
                </header>

                <div className="task-details__grid">
                  <section className="task-details__meta-card">
                    <div className="task-details__meta-group">
                      <span className="task-details__meta-label">ID</span>
                      <span className="task-details__meta-value task-details__meta-value--mono">{task.id}</span>
                    </div>

                    <div className="task-details__meta-group">
                      <span className="task-details__meta-label">Status</span>
                      <div className="task-details__status-row">
                        <span className="task-details__status-dot" aria-hidden="true" />
                        <span className="task-details__meta-value task-details__meta-value--mono">
                          {statusLabel} {statusPosition && <span className="task-details__status-position">({statusPosition})</span>}
                        </span>
                      </div>
                    </div>

                    <div className="task-details__meta-group">
                      <span className="task-details__meta-label">Created at</span>
                      <span className="task-details__meta-value task-details__meta-value--mono">{new Date(task.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="task-details__meta-group">
                      <span className="task-details__meta-label">Updated at</span>
                      <span className="task-details__meta-value task-details__meta-value--mono">{new Date(task.updatedAt).toLocaleString()}</span>
                    </div>
                  </section>

                  <section className="task-details__form-card">
                    <form className="task-details__form" onSubmit={handleSubmit}>
                      <div className="task-details__field">
                        <label htmlFor="title" className="task-details__label">
                          Title
                        </label>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          value={form.title}
                          onChange={handleChange}
                          maxLength={255}
                          required
                          disabled={!isEditing || saving}
                          className="task-details__input"
                          placeholder="Task title"
                        />
                      </div>

                      <div className="task-details__field">
                        <label htmlFor="description" className="task-details__label">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={6}
                          maxLength={2000}
                          placeholder="Describe the task..."
                          disabled={!isEditing || saving}
                          className="task-details__textarea"
                        />
                      </div>

                      <div className="task-details__field">
                        <label htmlFor="status" className="task-details__label">
                          Status
                        </label>
                        <select id="status" name="status" value={form.status} onChange={handleChange} disabled={!isEditing || saving} className="task-details__select">
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {error && <p className="task-details__error">{error}</p>}

                      <div className="task-details__actions">
                        {isEditing && (
                          <>
                            <button type="submit" className="task-details__primary-btn" disabled={saving}>
                              {saving ? "Saving…" : "Save changes"}
                            </button>
                            <button type="button" className="task-details__secondary-btn" onClick={handleCancelEdit} disabled={saving}>
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </form>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
