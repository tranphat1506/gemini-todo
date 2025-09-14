import { useState } from "react";
import { PiPlus, PiX } from "react-icons/pi";
import GlassCard from "@/components/GlassCard";
import { useMediaQuery } from "react-responsive";
import type {
  TodoViewModel,
  ReminderViewModel,
  TagEntity,
  ProjectViewModel,
} from "@/features/todos/types";
import { mockProjects, mockTags } from "./utils/mock.data.generator";

import {
  useFloating,
  offset,
  flip,
  shift,
  useDismiss,
  useClick,
  useRole,
  useInteractions,
  autoUpdate,
} from "@floating-ui/react";
import AddTodoPopoverContent from "./AddTodoPopover";
import AddReminderPopover from "./AddReminderPopover";
import AddTagPopover from "./AddTagPopover";
import AddProjectPopover from "./AddProjectPopover";

type Mode = "todo" | "reminder" | "project" | "tag";
const Modes: Mode[] = ["todo", "reminder", "project", "tag"];
const initialTodoVM: TodoViewModel = {
  id: crypto.randomUUID(),
  title: "",
  description: "",
  priority: "normal",
  startDate: Date.now(),
  dueDate: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  tags: [],
  tasks: [],
  project: undefined,
};

const initialReminderVM: ReminderViewModel = {
  id: crypto.randomUUID(),
  title: "",
  description: "",
  time: new Date()
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .split(" ")[0],
  place: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  tags: [],
  tasks: [],
};

const initialTagVM: TagEntity = {
  id: crypto.randomUUID(),
  text: "",
  color: "#000000",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const initialProjectVM: ProjectViewModel = {
  id: crypto.randomUUID(),
  projectName: "",
  color: "#000000",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export default function AddTodoButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("todo");

  const [todoVM, setTodoVM] = useState<TodoViewModel>(initialTodoVM);
  const [reminderVM, setReminderVM] =
    useState<ReminderViewModel>(initialReminderVM);
  const [tagVM, setTagVM] = useState<TagEntity>(initialTagVM);
  const [projectVM, setProjectVM] =
    useState<ProjectViewModel>(initialProjectVM);

  const handleClose = () => {
    setOpen(false);
    setMode("todo");
    setTodoVM({
      ...initialTodoVM,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setReminderVM({
      ...initialReminderVM,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setTagVM({
      ...initialTagVM,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setProjectVM({
      ...initialProjectVM,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const handleSave = () => {
    if (mode === "todo") console.log("Save TodoViewModel:", todoVM);
    else if (mode === "project")
      console.log("Save ProjectViewModel", projectVM);
    else if (mode === "tag") console.log("Save TagViewModel", tagVM);
    else console.log("Save ReminderViewModel:", reminderVM);
    handleClose(); // save xong thì clear luôn
  };

  const isMobile = useMediaQuery({ maxWidth: 640 }); // sm breakpoint

  // Floating UI (chỉ dùng cho desktop)
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: !isMobile && open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <div className="inline-block">
      <button
        ref={refs.setReference}
        {...(!isMobile ? getReferenceProps() : {})}
        onClick={() => setOpen(true)}
        className="bg-[#111] text-green-400 px-3 py-2 rounded-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
      >
        <PiPlus size={"1.25rem"} />
        Thêm công việc ngay
      </button>

      {open && (
        <>
          {/* Mobile full screen modal */}
          {isMobile ? (
            <GlassCard className="fixed inset-0 !z-100 !backdrop-blur-xl bg-black/20 flex flex-col p-4 text-white">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <PiX size={20} />
                </button>
                <div className="flex gap-2 flex-wrap justify-end">
                  {Modes.map((m) => (
                    <button
                      key={m}
                      className={`px-3 py-2 rounded capitalize ${
                        mode === m ? "bg-green-400 text-black" : "bg-[#222]"
                      }`}
                      onClick={() => setMode(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {mode === "todo" ? (
                  <AddTodoPopoverContent
                    todoVM={todoVM}
                    setTodoVM={setTodoVM}
                    allProjects={mockProjects}
                    allTags={mockTags}
                  />
                ) : (
                  <AddReminderPopover
                    reminderVM={reminderVM}
                    setReminderVM={setReminderVM}
                    allTags={mockTags}
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded border border-white/20 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-xl bg-[#111] text-green-400"
                >
                  Save
                </button>
              </div>
            </GlassCard>
          ) : (
            // Desktop floating popover
            <GlassCard
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="w-96 p-6 rounded-2xl shadow-lg z-100 !backdrop-blur-xl bg-black/20 text-white"
            >
              <div className="flex gap-2 mb-4">
                {Modes.map((m) => (
                  <button
                    key={m}
                    className={`px-4 py-2 rounded capitalize ${
                      mode === m
                        ? "bg-[#111] text-green-400"
                        : "border border-white/20 text-gray-300"
                    }`}
                    onClick={() => setMode(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {mode === "todo" ? (
                <AddTodoPopoverContent
                  todoVM={todoVM}
                  setTodoVM={setTodoVM}
                  allProjects={mockProjects}
                  allTags={mockTags}
                />
              ) : mode === "reminder" ? (
                <AddReminderPopover
                  reminderVM={reminderVM}
                  setReminderVM={setReminderVM}
                  allTags={mockTags}
                />
              ) : mode === "project" ? (
                <AddProjectPopover
                  projectVM={projectVM}
                  setProjectVM={setProjectVM}
                  allProjects={mockProjects}
                />
              ) : (
                <AddTagPopover
                  tagVM={tagVM}
                  setTagVM={setTagVM}
                  allTags={mockTags}
                />
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-4 rounded border border-white/20 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-4 rounded-xl bg-[#111] text-green-400"
                >
                  Save
                </button>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
