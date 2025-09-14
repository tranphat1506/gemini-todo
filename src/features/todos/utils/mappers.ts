import type {
  Tag,
  TaskEntity,
  TaskViewModel,
  TodoEntity,
  TodoViewModel,
  ReminderEntity,
  ReminderViewModel,
  Project,
  ProjectViewModel,
} from "../types";

// =======================================
// Helper
// =======================================

// Resolve tagIds -> Tag[]
const resolveTags = (tagIds: string[] | undefined, allTags: Tag[]): Tag[] => {
  if (!tagIds || tagIds.length === 0) return [];
  return allTags.filter((tag) => tagIds.includes(tag.id));
};

// =======================================
// Task
// =======================================

export function toTaskViewModel(
  entity: TaskEntity,
  allTags: Tag[]
): TaskViewModel {
  return {
    ...entity,
    tags: resolveTags(entity.tagIds, allTags),
  };
}

// =======================================
// Todo
// =======================================

export function toTodoViewModel(
  entity: TodoEntity,
  taskEntities: TaskEntity[],
  allTags: Tag[],
  allProjects: Project[]
): TodoViewModel {
  const tasks = taskEntities
    .filter((t) => t.todoId === entity.id)
    .map((t) => toTaskViewModel(t, allTags));

  const project = entity.projectId
    ? allProjects.find((p) => p.id === entity.projectId)
    : undefined;

  return {
    ...entity,
    tags: resolveTags(entity.tagIds, allTags),
    tasks,
    project,
  };
}

// =======================================
// Reminder
// =======================================

export function toReminderViewModel(
  entity: ReminderEntity,
  taskEntities: TaskEntity[],
  allTags: Tag[]
): ReminderViewModel {
  const tasks = entity.taskIds
    ? taskEntities
        .filter((t) => entity.taskIds!.includes(t.id))
        .map((t) => toTaskViewModel(t, allTags))
    : [];

  return {
    ...entity,
    tags: resolveTags(entity.tagIds, allTags),
    tasks,
  };
}

export function toProjectViewModel(project: Project): ProjectViewModel {
  return { ...project };
}
