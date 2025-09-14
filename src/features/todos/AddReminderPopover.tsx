import { getContrastColor } from "@/utils/color";
import type {
  ReminderLoop,
  ReminderViewModel,
  TagEntity,
  Weekday,
} from "./types";
import { LuChevronDown, LuX } from "react-icons/lu";

interface AddReminderPopoverProps {
  reminderVM: ReminderViewModel;
  setReminderVM: React.Dispatch<React.SetStateAction<ReminderViewModel>>;
  allTags?: TagEntity[];
}

const loopOptions: { key: string; label: string }[] = [
  { key: "none", label: "loop_none" },
  { key: "daily", label: "loop_daily" },
  { key: "weekly", label: "loop_weekly" },
  { key: "monthly", label: "loop_monthly" },
];

const AddReminderPopover: React.FC<AddReminderPopoverProps> = ({
  reminderVM,
  setReminderVM,
  allTags = [],
}) => {
  const inputClass =
    "p-2 rounded-lg border border-white/20 text-white outline-none focus:border-green-400";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-white/70">Title (*)</label>
      <input
        type="text"
        placeholder="Title"
        value={reminderVM.title}
        onChange={(e) =>
          setReminderVM({ ...reminderVM, title: e.target.value })
        }
        className={inputClass}
      />

      <label className="text-sm text-white/70">Time (*)</label>
      <input
        type="time"
        value={reminderVM.time}
        onChange={(e) => setReminderVM({ ...reminderVM, time: e.target.value })}
        className={inputClass}
      />

      {/* Reminder Loop */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">Repeat</label>
        <div className="relative">
          <select
            value={reminderVM.loop?.type ?? ""}
            onChange={(e) => {
              const type = e.target.value as ReminderLoop["type"] | "";
              if (type === "daily") {
                setReminderVM({ ...reminderVM, loop: { type: "daily" } });
              } else if (type === "weekly") {
                setReminderVM({
                  ...reminderVM,
                  loop: { type: "weekly", days: [] },
                });
              } else if (type === "monthly") {
                setReminderVM({
                  ...reminderVM,
                  loop: { type: "monthly", dates: [] },
                });
              } else {
                setReminderVM({ ...reminderVM, loop: undefined });
              }
            }}
            className={`${inputClass} appearance-none pr-8 w-full leading-normal`}
          >
            {loopOptions.map((option) => {
              return (
                <option
                  key={option.key}
                  value={option.key}
                  className="bg-[#111] capitalize"
                >
                  {option.label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <LuChevronDown size="1rem" className="text-white" />
          </div>
        </div>

        {/* Weekly picker */}
        {reminderVM.loop?.type === "weekly" &&
          (() => {
            const loop = reminderVM.loop;

            return (
              <div className="flex flex-wrap gap-2">
                {(
                  ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as Weekday[]
                ).map((day) => (
                  <button
                    key={day}
                    className={`px-3 py-1 rounded-lg border ${
                      loop.days.includes(day)
                        ? "bg-green-400 text-black"
                        : "border-white/30 text-white"
                    }`}
                    onClick={() => {
                      const days = loop.days.includes(day)
                        ? loop.days.filter((d) => d !== day)
                        : [...loop.days, day];
                      setReminderVM({
                        ...reminderVM,
                        loop: { type: "weekly", days },
                      });
                    }}
                  >
                    {day.toUpperCase()}
                  </button>
                ))}
              </div>
            );
          })()}

        {/* Monthly picker */}
        {reminderVM.loop?.type === "monthly" &&
          (() => {
            const loop = reminderVM.loop;

            return (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                  <button
                    key={date}
                    className={`px-2 py-1 rounded text-sm ${
                      loop.dates.includes(date)
                        ? "bg-green-400 text-black"
                        : "border border-white/30 text-white"
                    }`}
                    onClick={() => {
                      const dates = loop.dates.includes(date)
                        ? loop.dates.filter((d) => d !== date)
                        : [...loop.dates, date];
                      setReminderVM({
                        ...reminderVM,
                        loop: { type: "monthly", dates },
                      });
                    }}
                  >
                    {date}
                  </button>
                ))}
              </div>
            );
          })()}
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">Tags (Optional)</label>

        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg border border-white/20 overflow-y-auto max-h-24 items-start">
          {reminderVM.tags.length > 0 ? (
            reminderVM.tags.map((tag) => (
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
                    setReminderVM({
                      ...reminderVM,
                      tags: reminderVM.tags.filter((t) => t.id !== tag.id),
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

        <div className="relative">
          <select
            value=""
            onChange={(e) => {
              const tag = allTags.find((t) => t.id === e.target.value);
              if (tag) {
                setReminderVM({
                  ...reminderVM,
                  tags: [...reminderVM.tags, tag],
                });
              }
            }}
            className={`${inputClass} appearance-none pr-8 w-full leading-normal`}
          >
            <option className="bg-[#111]" value="">
              + Thêm tag
            </option>
            {allTags
              .filter((tag) => !reminderVM.tags.some((t) => t.id === tag.id))
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

      <label className="text-sm text-white/70">Description (Optional)</label>
      <textarea
        placeholder="Description"
        value={reminderVM.description}
        onChange={(e) =>
          setReminderVM({ ...reminderVM, description: e.target.value })
        }
        className={inputClass}
      />

      <label className="text-sm text-white/70">Place (Optional)</label>
      <input
        type="text"
        placeholder="Place"
        value={reminderVM.place}
        onChange={(e) =>
          setReminderVM({ ...reminderVM, place: e.target.value })
        }
        className={inputClass}
      />
    </div>
  );
};

export default AddReminderPopover;
