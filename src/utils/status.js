// STATUS_FLOW defines the strict order of task statuses.
// Used for column order and to validate allowed forward transitions.
export const STATUS_FLOW = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];

export function canTransition(from, to) {
  const fromIndex = STATUS_FLOW.indexOf(from);
  const toIndex = STATUS_FLOW.indexOf(to);

  return toIndex - fromIndex === 1;
}
