import { getContrastColor } from "@/utils/color";
import type {
  ReminderLoop,
  ReminderViewModel,
  TagEntity,
  Weekday,
} from "./types";
import { LuChevronDown, LuX } from "react-icons/lu";
import clsx from "clsx";

interface AddReminderPopoverProps {
  reminderVM: ReminderViewModel;
  setReminderVM: React.Dispatch<React.SetStateAction<ReminderViewModel>>;
  allTags?: TagEntity[];
  getFieldError?: (fieldName: string) => string | undefined;
}

const loopOptions: { key: string; label: string }[] = [
  { key: "none", label: "Không lặp lại" },
  { key: "daily", label: "Hàng ngày" },
  { key: "weekly", label: "Hàng tuần" },
  { key: "monthly", label: "Hàng tháng" },
];

const AddReminderPopover: React.FC<AddReminderPopoverProps> = ({
  reminderVM,
  setReminderVM,
  allTags = [],
  getFieldError,
}) => {
  const inputClass =
    "p-2 rounded-lg border border-white/20 text-white outline-none focus:border-green-400";
  const errorInputClass =
    "p-2 rounded-lg border border-red-500 text-white outline-none focus:border-red-400";

  const titleError = getFieldError?.("title");
  const timeError = getFieldError?.("time");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-white/70">
        Title <span className="text-red-400">*</span>
      </label>
      <input
        type="text"
        placeholder="Nhập tiêu đề nhắc nhở..."
        value={reminderVM.title}
        onChange={(e) =>
          setReminderVM({ ...reminderVM, title: e.target.value })
        }
        className={clsx(titleError ? errorInputClass : inputClass)}
      />
      {titleError && <p className="text-red-400 text-xs">{titleError}</p>}

      <label className="text-sm text-white/70">
        Time <span className="text-red-400">*</span>
      </label>
      <input
        type="time"
        value={reminderVM.time}
        onChange={(e) => setReminderVM({ ...reminderVM, time: e.target.value })}
        className={clsx(timeError ? errorInputClass : inputClass)}
      />
      {timeError && <p className="text-red-400 text-xs">{timeError}</p>}

      {/* Quick Time Presets */}
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="text-xs text-white/50">Thời gian thường dùng:</span>
        {["08:00", "12:00", "15:00", "18:00", "20:00"].map((time) => (
          <button
            key={time}
            onClick={() => setReminderVM({ ...reminderVM, time })}
            className={clsx(
              "px-2 py-1 text-xs rounded border transition-colors",
              reminderVM.time === time
                ? "bg-green-400 text-black border-green-400"
                : "border-white/30 text-white hover:border-green-400"
            )}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Reminder Loop */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">Lặp lại</label>
        <div className="relative">
          <select
            value={reminderVM.loop?.type ?? "none"}
            onChange={(e) => {
              const type = e.target.value as ReminderLoop["type"] | "none";
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
            {loopOptions.map((option) => (
              <option
                key={option.key}
                value={option.key}
                className="bg-[#111] capitalize"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <LuChevronDown size="1rem" className="text-white" />
          </div>
        </div>

        {/* Weekly picker */}
        {reminderVM.loop?.type === "weekly" &&
          (() => {
            const loop = reminderVM.loop;
            const weekdayLabels = {
              sun: "CN",
              mon: "T2",
              tue: "T3",
              wed: "T4",
              thu: "T5",
              fri: "T6",
              sat: "T7",
            };

            return (
              <div>
                <p className="text-xs text-white/50 mb-2">
                  Chọn các ngày trong tuần:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "mon",
                      "tue",
                      "wed",
                      "thu",
                      "fri",
                      "sat",
                      "sun",
                    ] as Weekday[]
                  ).map((day) => (
                    <button
                      key={day}
                      className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                        loop.days.includes(day)
                          ? "bg-green-400 text-black border-green-400"
                          : "border-white/30 text-white hover:border-green-400"
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
                      {weekdayLabels[day]}
                    </button>
                  ))}
                </div>
                {loop.days.length === 0 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Vui lòng chọn ít nhất một ngày trong tuần
                  </p>
                )}
              </div>
            );
          })()}

        {/* Monthly picker */}
        {reminderVM.loop?.type === "monthly" &&
          (() => {
            const loop = reminderVM.loop;

            return (
              <div>
                <p className="text-xs text-white/50 mb-2">
                  Chọn các ngày trong tháng:
                </p>
                <div className="grid grid-cols-7 gap-1 max-h-32 overflow-y-auto">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                    <button
                      key={date}
                      className={`px-2 py-1 rounded text-sm transition-colors ${
                        loop.dates.includes(date)
                          ? "bg-green-400 text-black"
                          : "border border-white/30 text-white hover:border-green-400"
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
                {loop.dates.length === 0 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Vui lòng chọn ít nhất một ngày trong tháng
                  </p>
                )}
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
        placeholder="Mô tả chi tiết về nhắc nhở..."
        value={reminderVM.description}
        onChange={(e) =>
          setReminderVM({ ...reminderVM, description: e.target.value })
        }
        className={inputClass}
        rows={3}
      />

      <label className="text-sm text-white/70">Place (Optional)</label>
      <input
        type="text"
        placeholder="Địa điểm (ví dụ: Văn phòng, Nhà, ...)"
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
