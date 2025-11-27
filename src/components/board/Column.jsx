// olejra-frontend/src/components/Board/Column.jsx
import { Task } from "./Task";

// Column is responsible for rendering a single board column.
// It receives the tasks for this column and delegates row rendering to <Task />.
export function Column({ title, tasks, loadingById, onOpenDetails, onAdvance }) {
  const hasTasks = tasks && tasks.length > 0;

  return (
    <section className="column" aria-label={title}>
      <h3 className="column__title">
        {title}
        {hasTasks && <span className="column__count"> · {tasks.length}</span>}
      </h3>

      <div className="column__body">
        {hasTasks ? (
          tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              isLoading={!!loadingById[task.id]} // loading state per task
              onOpenDetails={onOpenDetails} // parent handles navigation
              onAdvance={onAdvance} // parent handles API call
            />
          ))
        ) : (
          <p className="column__empty">No tasks yet</p>
        )}
      </div>
    </section>
  );
}
