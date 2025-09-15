import React, { createContext, useEffect, useState } from "react";
import {
  type Language,
  type LanguageContextType,
  locales,
  type TranslationKeys,
} from "./LanguageTypes";
export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children?: React.ReactNode;
}
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  // Get lang in local
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("@lang") as Language) || "vi"
  );

  useEffect(() => {
    localStorage.setItem("@lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "vi" : "en"));
  };

  const t = (key: TranslationKeys) => {
    return locales[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
