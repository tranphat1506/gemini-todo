import enLocale from "./locales/en.json";
import viLocale from "./locales/vi.json";

export type Language = "vi" | "en";
export type TranslationKeys = keyof typeof viLocale;

export const locales: Record<Language, typeof viLocale> = {
  vi: viLocale,
  en: enLocale,
};

export type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKeys) => string;
};
