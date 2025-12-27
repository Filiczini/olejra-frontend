export type TaskStatus = "backlog" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskCreateInput = {
  title: string;
  description?: string | null;
};

export type TaskUpdateInput = {
  title?: string;
  description?: string | null;
};

export type TaskMoveInput = {
  taskId: string;
  from: TaskStatus;
  to: TaskStatus;
};