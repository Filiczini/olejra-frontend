import { Pencil, ArrowRight } from "lucide-react";

export function Task({ task, isLoading, onOpenDetails, onAdvance }) {
  const isDone = task.status === "DONE";

  return (
    <div className="task">
      <button type="button" className="task__icon-btn task__icon-btn--edit" onClick={() => onOpenDetails(task.id)} disabled={isLoading} title="Edit task">
        <Pencil size={14} />
      </button>
      <span className="task__title">{task.title}</span>

      {!isDone && (
        <button type="button" onClick={() => onAdvance(task)} disabled={isLoading} className="task__icon-btn task__icon-btn--advance" title="Move to next column">
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
