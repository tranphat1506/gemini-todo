import React from "react";
import {
  todoProgress,
  taskProgress,
} from "@/features/todos/utils/progress.calculator";
import { getContrastColor } from "@/utils/color";
import type { TodoViewModel } from "@/features/todos/types";
import {
  RiTimeLine,
  RiFlagLine,
  RiCheckboxCircleLine,
  RiCheckboxBlankLine,
  RiFolderLine,
  RiPlayCircleLine,
  RiStopCircleLine,
} from "react-icons/ri";
import { FaTasks } from "react-icons/fa";

interface TodoDetailsViewProps {
  todo: TodoViewModel;
}

const TodoDetailsView: React.FC<TodoDetailsViewProps> = ({ todo }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const progress = todoProgress(todo);
  const totalEstimated = todo.tasks.reduce(
    (sum, task) => sum + task.estimatedPomodoros,
    0
  );
  const totalCompleted = todo.tasks.reduce(
    (sum, task) => sum + task.completedPomodoros,
    0
  );
  const isOverdue = todo.dueDate && todo.dueDate < Date.now();

  return (
    <div className="space-y-6">
      {/* Todo Header */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-white leading-tight">
          {todo.title}
        </h1>

        {todo.description && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {todo.description}
          </p>
        )}

        {/* Priority & Status */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
              todo.priority === "high"
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            <RiFlagLine size="0.875rem" />
            {todo.priority.toUpperCase()}
          </div>

          {isOverdue && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
              <RiTimeLine size="0.875rem" />
              OVERDUE
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <RiCheckboxCircleLine size="1.25rem" className="text-green-400" />
          <h3 className="font-semibold text-white">Progress</h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Overall Completion</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progress === 100 ? "bg-green-400" : "bg-blue-400"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {totalCompleted}/{totalEstimated} pomodoros completed
            </span>
            <span>
              {todo.tasks.filter((t) => t.isCompleted).length}/
              {todo.tasks.length} tasks done
            </span>
          </div>
        </div>
      </div>

      {/* Date Info */}
      <div className="grid grid-cols-1 gap-3">
        {todo.startDate && (
          <div className="flex items-center gap-3 text-sm">
            <RiPlayCircleLine size="1rem" className="text-green-400" />
            <div>
              <span className="text-gray-400">Started:</span>
              <span className="text-white ml-2">
                {formatDate(todo.startDate)}
              </span>
            </div>
          </div>
        )}

        {todo.dueDate && (
          <div className="flex items-center gap-3 text-sm">
            <RiStopCircleLine
              size="1rem"
              className={isOverdue ? "text-red-400" : "text-orange-400"}
            />
            <div>
              <span className="text-gray-400">Due:</span>
              <span
                className={`ml-2 ${isOverdue ? "text-red-400" : "text-white"}`}
              >
                {formatDate(todo.dueDate)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Project */}
      {todo.project && (
        <div className="bg-neutral-900 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <RiFolderLine size="1rem" style={{ color: todo.project.color }} />
            <div>
              <span className="text-gray-400 text-sm">Project:</span>
              <span className="text-white ml-2 font-medium">
                {todo.project.projectName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {todo.tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-400">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {todo.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
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
      )}

      {/* Tasks */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaTasks size="1rem" />
          Tasks ({todo.tasks.length})
        </h3>

        {todo.tasks.length > 0 ? (
          <div className="space-y-2">
            {todo.tasks.map((task) => {
              const taskProgressValue = taskProgress(task);
              return (
                <div
                  key={task.id}
                  className="bg-neutral-900 rounded-lg p-3 space-y-3"
                >
                  {/* Task Header */}
                  <div className="flex items-start gap-3">
                    {task.isCompleted ? (
                      <RiCheckboxCircleLine
                        size="1.25rem"
                        className="text-green-400 mt-0.5"
                      />
                    ) : (
                      <RiCheckboxBlankLine
                        size="1.25rem"
                        className="text-gray-400 mt-0.5"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium truncate ${
                          task.isCompleted
                            ? "text-gray-400 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Task Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">
                        {task.completedPomodoros}/{task.estimatedPomodoros}{" "}
                        pomodoros
                      </span>
                      <span className="text-gray-400">
                        {taskProgressValue}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          task.isCompleted ? "bg-green-400" : "bg-blue-400"
                        }`}
                        style={{ width: `${taskProgressValue}%` }}
                      />
                    </div>
                  </div>

                  {/* Task Tags */}
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                          }}
                        >
                          #{tag.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <div className="text-2xl mb-2">📝</div>
            <p>No tasks created yet</p>
            <p className="text-sm mt-1">
              Break down this todo into smaller tasks!
            </p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs text-gray-500">
        <div>Created: {formatDateTime(todo.createdAt)}</div>
        <div>Last updated: {formatDateTime(todo.updatedAt)}</div>
      </div>
    </div>
  );
};

export default TodoDetailsView;
