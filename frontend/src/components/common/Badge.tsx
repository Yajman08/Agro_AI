import type { ReactNode } from "react";
import { clsx } from "../../lib/clsx";
import { useTranslation } from "../../i18n/useTranslation";

export type BadgeTone = "forest" | "amber" | "sienna" | "sky" | "neutral";

const toneStyles: Record<BadgeTone, string> = {
  forest: "bg-forest-50 text-forest-700",
  amber: "bg-amber-100 text-amber-700",
  sienna: "bg-sienna-100 text-sienna-700",
  sky: "bg-sky-100 text-sky-700",
  neutral: "bg-black/5 text-ink-soft",
};

export default function Badge({
  children,
  tone = "neutral",
  icon,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneStyles[tone]
      )}
    >
      {icon}
      {typeof children === "string" ? t(children) : children}
    </span>
  );
}
