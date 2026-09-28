import type { SustainabilityMetric } from "../../types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };

export default function SustainabilityBar({ metric }: { metric: SustainabilityMetric }) {
  const Icon = trendIcon[metric.trend];
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-ink">{metric.label}</span>
        <span className="flex items-center gap-1 text-sm font-medium text-ink-soft">
          <Icon className="h-3.5 w-3.5" />
          {metric.value}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-forest-500"
          style={{ width: `${metric.value}%` }}
        />
      </div>
    </div>
  );
}
