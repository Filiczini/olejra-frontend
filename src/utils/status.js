// src/utils/status.js

// All statuses in forward order for board and forms.
export const STATUSES = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];

// Human-readable labels for UI.
export const STATUS_LABELS = {
  BACKLOG: "Backlog",
  TODO: "To-do",
  IN_PROGRESS: "In-progress",
  DONE: "Done",
};

// Get label or fallback to raw status.
export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

// Get position index for sorting or ordering in UI.
export function getStatusPosition(status) {
  const index = STATUSES.indexOf(status);
  // Return -1 when status is not found so callers can detect invalid statuses.
  return index;
}

// Check if we can move exactly one step forward in the status flow.
export function canTransition(fromStatus, toStatus) {
  if (!fromStatus || !toStatus) return false;

  const fromIndex = STATUSES.indexOf(fromStatus);
  const toIndex = STATUSES.indexOf(toStatus);

  if (fromIndex === -1 || toIndex === -1) return false;

  // Allow only moving to the immediate next status.
  return toIndex === fromIndex + 1;
}
