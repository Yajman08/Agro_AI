import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { languageDirection, languages, translate } from "./translations";
import type { LanguageCode, TranslationKey } from "./translations";
import { LanguageContext } from "./languageContextStore";

const LANGUAGE_STORAGE_KEY = "agrinexus.language";

function readLanguage(): LanguageCode {
  try {
    const code = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return languages.some((language) => language.code === code) ? (code as LanguageCode) : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(readLanguage);

  const setLanguage = useCallback((nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // Continue in the selected language for this session if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languageDirection(language);
  }, [language]);

  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}