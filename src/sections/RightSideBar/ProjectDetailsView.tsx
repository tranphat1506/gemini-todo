import React from "react";
import { useAppDispatch } from "@/hooks/storeHooks";
import { showTodoDetails } from "@/features/ui/rightSidebar.slice";
import { getContrastColor } from "@/utils/color";
import { todoProgress } from "@/features/todos/utils/progress.calculator";
import type { ProjectEntity, TodoViewModel } from "@/features/todos/types";
import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiBarChartLine,
} from "react-icons/ri";
import { FaTasks } from "react-icons/fa";

interface ProjectDetailsViewProps {
  project: ProjectEntity;
  todos: TodoViewModel[];
}

const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({
  project,
  todos,
}) => {
  const dispatch = useAppDispatch();

  const handleTodoClick = (todo: TodoViewModel) => {
    dispatch(showTodoDetails(todo));
  };

  // Cập nhật formatDateTime với HH:mm
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

  // Calculate project statistics
  const totalTasks = todos.reduce((sum, todo) => sum + todo.tasks.length, 0);
  const completedTasks = todos.reduce(
    (sum, todo) => sum + todo.tasks.filter((task) => task.isCompleted).length,
    0
  );
  const totalPomodoros = todos.reduce(
    (sum, todo) =>
      sum +
      todo.tasks.reduce(
        (taskSum, task) => taskSum + task.estimatedPomodoros,
        0
      ),
    0
  );
  const completedPomodoros = todos.reduce(
    (sum, todo) =>
      sum +
      todo.tasks.reduce(
        (taskSum, task) => taskSum + task.completedPomodoros,
        0
      ),
    0
  );
  const overallProgress =
    totalPomodoros > 0
      ? Math.round((completedPomodoros / totalPomodoros) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="w-6 h-6 rounded-full mt-1 flex-shrink-0"
            style={{
              backgroundColor: project.color,
              border: `2px solid ${getContrastColor(project.color)}`,
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white leading-tight break-words">
              {project.projectName}
            </h1>
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <RiBarChartLine size="1rem" />
          Tổng quan dự án
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {completedTasks}/{totalTasks}
            </div>
            <div className="text-xs text-gray-400">Nhiệm vụ</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {completedPomodoros}/{totalPomodoros}
            </div>
            <div className="text-xs text-gray-400">Pomodoro</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tiến độ</span>
            <span className="text-white">{overallProgress}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                overallProgress === 100 ? "bg-green-400" : "bg-blue-400"
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Todos List */}
      {todos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaTasks size="1rem" />
            Việc cần làm ({todos.length})
          </h3>
          <div className="space-y-3">
            {todos.map((todo) => {
              const progress = todoProgress(todo);
              const isOverdue = todo.dueDate && todo.dueDate < Date.now();

              return (
                <div
                  key={todo.id}
                  onClick={() => handleTodoClick(todo)}
                  className="bg-neutral-900 rounded-lg p-3 cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-medium text-white flex-1 leading-tight break-words min-w-0">
                        {todo.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          todo.priority === "high"
                            ? "text-red-400 bg-red-500/20"
                            : "text-gray-400 bg-gray-500/20"
                        }`}
                      >
                        {getPriorityText(todo.priority)}
                      </span>
                    </div>

                    {todo.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 break-words">
                        {todo.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tiến độ</span>
                        <span className="text-white">{progress}%</span>
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

                    <div className="flex flex-col gap-1 text-xs text-gray-400">
                      {/* Start Date với thời gian */}
                      {todo.startDate && (
                        <div className="flex items-center gap-1">
                          <RiCalendarLine size="0.75rem" />
                          <span>Bắt đầu: {formatDateTime(todo.startDate)}</span>
                        </div>
                      )}

                      {/* Due Date với thời gian */}
                      {todo.dueDate && (
                        <div className="flex items-center gap-1">
                          <RiCalendarLine size="0.75rem" />
                          <span className={isOverdue ? "text-red-400" : ""}>
                            Hạn chót: {formatDateTime(todo.dueDate)}
                          </span>
                        </div>
                      )}

                      {/* Tasks Count */}
                      <div className="flex items-center gap-1">
                        <RiCheckboxCircleLine size="0.75rem" />
                        <span>{todo.tasks.length} nhiệm vụ</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">📁</div>
          <p>Chưa có việc cần làm nào trong dự án này</p>
          <p className="text-sm text-gray-500 mt-1">
            Thêm việc cần làm để bắt đầu quản lý dự án
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsView;
