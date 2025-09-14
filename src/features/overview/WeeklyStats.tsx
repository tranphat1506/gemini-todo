import clsx from "clsx";

const weeklyData = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 1 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 2 },
  { day: "Sat", value: 4 },
  { day: "Sun", value: 6 },
];

// scale màu (0 = xám, càng nhiều càng xanh đậm)
const getColor = (value: number) => {
  if (value === 0) return "bg-neutral-800";
  if (value < 2) return "bg-green-200";
  if (value < 4) return "bg-green-400";
  if (value < 6) return "bg-green-600";
  return "bg-green-800";
};

const WeeklyStats = () => {
  return (
    <div className="bg-black p-6 sm:rounded-2xl mt-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Weekly Stats</h2>
      <div className="grid grid-cols-7 gap-2">
        {weeklyData.map((day, idx) => (
          <div
            key={idx}
            className={clsx(
              "w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium",
              getColor(day.value),
              day.value === 0 ? "text-gray-500" : "text-white"
            )}
            title={`${day.day}: ${day.value} tasks done`}
          >
            {day.day[0]}
          </div>
        ))}
      </div>
      <p className="text-gray-400 text-xs mt-3">
        Số lượng công việc hoàn thành trong 7 ngày qua
      </p>
    </div>
  );
};

export default WeeklyStats;
