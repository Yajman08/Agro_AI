import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "../../lib/clsx";
import { useTranslation } from "../../i18n/useTranslation";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export default function Card({ children, className, padded = true, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-surface border border-line rounded-2xl shadow-soft",
        padded && "p-5 sm:p-6",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
          <h3 className="text-lg font-semibold text-ink">{t(title)}</h3>
          {subtitle && <p className="text-sm text-ink-soft mt-0.5">{t(subtitle)}</p>}
      </div>
      {action}
    </div>
  );
}
