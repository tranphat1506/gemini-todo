import React from "react";
import { getContrastColor } from "@/utils/color";
import type { ReminderViewModel } from "@/features/todos/types";
import {
  RiTimeLine,
  RiMapPinLine,
  RiRepeatLine,
  RiNotificationLine,
  RiCheckboxCircleLine,
  RiCheckboxBlankLine,
} from "react-icons/ri";
import { FaTasks } from "react-icons/fa";

interface ReminderDetailsViewProps {
  reminder: ReminderViewModel;
}

const ReminderDetailsView: React.FC<ReminderDetailsViewProps> = ({
  reminder,
}) => {
  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLoopDescription = () => {
    if (!reminder.loop) return null;

    switch (reminder.loop.type) {
      case "daily":
        return "Repeats daily";
      case "weekly":
        return `Repeats weekly on ${reminder.loop.days.join(", ")}`;
      case "monthly":
        return `Repeats monthly on day ${reminder.loop.dates.join(", ")}`;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Reminder Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <RiNotificationLine size="1.5rem" className="text-blue-400 mt-1" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white leading-tight">
              {reminder.title}
            </h1>
            {reminder.description && (
              <p className="text-gray-300 text-sm leading-relaxed mt-2">
                {reminder.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Time & Location */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-white mb-3">Schedule</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <RiTimeLine size="1rem" className="text-blue-400" />
            <div>
              <span className="text-gray-400 text-sm">Time:</span>
              <span className="text-white ml-2 font-medium">
                {reminder.time}
              </span>
            </div>
          </div>

          {reminder.place && (
            <div className="flex items-center gap-3">
              <RiMapPinLine size="1rem" className="text-green-400" />
              <div>
                <span className="text-gray-400 text-sm">Location:</span>
                <span className="text-white ml-2">{reminder.place}</span>
              </div>
            </div>
          )}

          {reminder.loop && (
            <div className="flex items-center gap-3">
              <RiRepeatLine size="1rem" className="text-purple-400" />
              <div>
                <span className="text-gray-400 text-sm">Repeat:</span>
                <span className="text-white ml-2">{getLoopDescription()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {reminder.tags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {reminder.tags.map((tag) => (
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

      {/* Associated Tasks */}
      {reminder.tasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaTasks size="1rem" />
            Related Tasks ({reminder.tasks.length})
          </h3>

          <div className="space-y-2">
            {reminder.tasks.map((task) => (
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
                    {task.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Task Progress */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>
                          {task.completedPomodoros}/{task.estimatedPomodoros}{" "}
                          pomodoros
                        </span>
                        <span>
                          {Math.round(
                            (task.completedPomodoros /
                              task.estimatedPomodoros) *
                              100
                          )}
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
      {reminder.tasks.length === 0 && (
        <div className="bg-neutral-900 rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-gray-400">No tasks linked to this reminder</p>
          <p className="text-sm text-gray-500 mt-1">
            You can link tasks to get reminded about specific work items
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {reminder.tasks.length}
          </div>
          <div className="text-xs text-gray-400">Linked Tasks</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {reminder.tags.length}
          </div>
          <div className="text-xs text-gray-400">Tags</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs text-gray-500">
        <div>Created: {formatDateTime(reminder.createdAt)}</div>
        <div>Last updated: {formatDateTime(reminder.updatedAt)}</div>
      </div>
    </div>
  );
};

export default ReminderDetailsView;
