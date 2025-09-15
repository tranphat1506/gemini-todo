import type {
  TagEntity,
  TaskEntity,
  TaskViewModel,
  TodoEntity,
  TodoViewModel,
  ReminderEntity,
  ReminderViewModel,
  ProjectEntity,
  ProjectViewModel,
} from "../types";

// =======================================
// Helper
// =======================================

// Resolve tagIds -> Tag[]
const resolveTags = (
  tagIds: string[] | undefined,
  allTags: TagEntity[]
): TagEntity[] => {
  if (!tagIds || tagIds.length === 0) return [];
  return allTags.filter((tag) => tagIds.includes(tag.id));
};

// =======================================
// Task
// =======================================

export function toTaskViewModel(
  entity: TaskEntity,
  allTags: TagEntity[]
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
  allTags: TagEntity[],
  allProjects: ProjectEntity[]
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
  allTags: TagEntity[]
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

export function toProjectViewModel(project: ProjectEntity): ProjectViewModel {
  return { ...project };
}
