import Badge from "../common/Badge";
import type { AdvisoryPriority } from "../../types";

const toneMap: Record<AdvisoryPriority, "sienna" | "amber" | "sky"> = {
  high: "sienna",
  medium: "amber",
  low: "sky",
};

const labelMap: Record<AdvisoryPriority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

export default function PriorityBadge({ priority }: { priority: AdvisoryPriority }) {
  return <Badge tone={toneMap[priority]}>{labelMap[priority]}</Badge>;
}
