import { api } from "../api/axios";

// Move task forward using backend transition API.
export function advanceTask(taskId, from, to) {
  return api.post("/tasks/advance", {
    taskId,
    from,
    to,
  });
}

// Get full task details by id.
export function getTask(taskId) {
  // Returns title, description, status, timestamps...
  return api.get(`/tasks/${taskId}`);
}

// Update task title and/or description.
export function updateTask(taskId, data) {
  // data: { title?, description? }
  return api.patch(`/tasks/${taskId}`, data);
}
