import React from "react";
import { getContrastColor } from "@/utils/color";
import { todoProgress } from "@/features/todos/utils/progress.calculator";
import type { TodoViewModel } from "@/features/todos/types";
import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiCheckboxBlankLine,
  RiBarChartLine,
  RiTimeLine,
  RiFolderLine,
} from "react-icons/ri";
import { FaTasks } from "react-icons/fa";

interface TodoDetailsViewProps {
  todo: TodoViewModel;
}

const TodoDetailsView: React.FC<TodoDetailsViewProps> = ({ todo }) => {
  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "low":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const progress = todoProgress(todo);
  const completedTasks = todo.tasks.filter((task) => task.isCompleted).length;
  const totalPomodoros = todo.tasks.reduce(
    (sum, task) => sum + task.estimatedPomodoros,
    0
  );
  const completedPomodoros = todo.tasks.reduce(
    (sum, task) => sum + task.completedPomodoros,
    0
  );
  const isOverdue = todo.dueDate && todo.dueDate < Date.now();

  return (
    <div className="space-y-6">
      {/* Todo Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <FaTasks size="1.5rem" className="text-blue-400 mt-1" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white leading-tight">
              {todo.title}
            </h1>
            {todo.description && (
              <p className="text-gray-300 text-sm leading-relaxed mt-2">
                {todo.description}
              </p>
            )}
          </div>
        </div>

        {/* Priority Badge */}
        <div className="flex justify-start">
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(
              todo.priority
            )}`}
          >
            Ưu tiên: {getPriorityText(todo.priority)}
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <RiBarChartLine size="1rem" />
          Tổng quan tiến độ
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Hoàn thành</span>
            <span className="text-white">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progress === 100 ? "bg-green-400" : "bg-blue-400"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {completedTasks}/{todo.tasks.length}
          </div>
          <div className="text-xs text-gray-400">Nhiệm vụ</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {completedPomodoros}/{totalPomodoros}
          </div>
          <div className="text-xs text-gray-400">Pomodoro</div>
        </div>
      </div>

      {/* Dates & Project */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-white mb-3">Thông tin</h3>

        <div className="space-y-3">
          {/* Start Date */}
          {todo.startDate && (
            <div className="flex items-center gap-3">
              <RiCalendarLine size="1rem" className="text-green-400" />
              <div>
                <span className="text-gray-400 text-sm">Ngày bắt đầu:</span>
                <span className="text-white ml-2">
                  {formatDate(todo.startDate)}
                </span>
              </div>
            </div>
          )}

          {/* Due Date */}
          {todo.dueDate && (
            <div className="flex items-center gap-3">
              <RiCalendarLine
                size="1rem"
                className={isOverdue ? "text-red-400" : "text-orange-400"}
              />
              <div>
                <span className="text-gray-400 text-sm">Hạn chót:</span>
                <span
                  className={`ml-2 ${
                    isOverdue ? "text-red-400" : "text-white"
                  }`}
                >
                  {formatDate(todo.dueDate)}
                  {isOverdue && " (Quá hạn)"}
                </span>
              </div>
            </div>
          )}

          {/* Project */}
          {todo.project && (
            <div className="flex items-center gap-3">
              <RiFolderLine size="1rem" className="text-purple-400" />
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Dự án:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: todo.project.color }}
                  />
                  <span className="text-white">{todo.project.projectName}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {todo.tags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400">Thẻ</h4>
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

      {/* Tasks List */}
      {todo.tasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <RiCheckboxCircleLine size="1rem" />
            Danh sách nhiệm vụ ({todo.tasks.length})
          </h3>

          <div className="space-y-2">
            {todo.tasks.map((task) => (
              <div key={task.id} className="bg-neutral-900 rounded-lg p-3">
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

                    {/* Pomodoro Progress */}
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>
                          Pomodoro: {task.completedPomodoros}/
                          {task.estimatedPomodoros}
                        </span>
                        <span>
                          {Math.min(
                            100,
                            (task.completedPomodoros /
                              task.estimatedPomodoros) *
                              100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${
                            task.isCompleted ? "bg-green-400" : "bg-blue-400"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (task.completedPomodoros /
                                task.estimatedPomodoros) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Task Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty Tasks State */}
      {todo.tasks.length === 0 && (
        <div className="bg-neutral-900 rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-gray-400">Chưa có nhiệm vụ nào</p>
          <p className="text-sm text-gray-500 mt-1">
            Thêm nhiệm vụ để bắt đầu theo dõi tiến độ
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs text-gray-500">
        <div>Tạo lúc: {formatDateTime(todo.createdAt)}</div>
        <div>Cập nhật lần cuối: {formatDateTime(todo.updatedAt)}</div>
      </div>
    </div>
  );
};

export default TodoDetailsView;
