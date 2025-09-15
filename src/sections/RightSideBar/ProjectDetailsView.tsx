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
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full flex-shrink-0"
            style={{
              backgroundColor: project.color,
              border: `2px solid ${getContrastColor(project.color)}`,
            }}
          />
          <h1 className="text-xl font-bold text-white">
            {project.projectName}
          </h1>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{todos.length}</div>
          <div className="text-sm text-gray-400">Việc cần làm</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalTasks}</div>
          <div className="text-sm text-gray-400">Tổng nhiệm vụ</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <RiBarChartLine size="1rem" />
          Tiến độ tổng quan
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Hoàn thành</span>
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
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {completedTasks}/{totalTasks} nhiệm vụ hoàn thành
            </span>
            <span>
              {completedPomodoros}/{totalPomodoros} pomodoro
            </span>
          </div>
        </div>
      </div>

      {/* Todos List */}
      {todos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaTasks size="1rem" />
            Danh sách việc cần làm ({todos.length})
          </h3>
          <div className="space-y-3">
            {todos.map((todo) => {
              const progress = todoProgress(todo);
              const isOverdue = todo.dueDate && todo.dueDate < Date.now();

              return (
                <div
                  key={todo.id}
                  onClick={() => handleTodoClick(todo)}
                  className="bg-neutral-900 rounded-lg p-4 cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Todo Header */}
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-white text-left flex-1 pr-2">
                        {todo.title}
                      </h4>
                      <div className="flex flex-col items-end gap-1">
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
                    </div>

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
