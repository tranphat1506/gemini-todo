import { useContext } from "react";
import { LanguageContext } from "./LanguageProvider";

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");

  return ctx;
};
