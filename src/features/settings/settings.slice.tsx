import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SettingsState, NotificationSettings } from "./types";
import type { Language } from "../languages";

const initialState: SettingsState = {
  language: "vi",
  timeOffset: 0,
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    reminderMinutes: 10,
  },
  dateFormat: "dd/MM/yyyy",
  timeFormat: "24h",
  weekStartsOn: 1, // Monday
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setTimeOffset: (state, action: PayloadAction<number>) => {
      state.timeOffset = action.payload;
    },
    setNotifications: (
      state,
      action: PayloadAction<Partial<NotificationSettings>>
    ) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setDateFormat: (
      state,
      action: PayloadAction<"dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd">
    ) => {
      state.dateFormat = action.payload;
    },
    setTimeFormat: (state, action: PayloadAction<"12h" | "24h">) => {
      state.timeFormat = action.payload;
    },
    setWeekStartsOn: (state, action: PayloadAction<0 | 1>) => {
      state.weekStartsOn = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  setLanguage,
  setTimeOffset,
  setNotifications,
  setDateFormat,
  setTimeFormat,
  setWeekStartsOn,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
