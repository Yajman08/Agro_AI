import { CheckCircle2, CloudSun, Layers, Satellite, Wheat } from "lucide-react";
import type { CropFactor, CropRecommendation } from "../../types";
import Badge from "../common/Badge";
import { useTranslation } from "../../i18n/useTranslation";

export default function CropEvidenceRail({ data }: { data: CropRecommendation }) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="crop-evidence-title">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Explainable recommendation")}</p>
        <h2 id="crop-evidence-title" className="mt-1 text-2xl font-semibold text-ink">{t("Why this crop?")}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t("The model's reasons, shown as farm signals rather than hidden scoring.")}</p>
      </div>

      <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {data.primary.reasons.map((reason, index) => {
          const signal = signalForReason(reason, index);
          const Icon = signal.icon;

          return (
            <div key={reason} className="bg-surface p-5">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${signal.tone}`} />
                <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${signal.tone}`}>{t(signal.label)}</p>
              </div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink">{reason}</p>
              <p className="mt-3 text-xs text-ink-soft">{t("Supports the current crop selection")}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{t("Supporting signals")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t("The factors the recommendation model considered.")}</p>
          </div>
          <Badge tone="neutral">No per-factor percentages available</Badge>
        </div>
        <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {data.factorsConsidered.map((factor) => <FactorLine key={factor.label} factor={factor} />)}
        </div>
      </div>
    </section>
  );
}

function FactorLine({ factor }: { factor: CropFactor }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-2.5">
      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${factor.supportive ? "text-forest-600" : "text-ink-soft"}`} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-ink">{t(factor.label)}</p>
          <span className="text-[10px] uppercase tracking-[0.1em] text-forest-700">{t(factor.supportive ? "Supportive" : "Needs review")}</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{factor.detail}</p>
      </div>
    </div>
  );
}

function signalForReason(reason: string, index: number) {
  if (/soil|pH|nitrogen|carbon/i.test(reason)) return { label: "Soil", icon: Layers, tone: "text-clay" };
  if (/weather|rain|climate/i.test(reason)) return { label: "Weather", icon: CloudSun, tone: "text-sky-700" };
  if (/season|sowing|window/i.test(reason)) return { label: "Season", icon: Wheat, tone: "text-forest-700" };
  return { label: index === 0 ? "Farm signal" : "Model factor", icon: Satellite, tone: "text-ink-soft" };
}