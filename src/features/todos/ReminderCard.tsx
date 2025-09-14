import React from "react";
import type { ReminderViewModel } from "./types";
import { LuClock } from "react-icons/lu";
import clsx from "clsx";

interface ReminderCardProps {
  r: ReminderViewModel;
  className?: string;
}
const ReminderCard: React.FC<ReminderCardProps> = ({ r, className }) => {
  return (
    <div
      key={r.id}
      className={clsx(
        "cursor-pointer bg-neutral-900 rounded-2xl p-4 shadow-md flex flex-col gap-3 hover:bg-neutral-800 transition-colors",
        className
      )}
    >
      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {r.tags?.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs rounded-full text-white"
            style={{ backgroundColor: tag.color }}
          >
            #{tag.text}
          </span>
        ))}
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-white">{r.title}</p>
        {r.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{r.description}</p>
        )}
      </div>

      {/* Divided */}
      <div className="border-t border-neutral-700" />

      {/* Place + time */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <p>{r.place}</p>
        <p className="flex items-center gap-1">
          <LuClock className="text-green-400" />
          {r.time}
        </p>
      </div>
    </div>
  );
};

export default ReminderCard;
