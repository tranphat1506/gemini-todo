// ===================================================
// Shared types
// ===================================================

export type Priority = "high" | "normal";
export const priorityList: { priority: Priority; color: string }[] = [
  {
    priority: "high",
    color: "#fb2c36",
  },
  {
    priority: "normal",
    color: "#4a5565",
  },
];
export interface TagEntity {
  id: string;
  text: string;
  color: string;
  createdAt: number; // timestamp ms
  updatedAt: number; // timestamp ms
}

export interface ProjectEntity {
  id: string;
  projectName: string;
  color: string;
  createdAt: number; // timestamp ms
  updatedAt: number; // timestamp ms
}

// ===================================================
// Entity Layer (Firestore schema)
// ===================================================

// Task nhỏ bên trong Todo
export interface TaskEntity {
  id: string;
  todoId: string;
  title: string;
  description?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  tagIds?: string[];
  createdAt: number; // timestamp ms
  updatedAt: number; // timestamp ms
}

// Todo lớn
export interface TodoEntity {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  startDate: number;
  dueDate?: number;
  tagIds?: string[];
  createdAt: number;
  updatedAt: number;

  projectId?: string;
}

// Một lần Pomodoro
export interface PomodoroSession {
  id: string;
  taskId: string; // reference đến Task
  startTime: number;
  endTime: number;
  duration: number;
  status: "running" | "completed" | "interrupted" | "paused";
  createdAt: number;
}

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type ReminderLoop =
  | { type: "daily" }
  | { type: "weekly"; days: Weekday[] }
  | { type: "monthly"; dates: number[] };

export interface ReminderEntity {
  id: string;
  title: string;
  description?: string;
  loop?: ReminderLoop;
  time: string; // "09:00 AM"
  place?: string;
  tagIds?: string[];
  taskIds?: string[];
  createdAt: number;
  updatedAt: number;
}

// ===================================================
// ViewModel Layer (UI ready)
// ===================================================

export interface TaskViewModel extends Omit<TaskEntity, "tagIds"> {
  tags: TagEntity[];
}

export interface TodoViewModel extends Omit<TodoEntity, "tagIds"> {
  tags: TagEntity[];
  tasks: TaskViewModel[];
  project?: ProjectEntity;
}

export interface ReminderViewModel
  extends Omit<ReminderEntity, "tagIds" | "taskIds"> {
  tags: TagEntity[];
  tasks: TaskViewModel[];
}

export interface ProjectViewModel extends ProjectEntity {}
