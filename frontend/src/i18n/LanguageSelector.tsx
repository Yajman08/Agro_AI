import { languages } from "./translations";
import { useTranslation } from "./useTranslation";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div>
      <label htmlFor="app-language" className="mb-1.5 block text-sm font-medium text-ink">
        {t("Language")}
      </label>
      <select
        id="app-language"
        value={language}
        onChange={(event) => setLanguage(event.target.value as (typeof languages)[number]["code"])}
        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-forest-500 focus:ring-1 focus:ring-forest-500"
      >
        {languages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}