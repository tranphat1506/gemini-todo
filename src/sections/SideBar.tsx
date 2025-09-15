import IconButton from "@/components/IconButton";
import clsx from "clsx";
import { RiMenuFold2Line, RiHome9Fill, RiMenuLine } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { LuAlarmClockCheck } from "react-icons/lu";
import { PiUserBold } from "react-icons/pi";
import { Link, useNavigate, useLocation } from "react-router";
import {
  RiSettings3Line,
  RiQuestionLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { useAppSelector } from "@/hooks/storeHooks";
import { lazy, Suspense, useMemo, useState } from "react";
import {
  createMockReminders,
  createMockTodos,
  mockProjects,
  mockTags,
} from "@/features/todos/utils/mock.data.generator";
import { getContrastColor } from "@/utils/color";
const Avatar = lazy(() => import("@/components/Avatar"));
import { useAppDispatch } from "@/hooks/storeHooks";
import { showTagDetails } from "@/features/ui/rightSidebar.slice";
import type {
  ReminderViewModel,
  TagEntity,
  TodoViewModel,
} from "@/features/todos/types";
import {
  toReminderViewModel,
  toTodoViewModel,
} from "@/features/todos/utils/mappers";
interface SideBarProps {
  className?: string;
}

const navItems = [
  { name: "Home", path: "/", icon: <RiHome9Fill size="1.25rem" /> },
  { name: "Todos", path: "/todos", icon: <FaTasks size="1.25rem" /> },
  {
    name: "Pomodoro",
    path: "/pomodoro",
    icon: <LuAlarmClockCheck size="1.25rem" />,
  },
  { name: "Profile", path: "/profile", icon: <PiUserBold size="1.25rem" /> },
];

const SideBar: React.FC<SideBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const tags = useMemo(() => {
    return mockTags;
  }, []);
  const dispatch = useAppDispatch();
  const allTodos = useMemo(() => {
    return createMockTodos();
  }, []);
  const allReminders = useMemo(() => {
    return createMockReminders(10);
  }, []);
  const handleTagClick = (tag: TagEntity) => {
    const todosWithTag: TodoViewModel[] = allTodos.todos
      .filter((t) => t.tagIds?.includes(tag.id))
      .map((t) => toTodoViewModel(t, allTodos.tasks, mockTags, mockProjects));
    const remindersWithTag: ReminderViewModel[] = allReminders
      .filter((t) => t.tagIds?.includes(tag.id))
      .map((r) => toReminderViewModel(r, allTodos.tasks, mockTags));

    dispatch(
      showTagDetails({
        tag,
        todos: todosWithTag,
        reminders: remindersWithTag,
      })
    );
  };
  return (
    <div
      className={clsx(
        "bg-[#111] rounded-2xl my-4 ml-4 text-white flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-52 lg:w-72",
        className
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center justify-between mb-8 p-4 ",
          isCollapsed ? "justify-center" : ""
        )}
      >
        {!isCollapsed && (
          <Link to={"/"}>
            <h1 className="text-2xl font-bold whitespace-nowrap">
              Gemini<span className="text-green-400">Todo.</span>
            </h1>
          </Link>
        )}
        <IconButton
          icon={
            isCollapsed ? (
              <RiMenuLine size={"1.5rem"} />
            ) : (
              <RiMenuFold2Line size={"1.5rem"} />
            )
          }
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* MAIN MENU */}
      <div className="flex flex-col gap-2 mb-6">
        {!isCollapsed && (
          <h3 className="px-4 text-sm font-semibold text-gray-400 mb-2">
            MAIN MENU
          </h3>
        )}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                "flex items-center gap-3 rounded-xl py-2 font-medium transition-colors hover:!text-white",
                isActive ? "text-white" : "text-gray-400"
              )}
            >
              <span
                className={clsx(
                  "flex items-center",
                  isActive ? "text-white" : "text-gray-400"
                )}
              >
                <div
                  className={clsx(
                    "flex justify-start mr-6",
                    isCollapsed ? "mr-7" : ""
                  )}
                >
                  {isActive && (
                    <div className="h-6 w-0.5 rounded-full bg-green-400" />
                  )}
                </div>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </div>

      {/* PROJECTS */}
      {!isCollapsed && (
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 px-4">
            PROJECTS {`(${mockProjects.length})`}
          </h3>
          {mockProjects.map((project) => {
            const isActive = location.pathname === "/todos";
            return (
              <button
                key={project.id}
                className="flex items-center gap-3 py-2 font-medium hover:bg-neutral-800"
              >
                <div className="flex justify-start items-center">
                  {isActive && (
                    <div className="h-6 w-0.5 rounded-full bg-green-400" />
                  )}
                  <div
                    className="w-4 h-4 rounded-full ml-6"
                    style={{
                      backgroundColor: project.color,
                      border: `1px solid ${getContrastColor(project.color)}`,
                    }}
                  />
                </div>

                <span>{project.projectName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* TAGS */}
      {!isCollapsed && (
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 px-4">
            TAGS {`(${tags.length})`}
          </h3>
          <div className="flex flex-wrap gap-2 px-4">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full text-sm font-medium text-white hover:scale-[1.085] transition-transform"
                style={{
                  backgroundColor: tag.color,
                  color: getContrastColor(tag.color),
                }}
              >
                #{tag.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER AREA */}
      <div className="mt-auto border-t border-neutral-800 pt-4 flex flex-col gap-2 px-4">
        <button
          className={clsx(
            "flex items-center gap-2 text-md text-gray-400 hover:text-white px-2 py-2 rounded-lg",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <RiSettings3Line size={"1.25rem"} />
          {!isCollapsed && <span>Settings</span>}
        </button>

        <button
          className={clsx(
            "flex items-center gap-2 text-md text-gray-400 hover:text-white px-2 py-2 rounded-lg",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <RiQuestionLine size={"1.25rem"} />
          {!isCollapsed && <span>FAQs</span>}
        </button>

        {/* Avatar Card */}
        <div
          className={clsx(
            "flex items-center bg-neutral-900 rounded-xl mt-3 cursor-pointer hover:bg-neutral-800",
            isCollapsed ? "justify-center p-1" : "gap-3 p-3"
          )}
        >
          <Avatar photoURL={user!.photoURL!} displayName={user!.displayName!} />

          {!isCollapsed && (
            <>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {user?.displayName || "Guest User"}
                </span>
              </div>
              <RiArrowDownSLine size={18} className="ml-auto text-gray-400" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
