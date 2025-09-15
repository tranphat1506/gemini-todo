import React from "react";
import { useAppDispatch } from "@/hooks/storeHooks";
import { showTodoDetails } from "@/features/ui/rightSidebar.slice";
import { getContrastColor } from "@/utils/color";
import { todoProgress } from "@/features/todos/utils/progress.calculator";
import type { ProjectEntity, TodoViewModel } from "@/features/todos/types";
import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiFolderLine,
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

  const highPriorityTodos = todos.filter(
    (todo) => todo.priority === "high"
  ).length;
  const overdueTodos = todos.filter(
    (todo) => todo.dueDate && todo.dueDate < Date.now()
  ).length;

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="text-center space-y-3">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-semibold"
          style={{
            backgroundColor: project.color,
            color: getContrastColor(project.color),
          }}
        >
          <RiFolderLine size="1.25rem" />
          {project.projectName}
        </div>
        <div className="text-sm text-gray-400">
          {todos.length} todos • {totalTasks} tasks
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-neutral-900 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <RiBarChartLine size="1rem" className="text-green-400" />
          <h3 className="font-semibold text-white">Overall Progress</h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Completed</span>
            <span className="text-white font-medium">{overallProgress}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-3">
            <div
              className="bg-green-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {completedPomodoros}/{totalPomodoros} pomodoros
            </span>
            <span>
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-900 rounded-lg p-3">
          <div className="text-lg font-bold text-white">{todos.length}</div>
          <div className="text-xs text-gray-400">Total Todos</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-3">
          <div className="text-lg font-bold text-white">{totalTasks}</div>
          <div className="text-xs text-gray-400">Total Tasks</div>
        </div>
        <div className="bg-red-500/20 rounded-lg p-3">
          <div className="text-lg font-bold text-red-400">
            {highPriorityTodos}
          </div>
          <div className="text-xs text-red-300">High Priority</div>
        </div>
        <div className="bg-orange-500/20 rounded-lg p-3">
          <div className="text-lg font-bold text-orange-400">
            {overdueTodos}
          </div>
          <div className="text-xs text-orange-300">Overdue</div>
        </div>
      </div>

      {/* Todos List */}
      {todos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaTasks size="1rem" />
            Todos ({todos.length})
          </h3>
          <div className="space-y-2">
            {todos
              .sort((a, b) => {
                // Sort by priority first, then by due date
                if (a.priority === "high" && b.priority === "normal") return -1;
                if (a.priority === "normal" && b.priority === "high") return 1;
                if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
                return 0;
              })
              .map((todo) => {
                const progress = todoProgress(todo);
                const isOverdue = todo.dueDate && todo.dueDate < Date.now();

                return (
                  <div
                    key={todo.id}
                    onClick={() => handleTodoClick(todo)}
                    className={`bg-neutral-900 rounded-lg p-3 cursor-pointer hover:bg-neutral-800 transition-colors border-l-4 ${
                      isOverdue
                        ? "border-red-500"
                        : todo.priority === "high"
                        ? "border-orange-500"
                        : "border-green-400"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white truncate flex-1">
                        {todo.title}
                      </h4>
                      <div className="flex gap-2">
                        {isOverdue && (
                          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                            Overdue
                          </span>
                        )}
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
                    </div>

                    {/* Progress */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
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
                            {formatDate(todo.dueDate)}
                          </span>
                        </div>
                      )}

                      {/* Tasks count */}
                      <div className="flex items-center gap-1">
                        <RiCheckboxCircleLine size="0.75rem" />
                        <span>
                          {todo.tasks.filter((t) => t.isCompleted).length}/
                          {todo.tasks.length}
                        </span>
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
                            #{tag.text}
                          </span>
                        ))}
                      </div>
                    )}
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
          <p>No todos found in this project</p>
          <p className="text-sm mt-1">Start by creating your first todo!</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsView;
