import { clsx } from "../../lib/clsx";

export default function ConfidenceBar({
  value,
  label = "Confidence",
  tone = "forest",
}: {
  value: number;
  label?: string;
  tone?: "forest" | "amber" | "sienna";
}) {
  const barColor =
    tone === "forest" ? "bg-forest-500" : tone === "amber" ? "bg-amber-500" : "bg-sienna-500";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-ink-soft">{label}</span>
        <span className="text-sm font-semibold text-ink">{value}%</span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-black/5 overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={clsx("h-full rounded-full transition-all duration-700 ease-out", barColor)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
