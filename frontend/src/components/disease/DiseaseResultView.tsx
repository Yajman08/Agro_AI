import { Check, CheckCircle2, ShieldAlert } from "lucide-react";
import ConfidenceBar from "../common/ConfidenceBar";
import Card, { CardHeader } from "../common/Card";
import DataProvenance from "../common/DataProvenance";
import type { DiseaseResult } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

export default function DiseaseResultView({ result }: { result: DiseaseResult }) {
  const { t } = useTranslation();
  return (
    <Card className="border-command/20">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
            result.isHealthy ? "bg-forest-50 text-forest-700" : "bg-sienna-100 text-sienna-700"
          }`}
        >
          {result.isHealthy ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <ShieldAlert className="h-6 w-6" />
          )}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{t("Visual screening result")}</p>
          <p className="mt-1 text-xl font-semibold text-ink font-display">
            {result.isHealthy
              ? "No visible issue found"
              : `${t("Possible disease")}: ${result.disease ?? t("issue detected")}`}
          </p>
        </div>
        </div>
          <span className="border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {t("Sample model")}
        </span>
      </div>

      <ConfidenceBar
        value={result.confidencePct}
        label={t("Screening confidence")}
        tone={result.isHealthy ? "forest" : "sienna"}
      />

      <div className="mt-7 border-t border-line pt-6">
        <ResultSection title={result.isHealthy ? "What we observed" : "Why the model flagged it"} items={result.observed} />
      </div>
      <div className="mt-6 border-t border-line pt-6">
        <ResultSection title="What to do now" items={result.actions} numbered />
      </div>
      <div className="mt-6 border-t border-line pt-6">
        <ResultSection title="Prevention / monitoring" items={result.prevention} numbered />
      </div>

      <DataProvenance source="Mock disease-detection model (sample data)" aiGenerated />
      <p className="text-xs text-ink-soft mt-2">
        {t("AI-generated screening result, not a confirmed diagnosis. Verify with a local agricultural expert when necessary.")}
      </p>
    </Card>
  );
}

function ResultSection({
  title,
  items,
  numbered = false,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <div>
      <CardHeader title={title} />
      {items.length > 0 ? (
        <ul className="space-y-3 text-sm text-ink-soft -mt-2">
          {items.map((item, index) => (
            <li key={item} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                {numbered ? index + 1 : <Check className="h-3.5 w-3.5" />}
              </span>
              <span className="pt-0.5 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-soft">Planning guidance is not available in the current sample model.</p>
      )}
    </div>
  );
}
