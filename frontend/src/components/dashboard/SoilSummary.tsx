import { Link } from "react-router-dom";
import Card, { CardHeader } from "../common/Card";
import type { SoilData } from "../../types";
import { ratingTone } from "../soil/ratingTone";
import Badge from "../common/Badge";
import { useTranslation } from "../../i18n/useTranslation";

export default function SoilSummary({ soil }: { soil: SoilData }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader
        title={t("Soil health")}
        action={
          <Link to="/soil" className="text-sm font-medium text-forest-700 hover:underline">
            {t("View details")}
          </Link>
        }
      />
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#EEF3EC" strokeWidth="3.5" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#3A7048"
              strokeWidth="3.5"
              strokeDasharray={`${(soil.healthScore / 100) * 97.4} 97.4`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink">
            {soil.healthScore}
          </span>
        </div>
        <div>
          <p className="font-semibold text-ink">{soil.healthLabel}</p>
          <p className="text-sm text-ink-soft">{t("Overall soil health score")}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {soil.metrics.map((m) => (
          <Badge key={m.key} tone={ratingTone(m.rating)}>
            {m.label}: {m.value}
            {m.unit}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
