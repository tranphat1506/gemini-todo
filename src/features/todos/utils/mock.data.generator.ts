import type {
  TodoEntity,
  TaskEntity,
  PomodoroSession,
  ReminderEntity,
  Tag,
  Project,
} from "../types";

// Utility: tạo id random
const uid = () => Math.random().toString(36).substring(2, 9);

// Utility: timestamp theo ngày
const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.getTime();
};

// ========== Mock Tags ==========
export const mockTags: Tag[] = [
  { id: "t1", text: "UI", color: "#3b82f6" },
  { id: "t2", text: "Backend", color: "#10b981" },
  { id: "t3", text: "Planning", color: "#f59e0b" },
  { id: "t4", text: "Research", color: "#8b5cf6" },
  { id: "t5", text: "Testing", color: "#ef4444" },
  { id: "t6", text: "Meeting", color: "#f97316" },
];

// ========== Mock Projects ==========
export const mockProjects: Project[] = [
  { id: "p1", projectName: "Hackathon App", color: "#06b6d4" },
  { id: "p2", projectName: "Study React", color: "#3b82f6" },
  { id: "p3", projectName: "Personal Goals", color: "#10b981" },
];

// Helper random
const randomFrom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomBool = (p = 0.5) => Math.random() < p;

// ========== Task & Session ==========
const createTask = (
  todoId: string,
  title: string,
  estimated: number,
  completed: number,
  isCompleted: boolean
): TaskEntity => ({
  id: uid(),
  todoId,
  title,
  estimatedPomodoros: estimated,
  completedPomodoros: completed,
  isCompleted,
  tagIds: randomBool(0.5) ? [randomFrom(mockTags).id] : [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const createPomodoroSession = (
  taskId: string,
  offsetMinutes: number,
  duration: number,
  status: "running" | "completed" | "interrupted" | "paused"
): PomodoroSession => {
  const startTime = Date.now() - offsetMinutes * 60 * 1000;
  return {
    id: uid(),
    taskId,
    startTime,
    endTime: startTime + duration * 60 * 1000,
    duration,
    status,
    createdAt: Date.now(),
  };
};

// ========== Mock Todos ==========
export const createMockTodos = (): {
  todos: TodoEntity[];
  tasks: TaskEntity[];
  sessions: PomodoroSession[];
} => {
  const sessions: PomodoroSession[] = [];
  const tasks: TaskEntity[] = [];

  // --- Quá khứ ---
  const todoPastId = uid();
  const taskPast1 = createTask(todoPastId, "Viết báo cáo dự án", 4, 4, true);
  const taskPast2 = createTask(todoPastId, "Chuẩn bị slide", 2, 2, true);
  tasks.push(taskPast1, taskPast2);

  sessions.push(
    createPomodoroSession(taskPast1.id, 200, 25, "completed"),
    createPomodoroSession(taskPast1.id, 180, 25, "completed"),
    createPomodoroSession(taskPast2.id, 150, 25, "completed")
  );

  const todoPast: TodoEntity = {
    id: todoPastId,
    title: "Hoàn thành báo cáo tuần trước",
    priority: "normal",
    startDate: daysFromNow(-10),
    dueDate: daysFromNow(-3),
    tagIds: [mockTags[2].id], // Planning
    projectId: mockProjects[0].id,
    createdAt: daysFromNow(-10),
    updatedAt: daysFromNow(-3),
  };

  // --- Hiện tại ---
  const todoNowId = uid();
  const taskNow1 = createTask(todoNowId, "Thiết kế UI", 3, 1, false);
  const taskNow2 = createTask(todoNowId, "API cơ bản", 2, 1, false);
  tasks.push(taskNow1, taskNow2);

  sessions.push(
    createPomodoroSession(taskNow1.id, 30, 25, "completed"),
    createPomodoroSession(taskNow2.id, 10, 25, "interrupted")
  );

  const todoNow: TodoEntity = {
    id: todoNowId,
    title: "Dự án Todo App Hackathon",
    priority: "high",
    startDate: daysFromNow(-1),
    dueDate: daysFromNow(0),
    tagIds: [mockTags[0].id, mockTags[1].id], // UI, Backend
    projectId: mockProjects[0].id,
    createdAt: daysFromNow(-1),
    updatedAt: Date.now(),
  };

  // --- Tương lai ---
  const todoFutureId = uid();
  const taskFuture1 = createTask(
    todoFutureId,
    "Viết tài liệu hướng dẫn",
    2,
    0,
    false
  );
  tasks.push(taskFuture1);

  const todoFuture: TodoEntity = {
    id: todoFutureId,
    title: "Chuẩn bị tài liệu hướng dẫn người dùng",
    priority: "normal",
    startDate: daysFromNow(0),
    dueDate: daysFromNow(5),
    tagIds: [mockTags[3].id], // Research
    projectId: mockProjects[1].id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return {
    todos: [todoPast, todoNow, todoFuture],
    tasks,
    sessions,
  };
};

// ========== Mock Reminders ==========
export const createMockReminders = (count: number = 1): ReminderEntity[] => {
  const reminders: ReminderEntity[] = [];

  for (let i = 0; i < count; i++) {
    reminders.push({
      id: uid(),
      title: `Nhắc nhở ${i + 1}`,
      description: "Chuẩn bị tài liệu trước khi họp",
      time: "9:00 AM",
      place: "Văn phòng",
      tagIds: [mockTags[5].id], // Meeting
      taskIds: [],
      createdAt: Date.now() - 1000 * 60 * 60 * (i + 1),
      updatedAt: Date.now(),
    });
  }

  return reminders;
};
