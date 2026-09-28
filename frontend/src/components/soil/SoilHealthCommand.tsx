import { Layers, Sprout } from "lucide-react";
import type { SoilData, SoilMetric } from "../../types";
import Badge from "../common/Badge";
import TextureChart from "./TextureChart";
import { ratingTone } from "./ratingTone";
import { useTranslation } from "../../i18n/useTranslation";

export default function SoilHealthCommand({
  data,
  cropName,
}: {
  data: SoilData;
  cropName: string;
}) {
  const { t } = useTranslation();
  const metrics = [
    { label: "pH", key: "ph" },
    { label: "Nitrogen", key: "nitrogen" },
    { label: "Phosphorus", key: "phosphorus" },
    { label: "Potassium", key: "potassium" },
    { label: "Organic carbon", key: "organicCarbon" },
    { label: "Moisture", key: "moisture" },
  ];

  return (
    <section className="overflow-hidden rounded-[1.5rem] bg-command text-white shadow-[0_18px_45px_rgba(32,54,41,0.18)]" aria-labelledby="soil-health-title">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="p-5 sm:p-7 lg:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-100/75">{t("Soil health command")}</p>
              <h2 id="soil-health-title" className="mt-2 text-2xl sm:text-3xl font-semibold text-white">{t("Is the soil ready?")}</h2>
              <p className="mt-1 text-sm text-forest-100/75">{t("The latest signals supporting")} {cropName}.</p>
            </div>
            <Layers className="h-5 w-5 shrink-0 text-clay" />
          </div>

          <div className="mt-9 flex items-center gap-5">
            <div className="relative h-28 w-28 shrink-0">
              <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90" aria-hidden="true">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#456E4B" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#D39A32"
                  strokeWidth="3.5"
                  strokeDasharray={`${(data.healthScore / 100) * 97.4} 97.4`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-semibold text-white">{data.healthScore}</span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-forest-100/70">/ 100</span>
              </span>
            </div>
            <div>
              <p className="text-sm text-forest-100/75">{t("Overall soil condition")}</p>
              <p className="mt-1 font-display text-3xl font-semibold text-white">{data.healthLabel}</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-forest-100/75">
                Soil signals are usable for the current farm decision, with actions below to protect the next crop.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-100/75">{t("Soil texture")}</p>
              <span className="text-xs text-forest-100/60">{t("Field composition")}</span>
            </div>
            <TextureChart texture={data.texture} />
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.04] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-9">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-forest-100/80" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-100/75">{t("Available soil signals")}</p>
          </div>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {metrics.map(({ label, key }) => (
              <SignalValue key={key} label={label} metric={data.metrics.find((item) => item.key === key)} />
            ))}
          </div>
          <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-forest-100/70">
            {t("Measurements shown here come from the latest sample. Signals not included in the current mock data stay marked as unavailable.")}
          </p>
        </div>
      </div>
    </section>
  );
}

function SignalValue({ label, metric }: { label: string; metric?: SoilMetric }) {
  const { t } = useTranslation();
  if (!metric) {
    return (
      <div className="border border-white/10 bg-black/10 px-3 py-3">
        <p className="text-xs font-medium text-white">{t(label)}</p>
        <p className="mt-1 text-xs text-forest-100/55">{t("Not in current sample")}</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-black/10 px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-white">{t(label)}</p>
        <Badge tone={ratingTone(metric.rating)}>{metric.rating}</Badge>
      </div>
      <p className="mt-2 font-display text-xl font-semibold text-white">
        {metric.value}{metric.unit}
      </p>
    </div>
  );
}