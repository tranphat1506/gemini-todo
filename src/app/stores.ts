import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auths/auth.slice";
import rightSidebarReducer from "@/features/ui/rightSidebar.slice";
import settingsReducer from "@/features/settings/settings.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rightSidebar: rightSidebarReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
