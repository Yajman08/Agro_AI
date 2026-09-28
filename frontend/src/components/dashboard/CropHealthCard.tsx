import { Link } from "react-router-dom";
import { Leaf, TriangleAlert, ShieldAlert } from "lucide-react";
import Card, { CardHeader } from "../common/Card";
import type { CropHealthStatus } from "../../types";

const config: Record<
  CropHealthStatus,
  { label: string; description: string; tone: string; icon: typeof Leaf }
> = {
  healthy: {
    label: "Healthy",
    description: "No signs of stress or disease detected in your latest check.",
    tone: "bg-forest-50 text-forest-700",
    icon: Leaf,
  },
  attention: {
    label: "Attention needed",
    description: "Some early signs worth watching this week.",
    tone: "bg-amber-100 text-amber-700",
    icon: TriangleAlert,
  },
  disease: {
    label: "Disease detected",
    description: "A possible disease was found in your last photo check.",
    tone: "bg-sienna-100 text-sienna-700",
    icon: ShieldAlert,
  },
};

export default function CropHealthCard({ status = "healthy" as CropHealthStatus }) {
  const { label, description, tone, icon: Icon } = config[status];
  return (
    <Card>
      <CardHeader
        title="Crop health"
        action={
          <Link to="/disease" className="text-sm font-medium text-forest-700 hover:underline">
            Check now
          </Link>
        }
      />
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-ink">{label}</p>
          <p className="text-sm text-ink-soft mt-0.5">{description}</p>
        </div>
      </div>
    </Card>
  );
}
