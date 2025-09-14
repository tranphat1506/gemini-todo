import type { Todo } from "../types";

function startOfToday(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export function getTodayTodos(todos: Todo[]): Todo[] {
  const todayStart = startOfToday();

  return todos
    .filter((todo) => todo.dueDate && todo.dueDate >= todayStart)
    .sort((a, b) => {
      // Ưu tiên high > normal
      if (a.priority === "high" && b.priority === "normal") return -1;
      if (a.priority === "normal" && b.priority === "high") return 1;

      // Nếu priority bằng nhau, so sánh dueDate gần nhất
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate;
      }
      return 0;
    });
}
