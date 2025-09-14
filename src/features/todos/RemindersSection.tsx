import { useEffect, useState } from "react";
import type { ReminderViewModel } from "./types";
import ReminderCard from "./ReminderCard";
import { Link } from "react-router";

interface RemindersSectionProps {
  reminders: ReminderViewModel[];
}

const RemindersSection: React.FC<RemindersSectionProps> = ({ reminders }) => {
  const [maxItems, setMaxItems] = useState(1);

  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;
      if (width >= 1024) setMaxItems(4); // lg
      else setMaxItems(2); // sm
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const visibleReminders = reminders.slice(0, maxItems);

  return (
    <div className="reminders sm:bg-[#111] sm:p-6 mb-6 sm:mb-2 sm:rounded-2xl flex flex-col gap-4">
      <div className="flex gap-4 justify-between items-end">
        <h2 className="title font-semibold text-3xl">Nhắc nhở</h2>
        <Link to={"/todos"} className="todos-all text-md hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div
        className="
          grid gap-4
          grid-cols-1 lg:grid-cols-2
        "
      >
        {visibleReminders.map((r) => (
          <ReminderCard key={r.id} r={r} />
        ))}
      </div>
    </div>
  );
};

export default RemindersSection;
