import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTask, updateTask } from "../api/tasks";
import { api } from "../api/axios";
import { STATUSES, getStatusLabel } from "../utils/status";
import { Layout } from "../components/layout/Layout";
import { Container } from "../components/layout/Container";
import { ArrowLeft, Pencil, Save, X, Clock, Calendar, Hash } from "lucide-react";
import "./TaskDetailsPage.css";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null); // Стан для користувача
  const [form, setForm] = useState({ title: "", description: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

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
    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? STATUSES[0],
    });
    setError(null);
    setIsEditing(true);
  }

  function handleCancelEdit() {
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

    try {
      setSaving(true);
      const res = await updateTask(task.id, {
        title: form.title,
        description: form.description,
        status: form.status,
      });
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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusLabel = task ? getStatusLabel(task.status) : "";
  const statusIndex = task ? STATUSES.indexOf(task.status) : -1;
  const statusPosition = statusIndex >= 0 ? `${statusIndex + 1} / ${STATUSES.length}` : "";

  return (
    <Layout userName={user ? `Hello, ${user.email}` : ""} onLogout={handleLogout}>
      <Container>
        <div className="task-page">
          <div className="task-page__nav">
            <button type="button" onClick={handleBack} className="nav-back-btn">
              <ArrowLeft size={16} />
              <span>Back to board</span>
            </button>
          </div>

          {loading && <div className="state-message">Loading task...</div>}
          {!loading && error && <div className="state-message error">{error}</div>}

          {!loading && task && (
            <div className="task-layout">
              <aside className="task-meta">
                <div className="task-meta__header">
                  <span className="task-meta__breadcrumb">Board · Task</span>
                  <h1 className="task-meta__title">Task details</h1>
                </div>

                <div className="task-meta__list">
                  <div className="meta-item">
                    <span className="meta-label">ID</span>
                    <span className="meta-value mono">
                      <Hash size={12} className="meta-icon" /> {task.id}
                    </span>
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Status</span>
                    <div className="meta-status-row">
                      <span className={`status-dot status-dot--${task.status.toLowerCase().replace("_", "")}`} />
                      <span className="meta-value mono">
                        {statusLabel} <span className="meta-sub">({statusPosition})</span>
                      </span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Created At</span>
                    <span className="meta-value mono">
                      <Calendar size={12} className="meta-icon" />
                      {formatDate(task.createdAt)}
                    </span>
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Updated At</span>
                    <span className="meta-value mono">
                      <Clock size={12} className="meta-icon" />
                      {formatDate(task.updatedAt)}
                    </span>
                  </div>
                </div>

                {!isEditing && (
                  <button type="button" className="edit-trigger-btn" onClick={handleEditClick}>
                    <Pencil size={14} />
                    <span>Edit Task</span>
                  </button>
                )}
              </aside>

              <main className="task-form-container">
                <form className={`task-form ${isEditing ? "is-editing" : "is-readonly"}`} onSubmit={handleSubmit}>
                  <div className="task-form__header">
                    <span className="form-label">Task Content</span>
                    {isEditing && (
                      <div className="form-actions">
                        <button type="button" className="icon-btn cancel" onClick={handleCancelEdit} disabled={saving} title="Cancel">
                          <X size={18} />
                        </button>
                        <button type="submit" className="icon-btn save" disabled={saving} title="Save changes">
                          <Save size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="title" className="input-label">
                      Title
                    </label>
                    <input id="title" name="title" type="text" className="dark-input" value={form.title} onChange={handleChange} disabled={!isEditing || saving} placeholder="Task title" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description" className="input-label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="dark-textarea"
                      value={form.description}
                      onChange={handleChange}
                      disabled={!isEditing || saving}
                      placeholder="Describe the task..."
                      rows={8}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="input-label">
                      Status
                    </label>
                    <div className="select-wrapper">
                      <select id="status" name="status" className="dark-select" value={form.status} onChange={handleChange} disabled={!isEditing || saving}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {getStatusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
              </main>
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
}
