import type { SelectHTMLAttributes } from "react";
import { useTranslation } from "../../i18n/useTranslation";

interface FieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export default function SelectField({ label, options, id, ...rest }: FieldProps) {
  const { t } = useTranslation();
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-ink mb-1.5">
        {t(label)}
      </label>
      <select
        id={selectId}
        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {t(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
