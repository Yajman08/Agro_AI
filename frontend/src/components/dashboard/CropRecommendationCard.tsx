import { Link } from "react-router-dom";
import { Wheat } from "lucide-react";
import Card, { CardHeader } from "../common/Card";
import ConfidenceBar from "../common/ConfidenceBar";
import Button from "../common/Button";
import type { CropRecommendation } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

export default function CropRecommendationCard({ data }: { data: CropRecommendation }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader title={t("Crop recommendation")} />
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700 shrink-0">
          <Wheat className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs text-ink-soft">{t("Recommended crop")}</p>
          <p className="text-lg font-semibold text-ink font-display">{data.primary.crop}</p>
        </div>
      </div>
      <ConfidenceBar value={data.primary.confidencePct} />
      <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
        {data.primary.reasons.slice(0, 2).map((reason) => (
          <li key={reason} className="flex gap-2">
            <span className="text-forest-500">•</span>
            {t(reason)}
          </li>
        ))}
      </ul>
      <Link to="/crops" className="block mt-5">
        <Button variant="secondary" fullWidth>
          {t("View recommendation")}
        </Button>
      </Link>
    </Card>
  );
}
