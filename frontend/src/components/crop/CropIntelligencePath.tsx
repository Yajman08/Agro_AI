import { ArrowDown, ArrowRight, CloudRain, Layers, Sparkles, Wheat } from "lucide-react";
import type { CropRecommendation, SoilData, WeatherData } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

export default function CropIntelligencePath({
  crop,
  soil,
  weather,
}: {
  crop: CropRecommendation;
  soil: SoilData | null;
  weather: WeatherData | null;
}) {
  const { t } = useTranslation();
  const soilMetric = soil?.metrics.find((metric) => metric.key === "ph") ?? soil?.metrics[0];
  const soilValue = soilMetric ? `${soilMetric.label} ${soilMetric.value}${soilMetric.unit}` : "Soil signal loading";
  const weatherValue = weather ? `${weather.now.condition} · ${weather.now.rainProbabilityPct}% rain` : "Weather signal loading";

  return (
    <section className="border-l-4 border-forest-500 bg-forest-50 px-5 py-5 sm:px-6" aria-labelledby="crop-intelligence-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700">
            <Sparkles className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{t("Farm intelligence")}</p>
          </div>
          <h2 id="crop-intelligence-title" className="mt-2 text-xl font-semibold text-ink">{t("Soil + weather + crop → recommendation")}</h2>
        </div>
        <p className="text-xs text-ink-soft">{t("Signals work together")}</p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
        <Step icon={<Layers className="h-4 w-4" />} label="Soil" value={soilValue} />
        <ArrowRight className="hidden h-4 w-4 text-forest-500 lg:block" aria-hidden="true" />
        <ArrowDown className="mx-auto h-4 w-4 text-forest-500 lg:hidden" aria-hidden="true" />
        <Step icon={<CloudRain className="h-4 w-4" />} label="Weather" value={weatherValue} />
        <ArrowRight className="hidden h-4 w-4 text-forest-500 lg:block" aria-hidden="true" />
        <ArrowDown className="mx-auto h-4 w-4 text-forest-500 lg:hidden" aria-hidden="true" />
        <Step icon={<Wheat className="h-4 w-4" />} label="Crop fit" value={`${crop.primary.crop} · ${crop.primary.confidencePct}%`} />
        <ArrowRight className="hidden h-4 w-4 text-forest-500 lg:block" aria-hidden="true" />
        <ArrowDown className="mx-auto h-4 w-4 text-forest-500 lg:hidden" aria-hidden="true" />
        <Step label="Recommendation" value={`Use ${crop.primary.crop} as the current lead option.`} strong />
      </div>
    </section>
  );
}

function Step({
  icon,
  label,
  value,
  strong = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  strong?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest-700">
        {icon}
        {t(label)}
      </p>
      <p className={`mt-1 text-sm leading-relaxed ${strong ? "font-semibold text-ink" : "text-ink-soft"}`}>{value}</p>
    </div>
  );
}