import type { TaskViewModel, TodoViewModel } from "../types";

export const taskProgress = (task: TaskViewModel) =>
  Math.min(
    100,
    Math.round((task.completedPomodoros / task.estimatedPomodoros) * 100)
  );

export const todoProgress = (todo: TodoViewModel) => {
  const totalEstimated = todo.tasks.reduce(
    (sum, t) => sum + t.estimatedPomodoros,
    0
  );
  const totalCompleted = todo.tasks.reduce(
    (sum, t) => sum + t.completedPomodoros,
    0
  );
  return totalEstimated > 0
    ? Math.min(100, Math.round((totalCompleted / totalEstimated) * 100))
    : 0;
};
