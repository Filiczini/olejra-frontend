// Single status column on the board, wraps tasks list

export function Column({ title, hasTasks, children }) {
  return (
    <div className={`column ${hasTasks ? "column--active" : ""}`}>
      <h3 className="column__title">{title}</h3>
      {children}
    </div>
  );
}
