import type { ReactNode } from "react";
import { useTranslation } from "../../i18n/useTranslation";

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center px-4">
      {icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-50 text-forest-600">
          {icon}
        </span>
      )}
      <div>
        <p className="text-sm font-medium text-ink">{t(title)}</p>
        {description && <p className="text-sm text-ink-soft mt-1 max-w-xs">{t(description)}</p>}
      </div>
      {action}
    </div>
  );
}
