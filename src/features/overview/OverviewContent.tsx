import clsx from "clsx";
import { FaRegClock, FaTasks, FaExclamationTriangle } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface OverviewProps {
  urgentTodos: number;
  todayTodos: number;
  completedToday: number;
  className?: string;
}

const OverviewContent: React.FC<OverviewProps> = ({
  urgentTodos,
  todayTodos,
  completedToday,
  className,
}) => {
  const progress =
    todayTodos > 0 ? Math.round((completedToday / todayTodos) * 100) : 0;

  const cards = [
    {
      title: "Ưu tiên cao",
      value: urgentTodos,
      icon: <FaExclamationTriangle className="text-red-400 text-2xl" />,
      border: "border-red-500/40",
    },
    {
      title: "Hôm nay",
      value: todayTodos,
      icon: <FaRegClock className="text-blue-400 text-2xl" />,
      border: "border-blue-500/40",
    },
    {
      title: "Tiến độ",
      value: `${progress}%`,
      custom: (
        <div className="w-14 h-14">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: "#22c55e",
              trailColor: "#1f2937",
              textSize: "28px",
            })}
          />
        </div>
      ),
      border: "border-green-500/40",
    },
  ];

  return (
    <div className={clsx("overview", className)}>
      <h2 className="font-semibold text-3xl mb-4 text-white">Tổng quan</h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {cards.map((c, i) => (
          <div
            key={i}
            className={clsx(
              "p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 transition flex flex-col items-center justify-center text-center shadow-sm",
              c.border
            )}
          >
            {c.custom ? (
              c.custom
            ) : (
              <div className="mb-2 flex items-center justify-center w-10 h-10">
                {c.icon}
              </div>
            )}
            <span className="text-xl font-bold text-white mt-1">{c.value}</span>
            <p className="text-sm text-gray-400">{c.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewContent;
