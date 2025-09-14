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
  startDate: undefined, // Changed to optional
  dueDate: undefined, // Changed to optional
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
  color: "#3b82f6",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const initialProjectVM: ProjectViewModel = {
  id: crypto.randomUUID(),
  projectName: "",
  color: "#06b6d4",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

interface ValidationError {
  field: string;
  message: string;
}

export default function AddTodoButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("todo");
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const [todoVM, setTodoVM] = useState<TodoViewModel>(initialTodoVM);
  const [reminderVM, setReminderVM] =
    useState<ReminderViewModel>(initialReminderVM);
  const [tagVM, setTagVM] = useState<TagEntity>(initialTagVM);
  const [projectVM, setProjectVM] =
    useState<ProjectViewModel>(initialProjectVM);

  const resetForms = () => {
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
    setErrors([]);
  };

  const handleClose = () => {
    setOpen(false);
    setMode("todo");
    resetForms();
  };

  const validateTodo = (todo: TodoViewModel): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!todo.title.trim()) {
      errors.push({ field: "title", message: "Tiêu đề là bắt buộc" });
    }

    // Start date và due date validation (optional nhưng nếu có thì phải hợp lệ)
    if (todo.startDate && todo.dueDate && todo.startDate > todo.dueDate) {
      errors.push({
        field: "dates",
        message: "Ngày bắt đầu không thể sau ngày kết thúc",
      });
    }

    return errors;
  };

  const validateReminder = (reminder: ReminderViewModel): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!reminder.title.trim()) {
      errors.push({ field: "title", message: "Tiêu đề là bắt buộc" });
    }

    if (!reminder.time.trim()) {
      errors.push({ field: "time", message: "Thời gian là bắt buộc" });
    }

    return errors;
  };

  const validateTag = (tag: TagEntity): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!tag.text.trim()) {
      errors.push({ field: "text", message: "Tên thẻ là bắt buộc" });
    } else {
      // Check for duplicate tag name
      const isDuplicate = mockTags.some(
        (existingTag) =>
          existingTag.text.toLowerCase() === tag.text.trim().toLowerCase()
      );
      if (isDuplicate) {
        errors.push({
          field: "text",
          message: "Tên thẻ đã tồn tại. Vui lòng chọn tên khác",
        });
      }
    }

    if (!tag.color.trim()) {
      errors.push({ field: "color", message: "Màu là bắt buộc" });
    }

    return errors;
  };

  const validateProject = (project: ProjectViewModel): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!project.projectName.trim()) {
      errors.push({ field: "projectName", message: "Tên dự án là bắt buộc" });
    } else {
      // Check for duplicate project name
      const isDuplicate = mockProjects.some(
        (existingProject) =>
          existingProject.projectName.toLowerCase() ===
          project.projectName.trim().toLowerCase()
      );
      if (isDuplicate) {
        errors.push({
          field: "projectName",
          message: "Tên dự án đã tồn tại. Vui lòng chọn tên khác",
        });
      }
    }

    if (!project.color.trim()) {
      errors.push({ field: "color", message: "Màu là bắt buộc" });
    }

    return errors;
  };

  const handleCreateNew = () => {
    let validationErrors: ValidationError[] = [];

    switch (mode) {
      case "todo":
        validationErrors = validateTodo(todoVM);
        if (validationErrors.length === 0) {
          console.log("Save TodoViewModel:", todoVM);
        }
        break;
      case "reminder":
        validationErrors = validateReminder(reminderVM);
        if (validationErrors.length === 0) {
          console.log("Save ReminderViewModel:", reminderVM);
        }
        break;
      case "tag":
        validationErrors = validateTag(tagVM);
        if (validationErrors.length === 0) {
          console.log("Save TagViewModel:", tagVM);
        }
        break;
      case "project":
        validationErrors = validateProject(projectVM);
        if (validationErrors.length === 0) {
          console.log("Save ProjectViewModel:", projectVM);
        }
        break;
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If validation passes, save and close
    setErrors([]);
    handleClose();
  };

  // Helper function to get error message for a field
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  const isMobile = useMediaQuery({ maxWidth: 640 });

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
                  onClick={handleClose}
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
                      onClick={() => {
                        setMode(m);
                        setErrors([]); // Clear errors when switching modes
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-400 text-sm">
                      • {error.message}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {mode === "todo" && (
                  <AddTodoPopoverContent
                    todoVM={todoVM}
                    setTodoVM={setTodoVM}
                    allProjects={mockProjects}
                    allTags={mockTags}
                    getFieldError={getFieldError}
                  />
                )}
                {mode === "reminder" && (
                  <AddReminderPopover
                    reminderVM={reminderVM}
                    setReminderVM={setReminderVM}
                    allTags={mockTags}
                    getFieldError={getFieldError}
                  />
                )}
                {mode === "tag" && (
                  <AddTagPopover
                    tagVM={tagVM}
                    setTagVM={setTagVM}
                    allTags={mockTags}
                    getFieldError={getFieldError}
                  />
                )}
                {mode === "project" && (
                  <AddProjectPopover
                    projectVM={projectVM}
                    setProjectVM={setProjectVM}
                    allProjects={mockProjects}
                    getFieldError={getFieldError}
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded border border-white/20 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNew}
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
                    onClick={() => {
                      setMode(m);
                      setErrors([]); // Clear errors when switching modes
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Error Display */}
              {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-400 text-sm">
                      • {error.message}
                    </p>
                  ))}
                </div>
              )}

              {mode === "todo" && (
                <AddTodoPopoverContent
                  todoVM={todoVM}
                  setTodoVM={setTodoVM}
                  allProjects={mockProjects}
                  allTags={mockTags}
                  getFieldError={getFieldError}
                />
              )}
              {mode === "reminder" && (
                <AddReminderPopover
                  reminderVM={reminderVM}
                  setReminderVM={setReminderVM}
                  allTags={mockTags}
                  getFieldError={getFieldError}
                />
              )}
              {mode === "project" && (
                <AddProjectPopover
                  projectVM={projectVM}
                  setProjectVM={setProjectVM}
                  allProjects={mockProjects}
                  getFieldError={getFieldError}
                />
              )}
              {mode === "tag" && (
                <AddTagPopover
                  tagVM={tagVM}
                  setTagVM={setTagVM}
                  allTags={mockTags}
                  getFieldError={getFieldError}
                />
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-4 rounded border border-white/20 text-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-4 rounded-xl bg-[#111] text-green-400"
                >
                  Tạo mới
                </button>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
