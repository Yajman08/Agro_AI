import { CloudRain, Sprout, Leaf, Layers } from "lucide-react";
import type { AdvisoryAction, AdvisoryCategory } from "../../types";
import PriorityBadge from "./PriorityBadge";
import Card from "../common/Card";

const categoryConfig: Record<
  AdvisoryCategory,
  { icon: typeof CloudRain; label: string; tone: string }
> = {
  weather: { icon: CloudRain, label: "Weather", tone: "bg-sky-100 text-sky-700" },
  crop: { icon: Sprout, label: "Crop", tone: "bg-forest-50 text-forest-700" },
  sustainability: { icon: Leaf, label: "Sustainability", tone: "bg-amber-100 text-amber-700" },
  soil: { icon: Layers, label: "Soil", tone: "bg-clay/10 text-clay" },
};

export default function AdvisoryCard({ advisory }: { advisory: AdvisoryAction }) {
  const { icon: Icon, tone } = categoryConfig[advisory.category];

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${tone}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-semibold text-ink">{advisory.title}</h4>
            <PriorityBadge priority={advisory.priority} />
          </div>
          <p className="text-sm text-ink-soft mt-1">{advisory.reason}</p>
          <div className="mt-3 rounded-xl bg-forest-50/60 px-3 py-2.5">
            <p className="text-xs font-medium text-forest-700 uppercase tracking-wide mb-0.5">
              Action
            </p>
            <p className="text-sm text-ink">{advisory.action}</p>
          </div>
          <p className="text-xs text-ink-soft mt-2">{advisory.timing}</p>
        </div>
      </div>
    </Card>
  );
}
