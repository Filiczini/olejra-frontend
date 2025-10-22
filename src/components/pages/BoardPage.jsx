const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];
const statusNames = {
  BACKLOG: "Backlog",
  TODO: "To-do",
  IN_PROGRESS: "In-progress",
  DONE: "Done",
};

const mockTasks = [
  { id: 1, title: "To configure project for future work", status: "BACKLOG" },
  { id: 2, title: "To learn JavaScript for skill matrix", status: "BACKLOG" },
  { id: 3, title: "To learn React for skill matrix", status: "BACKLOG" },
];

export default function BoardPage() {
  const columns = { BACKLOG: [], TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const task of mockTasks) columns[task.status]?.push(task);
  return (
    <div className="board-container">
      <h2>Дошка задач</h2>
      <div className="columns">
        {statuses.map((status) => (
          <div key={status} className="column">
            <h3>{statusNames[status]}</h3>
            {columns[status].map((task) => (
              <div key={task.id} className="task">
                {task.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
