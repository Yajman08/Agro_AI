import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { clsx } from "../../lib/clsx";

export default function MetricCard({
  to,
  icon,
  label,
  value,
  detail,
  tone = "neutral",
}: {
  to: string;
  icon: ReactNode;
  label: string;
  value: string;
  detail?: string;
  tone?: "forest" | "amber" | "sienna" | "sky" | "neutral";
}) {
  const toneBg: Record<string, string> = {
    forest: "bg-forest-50 text-forest-700",
    amber: "bg-amber-100 text-amber-700",
    sienna: "bg-sienna-100 text-sienna-700",
    sky: "bg-sky-100 text-sky-700",
    neutral: "bg-black/5 text-ink-soft",
  };

  return (
    <Link
      to={to}
      className="bg-surface border border-line rounded-2xl p-4 sm:p-5 shadow-soft hover:border-forest-300 transition-colors flex flex-col gap-3"
    >
      <span className={clsx("flex h-9 w-9 items-center justify-center rounded-xl", toneBg[tone])}>
        {icon}
      </span>
      <div>
        <p className="text-xs text-ink-soft">{label}</p>
        <p className="text-xl font-semibold text-ink font-display">{value}</p>
        {detail && <p className="text-xs text-ink-soft mt-0.5">{detail}</p>}
      </div>
    </Link>
  );
}
