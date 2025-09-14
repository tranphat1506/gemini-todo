import { Link } from "react-router";
import { FaRegClock } from "react-icons/fa";
import clsx from "clsx";
import type { TodoViewModel } from "@/features/todos/types";
import { getContrastColor } from "@/utils/color";

interface TodosListProps {
  todos: TodoViewModel[];
}

const TodosList = ({ todos }: TodosListProps) => {
  const calcProgress = (todo: TodoViewModel) => {
    if (!todo.tasks.length) return 0;
    const completed = todo.tasks.filter((t) => t.isCompleted).length;
    return Math.round((completed / todo.tasks.length) * 100);
  };

  const formatTime = (ms: number) =>
    new Date(ms).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (ms: number) =>
    new Date(ms).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="todos flex flex-col gap-4 sm:bg-[#111] sm:p-6 sm:rounded-2xl">
      <div className="flex gap-4 justify-between items-end">
        <h2 className="title font-semibold text-3xl">Công việc hôm nay</h2>
        <Link to={"/todos"} className="todos-all text-md hover:underline">
          Xem tất cả
        </Link>
      </div>

      {todos.map((todo) => {
        const progress = calcProgress(todo);
        const diffMs = todo.dueDate ?? Date.now() - Date.now();
        const diffHours = diffMs / (1000 * 60 * 60);
        return (
          <div
            key={todo.id}
            className="bg-neutral-900 rounded-2xl px-4 py-6 space-y-3 shadow-md"
          >
            {/* Priority + Project + Progress */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Priority */}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    todo.priority === "high"
                      ? "bg-red-500 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {todo.priority === "high" ? "Ưu tiên cao" : "Bình thường"}
                </span>
                <div className="h-6 w-[2px] bg-white/20" />
                {/* Project */}
                {todo.project && (
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: todo.project.color,
                      color: getContrastColor(todo.project.color),
                    }}
                    title={todo.project.projectName}
                  >
                    {todo.project.projectName}
                  </span>
                )}
              </div>

              {/* Progress */}
              <span className="text-sm text-gray-400">{progress}%</span>
            </div>

            {/* Title */}
            <p className="font-semibold text-white">{todo.title}</p>

            {/* Due date */}
            {todo.dueDate ? (
              <div className="text-sm text-gray-400 flex flex-col gap-1">
                <p className="flex items-center gap-2">
                  <FaRegClock className="text-green-400" />
                  <span
                    className={clsx(
                      diffHours < 0
                        ? "text-red-500" // quá hạn
                        : diffHours < 1
                        ? "text-yellow-500" // sắp đến hạn trong 1 giờ
                        : "text-green-400" // còn nhiều thời gian
                    )}
                  >
                    {formatTime(todo.dueDate)}
                  </span>
                </p>
                <p>
                  Due date:{" "}
                  <span className="text-white">{formatDate(todo.dueDate)}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Không có hạn chót</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {todo.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: tag.color,
                    color: getContrastColor(tag.color),
                  }}
                >
                  #{tag.text}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TodosList;
