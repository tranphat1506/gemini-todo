import React from "react";
import clsx from "clsx";
import { useAppSelector, useAppDispatch } from "@/hooks/storeHooks";
import { closeSidebar, goBack } from "@/features/ui/rightSidebar.slice";
import IconButton from "@/components/IconButton";
import { RiCloseLine, RiArrowLeftLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import TagDetailsView from "./RightSideBar/TagDetailsView";
import ProjectDetailsView from "./RightSideBar/ProjectDetailsView";
import TodoDetailsView from "./RightSideBar/TodoDetailsView";
import ReminderDetailsView from "./RightSideBar/ReminderDetailsView";
import SearchResultsView from "./RightSideBar/SearchResultsView";

interface RightSideBarProps {
  className?: string;
}

const RightSideBar: React.FC<RightSideBarProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { isOpen, content, history } = useAppSelector(
    (state) => state.rightSidebar
  );

  const handleClose = () => {
    dispatch(closeSidebar());
  };

  const handleGoBack = () => {
    dispatch(goBack());
  };

  const renderContent = () => {
    switch (content.type) {
      case "tag":
        return (
          <TagDetailsView
            tag={content.tag}
            todos={content.todos}
            reminders={content.reminders}
          />
        );
      case "project":
        return (
          <ProjectDetailsView project={content.project} todos={content.todos} />
        );
      case "todo-detail":
        return <TodoDetailsView todo={content.todo} />;
      case "reminder-detail":
        return <ReminderDetailsView reminder={content.reminder} />;
      case "search-results":
        return (
          <SearchResultsView
            query={content.query}
            todos={content.todos}
            reminders={content.reminders}
          />
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (content.type) {
      case "tag":
        return `Thẻ: #${content.tag.text}`;
      case "project":
        return content.project.projectName;
      case "todo-detail":
        return content.todo.title;
      case "reminder-detail":
        return content.reminder.title;
      case "search-results":
        return `Tìm kiếm: "${content.query}"`;
      default:
        return "Chi tiết";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={clsx(
            "bg-[#111] text-white flex flex-col",
            // Desktop styles
            "md:rounded-2xl md:my-4 md:mr-4 md:w-80 lg:md:w-96",
            // Mobile styles
            "max-md:w-full max-md:h-full max-md:m-0 max-md:rounded-none",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              {history.length > 0 && (
                <IconButton
                  icon={<RiArrowLeftLine size="1.25rem" />}
                  onClick={handleGoBack}
                  className="text-gray-400 hover:text-white"
                />
              )}
              <h2 className="text-lg font-semibold truncate">{getTitle()}</h2>
            </div>
            <IconButton
              icon={<RiCloseLine size="1.5rem" />}
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RightSideBar;
