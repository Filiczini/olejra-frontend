import { api } from "../api/axios";

export function advanceTask(taskId, from, to) {
  return api.post("/tasks/advance", {
    taskId,
    from,
    to,
  });
}
