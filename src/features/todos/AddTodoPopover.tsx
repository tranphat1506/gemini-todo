import { LuX, LuChevronDown } from "react-icons/lu"; // Import icon mới
import "react-day-picker/dist/style.css";
import { useEffect, useRef, useState } from "react";
import {
  priorityList,
  type Priority,
  type ProjectViewModel,
  type TagEntity,
  type TodoViewModel,
} from "./types";
import { mergeDateTime } from "@/utils/string";
import { getContrastColor } from "@/utils/color";
import { DayPicker } from "react-day-picker";

interface AddTodoPopoverProps {
  todoVM: TodoViewModel;
  setTodoVM: React.Dispatch<React.SetStateAction<TodoViewModel>>;
  allProjects?: ProjectViewModel[];
  allTags?: TagEntity[];
}
const AddTodoPopover: React.FC<AddTodoPopoverProps> = ({
  todoVM,
  setTodoVM,
  allProjects = [],
  allTags = [],
}) => {
  const inputClass =
    "p-2 rounded-lg border border-white/20 text-white outline-none focus:border-green-400";
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);

  const startPickerRef = useRef<HTMLDivElement>(null);
  const duePickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startPickerRef.current &&
        !startPickerRef.current.contains(event.target as Node)
      ) {
        setShowStartPicker(false);
      }
      if (
        duePickerRef.current &&
        !duePickerRef.current.contains(event.target as Node)
      ) {
        setShowDuePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      {/* Title */}
      <label className="text-sm text-white/70">Title (*)</label>
      <input
        type="text"
        placeholder="Title"
        value={todoVM.title}
        onChange={(e) => setTodoVM({ ...todoVM, title: e.target.value })}
        className={inputClass}
      />

      {/* Priority */}
      <label className="text-sm text-white/70">Priority (*)</label>
      <div
        className={"relative rounded-lg"}
        style={{
          backgroundColor: priorityList.find(
            (t) => t.priority === todoVM.priority
          )?.color,
          color: getContrastColor(
            priorityList.find((t) => t.priority === todoVM.priority)!.color
          ),
        }}
      >
        <select
          value={todoVM.priority}
          onChange={(e) =>
            setTodoVM({ ...todoVM, priority: e.target.value as Priority })
          }
          className={`${inputClass} appearance-none pr-8 w-full leading-tight capitalize`}
        >
          {priorityList.map((p) => (
            <option
              className={`capitalize`}
              key={p.priority}
              value={p.priority}
              style={{
                backgroundColor: p.color,
                color: getContrastColor(p.color),
              }}
            >
              {p.priority}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <LuChevronDown size="1rem" className="text-white" />
        </div>
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-sm text-white/70">Start Date</label>
        <input
          type="text"
          readOnly
          value={
            todoVM.startDate
              ? new Date(todoVM.startDate).toLocaleDateString()
              : "Chọn ngày bắt đầu"
          }
          onClick={() => setShowStartPicker((s) => !s)}
          className="p-2 rounded-lg border border-white/20 text-white cursor-pointer"
        />
        {showStartPicker && (
          <div
            ref={startPickerRef}
            className="absolute top-full mt-2 border border-white/20 rounded-lg shadow-lg z-10"
          >
            <DayPicker
              mode="single"
              selected={
                todoVM.startDate ? new Date(todoVM.startDate) : undefined
              }
              onSelect={(date) => {
                if (!date) return;
                const timeStr = todoVM.startDate
                  ? new Date(todoVM.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "00:00";
                const merged = mergeDateTime(date, timeStr);
                setTodoVM({ ...todoVM, startDate: merged.getTime() });
                setShowStartPicker(false);
              }}
              className="bg-[#111] text-white rounded-lg p-2"
              modifiersClassNames={{
                selected: "bg-green-400 text-black rounded",
                today: "border-green-400",
                disabled: "text-white/30",
                outside: "text-white/50",
              }}
            />
          </div>
        )}
        <input
          type="time"
          value={
            todoVM.startDate
              ? new Date(todoVM.startDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "00:00"
          }
          onChange={(e) => {
            const base = new Date(todoVM.startDate || Date.now());
            const merged = mergeDateTime(base, e.target.value);
            setTodoVM({ ...todoVM, startDate: merged.getTime() });
          }}
          className="p-2 rounded-lg border border-white/20 text-white"
        />
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-sm text-white/70">Due Date</label>
        <input
          type="text"
          readOnly
          value={
            todoVM.dueDate
              ? new Date(todoVM.dueDate).toLocaleDateString()
              : "Chọn hạn chót"
          }
          onClick={() => setShowDuePicker((s) => !s)}
          className="p-2 rounded-lg border border-white/20 text-white cursor-pointer"
        />
        {showDuePicker && (
          <div
            ref={duePickerRef}
            className="absolute top-full mt-2 border border-white/20 rounded-lg shadow-lg z-10"
          >
            <DayPicker
              mode="single"
              selected={todoVM.dueDate ? new Date(todoVM.dueDate) : undefined}
              onSelect={(date) => {
                if (!date) return;
                const timeStr = todoVM.dueDate
                  ? new Date(todoVM.dueDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "00:00";
                const merged = mergeDateTime(date, timeStr);
                setTodoVM({ ...todoVM, dueDate: merged.getTime() });
                setShowDuePicker(false);
              }}
              className="bg-[#111] text-white rounded-lg p-2"
              modifiersClassNames={{
                selected: "bg-green-400 text-black rounded",
                today: "border-green-400",
                disabled: "text-white/30",
                outside: "text-white/50",
              }}
            />
          </div>
        )}
        <input
          type="time"
          value={
            todoVM.dueDate
              ? new Date(todoVM.dueDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "00:00"
          }
          onChange={(e) => {
            const base = new Date(todoVM.dueDate || Date.now());
            const merged = mergeDateTime(base, e.target.value);
            setTodoVM({ ...todoVM, dueDate: merged.getTime() });
          }}
          className="p-2 rounded-lg border border-white/20 text-white"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">Tags (Optional)</label>

        {/* Hiển thị tags đã chọn */}
        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg border border-white/20 overflow-y-auto max-h-24 items-start">
          {todoVM.tags.length > 0 ? (
            todoVM.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-md"
                style={{
                  backgroundColor: tag.color,
                  color: getContrastColor(tag.color),
                }}
              >
                #{tag.text}
                <button
                  onClick={() =>
                    setTodoVM({
                      ...todoVM,
                      tags: todoVM.tags.filter((t) => t.id !== tag.id),
                    })
                  }
                  className="text-xs font-bold hover:scale-110"
                >
                  <LuX size={"0.75rem"} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-white/40 text-sm">Chưa chọn tag nào</span>
          )}
        </div>

        {/* Select để thêm tag */}
        <div className="relative">
          <select
            value=""
            onChange={(e) => {
              const tag = allTags.find((t) => t.id === e.target.value);
              if (tag) {
                setTodoVM({ ...todoVM, tags: [...todoVM.tags, tag] });
              }
            }}
            className={`${inputClass} appearance-none pr-8 w-full leading-tight`}
          >
            <option className="bg-[#111]" value="">
              + Thêm tag
            </option>
            {allTags
              .filter((tag) => !todoVM.tags.some((t) => t.id === tag.id))
              .map((tag) => (
                <option
                  key={tag.id}
                  value={tag.id}
                  className="text-white"
                  style={{
                    backgroundColor: tag.color,
                    color: getContrastColor(tag.color),
                  }}
                >
                  #{tag.text}
                </option>
              ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <LuChevronDown size="1rem" className="text-white" />
          </div>
        </div>
      </div>

      {/* Project */}
      <label className="text-sm text-white/70">Project (Optional)</label>
      <div className="relative">
        <select
          value={todoVM.project?.id || ""}
          onChange={(e) =>
            setTodoVM({
              ...todoVM,
              project: allProjects.find((p) => p.id === e.target.value),
            })
          }
          style={{
            backgroundColor: todoVM.project && todoVM.project.color,
            color: todoVM.project && getContrastColor(todoVM.project.color),
            borderColor: todoVM.project && "transparent",
          }}
          className={`${inputClass} appearance-none pr-8 w-full leading-tight`}
        >
          <option className="bg-[#111]" value="">
            Select project
          </option>
          {allProjects.map((p) => (
            <option
              key={p.id}
              value={p.id}
              style={{
                backgroundColor: p.color,
                color: getContrastColor(p.color),
              }}
            >
              {p.projectName}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <LuChevronDown
            size="1rem"
            style={{
              color: todoVM.project
                ? getContrastColor(todoVM.project.color)
                : "white",
            }}
          />
        </div>
      </div>

      {/* Description */}
      <label className="text-sm text-white/70">Description (Optional)</label>
      <textarea
        placeholder="Description"
        value={todoVM.description}
        onChange={(e) => setTodoVM({ ...todoVM, description: e.target.value })}
        className={inputClass}
      />
    </div>
  );
};

export default AddTodoPopover;
