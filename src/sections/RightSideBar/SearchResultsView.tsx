import React from "react";
import { useAppDispatch } from "@/hooks/storeHooks";
import {
  showTodoDetails,
  showReminderDetails,
} from "@/features/ui/rightSidebar.slice";
import { todoProgress } from "@/features/todos/utils/progress.calculator";
import type { TodoViewModel, ReminderViewModel } from "@/features/todos/types";
import {
  RiSearch2Line,
  RiCalendarLine,
  RiTimeLine,
  RiMapPinLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { FaTasks } from "react-icons/fa";

interface SearchResultsViewProps {
  query: string;
  todos: TodoViewModel[];
  reminders: ReminderViewModel[];
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  todos,
  reminders,
}) => {
  const dispatch = useAppDispatch();

  const handleTodoClick = (todo: TodoViewModel) => {
    dispatch(showTodoDetails(todo));
  };

  const handleReminderClick = (reminder: ReminderViewModel) => {
    dispatch(showReminderDetails(reminder));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Bình thường";
    }
  };

  const totalResults = todos.length + reminders.length;

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400 text-black rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-blue-400">
          <RiSearch2Line size="1.5rem" />
          <h2 className="text-lg font-semibold">Kết quả tìm kiếm</h2>
        </div>
        <div className="text-sm text-gray-400">
          {totalResults} kết quả{totalResults !== 1 ? "" : ""} cho "{query}"
        </div>
      </div>

      {/* Summary */}
      {totalResults > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-900 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{todos.length}</div>
            <div className="text-sm text-gray-400">Việc cần làm</div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">
              {reminders.length}
            </div>
            <div className="text-sm text-gray-400">Lời nhắc</div>
          </div>
        </div>
      )}

      {/* Todos Results */}
      {todos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaTasks size="1rem" />
            Việc cần làm ({todos.length})
          </h3>
          <div className="space-y-2">
            {todos.map((todo) => {
              const progress = todoProgress(todo);
              const isOverdue = todo.dueDate && todo.dueDate < Date.now();

              return (
                <div
                  key={todo.id}
                  onClick={() => handleTodoClick(todo)}
                  className="bg-neutral-900 rounded-lg p-3 cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white flex-1 pr-2">
                      {highlightText(todo.title, query)}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        todo.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {getPriorityText(todo.priority)}
                    </span>
                  </div>

                  {/* Description */}
                  {todo.description && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {highlightText(todo.description, query)}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Tiến độ</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          progress === 100 ? "bg-green-400" : "bg-blue-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    {/* Due Date */}
                    {todo.dueDate && (
                      <div className="flex items-center gap-1">
                        <RiCalendarLine size="0.75rem" />
                        <span className={isOverdue ? "text-red-400" : ""}>
                          Hạn: {formatDate(todo.dueDate)}
                        </span>
                      </div>
                    )}

                    {/* Tasks Count */}
                    <div className="flex items-center gap-1">
                      <RiCheckboxCircleLine size="0.75rem" />
                      <span>{todo.tasks.length} nhiệm vụ</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {todo.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                          }}
                        >
                          #{highlightText(tag.text, query)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Project */}
                  {todo.project && (
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: todo.project.color }}
                      />
                      <span className="text-gray-400">
                        {highlightText(todo.project.projectName, query)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reminders Results */}
      {reminders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <RiTimeLine size="1rem" />
            Lời nhắc ({reminders.length})
          </h3>
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                onClick={() => handleReminderClick(reminder)}
                className="bg-neutral-900 rounded-lg p-3 cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <h4 className="font-medium text-white mb-1">
                  {highlightText(reminder.title, query)}
                </h4>

                {reminder.description && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {highlightText(reminder.description, query)}
                  </p>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <RiTimeLine size="0.75rem" />
                    <span>Thời gian: {reminder.time}</span>
                  </div>
                  {reminder.place && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <RiMapPinLine size="0.75rem" />
                      <span>
                        Địa điểm: {highlightText(reminder.place, query)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {reminder.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {reminder.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                        }}
                      >
                        #{highlightText(tag.text, query)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Linked Tasks Count */}
                {reminder.tasks.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <RiCheckboxCircleLine size="0.75rem" />
                    <span>{reminder.tasks.length} nhiệm vụ liên kết</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalResults === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-lg mb-1">Không tìm thấy kết quả</p>
          <p className="text-sm text-gray-500">
            Hãy thử tìm kiếm với từ khóa khác
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsView;
