import type { InputHTMLAttributes } from "react";
import { useTranslation } from "../../i18n/useTranslation";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export default function TextField({ label, hint, id, ...rest }: FieldProps) {
  const { t } = useTranslation();
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
        {t(label)}
      </label>
      <input
        id={inputId}
        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors"
        {...rest}
      />
      {hint && <p className="text-xs text-ink-soft mt-1.5">{t(hint)}</p>}
    </div>
  );
}
