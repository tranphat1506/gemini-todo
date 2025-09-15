import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auths/auth.slice";
import rightSidebarReducer from "@/features/ui/rightSidebar.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rightSidebar: rightSidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
