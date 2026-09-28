import { clsx } from "../../lib/clsx";
import type { SoilMetric } from "../../types";
import { ratingTone } from "./ratingTone";
import Badge from "../common/Badge";
import { useTranslation } from "../../i18n/useTranslation";

export default function SoilMetricRow({ metric }: { metric: SoilMetric }) {
  const { t } = useTranslation();
  const pct = Math.min(
    100,
    Math.max(
      0,
      ((metric.value - metric.range.min) / (metric.range.max - metric.range.min)) * 100
    )
  );

  return (
    <div className="py-4 border-b border-line last:border-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="font-medium text-ink">{t(metric.label)}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">
            {metric.value}
            {metric.unit}
          </span>
          <Badge tone={ratingTone(metric.rating)}>{metric.rating}</Badge>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-black/5 overflow-hidden mb-3">
        <div
          className={clsx(
            "h-full rounded-full",
            metric.rating === "low" ? "bg-amber-500" : "bg-forest-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
        <p className="text-sm text-ink-soft">{t(metric.meaning)}</p>
      <p className="text-sm text-forest-700 mt-1">{t(metric.action)}</p>
    </div>
  );
}
