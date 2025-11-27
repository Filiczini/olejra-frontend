// Presentational component for a single task row on the board.
export function Task({ task, isLoading, onOpenDetails, onAdvance }) {
  const isDone = task.status === "DONE";

  return (
    <div className="task">
      {/* Click on title opens Task Details page */}
      <span
        className="task__title"
        onClick={() => onOpenDetails(task.id)}
        tabIndex={0} // Allow keyboard focus for better accessibility
      >
        {task.title}
      </span>

      {/* Show advance button only if task is not in DONE status */}
      {!isDone && (
        <button onClick={() => onAdvance(task)} disabled={isLoading} className="task__button" title="Move to next column">
          →
        </button>
      )}
    </div>
  );
}
