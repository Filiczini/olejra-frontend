// Presentational component for a single task row on the board.
export function Task({ task, isLoading, onOpenDetails, onAdvance }) {
  const isDone = task.status === "DONE";

  return (
    <div className="task">
      {/* Left edit button – opens Task Details / edit */}
      <button type="button" className="task__icon-btn task__icon-btn--edit" onClick={() => onOpenDetails(task.id)} disabled={isLoading} title="Edit task">
        ✎
      </button>

      {/* Center: plain text span, NOT a button */}
      <span className="task__title">{task.title}</span>

      {/* Right: move forward button */}
      {!isDone && (
        <button type="button" onClick={() => onAdvance(task)} disabled={isLoading} className="task__icon-btn task__icon-btn--advance" title="Move to next column">
          →
        </button>
      )}
    </div>
  );
}
