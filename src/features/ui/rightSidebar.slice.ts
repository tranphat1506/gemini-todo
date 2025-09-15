// src/features/ui/rightSidebar.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  TagEntity,
  ProjectEntity,
  TodoViewModel,
  ReminderViewModel,
} from "@/features/todos/types";

export type RightSidebarContent =
  | { type: "closed" }
  | {
      type: "tag";
      tag: TagEntity;
      todos: TodoViewModel[];
      reminders: ReminderViewModel[];
    }
  | { type: "project"; project: ProjectEntity; todos: TodoViewModel[] }
  | { type: "todo-detail"; todo: TodoViewModel }
  | { type: "reminder-detail"; reminder: ReminderViewModel }
  | {
      type: "search-results";
      query: string;
      todos: TodoViewModel[];
      reminders: ReminderViewModel[];
    };

interface RightSidebarState {
  isOpen: boolean;
  content: RightSidebarContent;
  history: RightSidebarContent[];
}

const initialState: RightSidebarState = {
  isOpen: false,
  content: { type: "closed" },
  history: [],
};

const rightSidebarSlice = createSlice({
  name: "rightSidebar",
  initialState,
  reducers: {
    openSidebar: (state, action: PayloadAction<RightSidebarContent>) => {
      if (state.content.type !== "closed") {
        state.history.push(state.content);
      }
      state.content = action.payload;
      state.isOpen = true;
    },

    closeSidebar: (state) => {
      state.isOpen = false;
      state.content = { type: "closed" };
      state.history = [];
    },

    goBack: (state) => {
      if (state.history.length > 0) {
        state.content = state.history.pop()!;
      } else {
        state.isOpen = false;
        state.content = { type: "closed" };
      }
    },

    showTagDetails: (
      state,
      action: PayloadAction<{
        tag: TagEntity;
        todos: TodoViewModel[];
        reminders: ReminderViewModel[];
      }>
    ) => {
      if (state.content.type !== "closed") {
        state.history.push(state.content);
      }
      state.content = {
        type: "tag",
        tag: action.payload.tag,
        todos: action.payload.todos,
        reminders: action.payload.reminders,
      };
      state.isOpen = true;
    },

    showProjectDetails: (
      state,
      action: PayloadAction<{
        project: ProjectEntity;
        todos: TodoViewModel[];
      }>
    ) => {
      if (state.content.type !== "closed") {
        state.history.push(state.content);
      }
      state.content = {
        type: "project",
        project: action.payload.project,
        todos: action.payload.todos,
      };
      state.isOpen = true;
    },

    showTodoDetails: (state, action: PayloadAction<TodoViewModel>) => {
      if (state.content.type !== "closed") {
        state.history.push(state.content);
      }
      state.content = {
        type: "todo-detail",
        todo: action.payload,
      };
      state.isOpen = true;
    },

    showReminderDetails: (state, action: PayloadAction<ReminderViewModel>) => {
      if (state.content.type !== "closed") {
        state.history.push(state.content);
      }
      state.content = {
        type: "reminder-detail",
        reminder: action.payload,
      };
      state.isOpen = true;
    },

    showSearchResults: (
      state,
      action: PayloadAction<{
        query: string;
        todos: TodoViewModel[];
        reminders: ReminderViewModel[];
      }>
    ) => {
      if (state.content.type !== "closed") {
        state.history.push(state.content);
      }
      state.content = {
        type: "search-results",
        query: action.payload.query,
        todos: action.payload.todos,
        reminders: action.payload.reminders,
      };
      state.isOpen = true;
    },
  },
});

export const {
  openSidebar,
  closeSidebar,
  goBack,
  showTagDetails,
  showProjectDetails,
  showTodoDetails,
  showReminderDetails,
  showSearchResults,
} = rightSidebarSlice.actions;

export default rightSidebarSlice.reducer;
