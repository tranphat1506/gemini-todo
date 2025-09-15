import type { Language } from "../languages";

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  reminderMinutes: number;
}

export interface SettingsState {
  language: Language;
  timeOffset: number;
  notifications: NotificationSettings;
  dateFormat: "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd";
  timeFormat: "12h" | "24h";
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
}
