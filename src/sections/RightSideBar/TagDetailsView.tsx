import React from "react";
import { useAppDispatch } from "@/hooks/storeHooks";
import {
  showTodoDetails,
  showReminderDetails,
} from "@/features/ui/rightSidebar.slice";
import { getContrastColor } from "@/utils/color";
import { todoProgress } from "@/features/todos/utils/progress.calculator";
import type {
  TagEntity,
  TodoViewModel,
  ReminderViewModel,
} from "@/features/todos/types";
import {
  RiCalendarLine,
  RiTimeLine,
  RiMapPinLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { FaTasks } from "react-icons/fa";

interface TagDetailsViewProps {
  tag: TagEntity;
  todos: TodoViewModel[];
  reminders: ReminderViewModel[];
}

const TagDetailsView: React.FC<TagDetailsViewProps> = ({
  tag,
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

  return (
    <div className="space-y-6">
      {/* Tag Info */}
      <div className="text-center space-y-3">
        <div
          className="inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold"
          style={{
            backgroundColor: tag.color,
            color: getContrastColor(tag.color),
          }}
        >
          #{tag.text}
        </div>
        <div className="text-sm text-gray-400">
          {todos.length} todos • {reminders.length} reminders
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{todos.length}</div>
          <div className="text-sm text-gray-400">Todos</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">
            {reminders.length}
          </div>
          <div className="text-sm text-gray-400">Reminders</div>
        </div>
      </div>

      {/* Todos Section */}
      {todos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaTasks size="1rem" />
            Todos ({todos.length})
          </h3>
          <div className="space-y-2">
            {todos.map((todo) => {
              const progress = todoProgress(todo);
              return (
                <div
                  key={todo.id}
                  onClick={() => handleTodoClick(todo)}
                  className="bg-neutral-900 rounded-lg p-3 cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white truncate flex-1">
                      {todo.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        todo.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {todo.priority}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-1.5">
                      <div
                        className="bg-green-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  {todo.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <RiCalendarLine size="0.75rem" />
                      <span>Due: {formatDate(todo.dueDate)}</span>
                    </div>
                  )}

                  {/* Tasks count */}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <RiCheckboxCircleLine size="0.75rem" />
                    <span>{todo.tasks.length} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reminders Section */}
      {reminders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <RiTimeLine size="1rem" />
            Reminders ({reminders.length})
          </h3>
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                onClick={() => handleReminderClick(reminder)}
                className="bg-neutral-900 rounded-lg p-3 cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <h4 className="font-medium text-white mb-1">
                  {reminder.title}
                </h4>
                {reminder.description && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {reminder.description}
                  </p>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <RiTimeLine size="0.75rem" />
                    <span>{reminder.time}</span>
                  </div>
                  {reminder.place && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <RiMapPinLine size="0.75rem" />
                      <span>{reminder.place}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todos.length === 0 && reminders.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🏷️</div>
          <p>No todos or reminders found with this tag</p>
        </div>
      )}
    </div>
  );
};

export default TagDetailsView;
