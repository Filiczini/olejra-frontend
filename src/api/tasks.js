import { api } from "../api/axios";

export function advanceTask(taskId, from, to) {
  return api.post("/tasks/advance", {
    taskId,
    from,
    to,
  });
}

export function getTask(taskId) {
  return api.get(`/tasks/${taskId}`);
}

export function updateTask(taskId, data) {
  return api.patch(`/tasks/${taskId}`, data);
}
