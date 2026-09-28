import { ArrowDown, ArrowRight, CloudRain, Sparkles } from "lucide-react";
import type { CropRecommendation, SoilData, WeatherData } from "../../types";

export default function SoilIntelligencePath({
  soil,
  crop,
  weather,
  currentCrop,
}: {
  soil: SoilData;
  crop: CropRecommendation | null;
  weather: WeatherData | null;
  currentCrop: string;
}) {
  const soilMetric = soil.metrics.find((metric) => metric.key === "ph") ?? soil.metrics[0];
  const soilSignal = soilMetric ? `${soilMetric.label} ${soilMetric.value}${soilMetric.unit} · ${soilMetric.rating}` : `${soil.healthLabel} soil`;
  const cropSignal = crop ? `${crop.primary.crop} · ${crop.primary.confidencePct}% fit` : `${currentCrop} · recommendation loading`;
  const weatherSignal = weather
    ? `${weather.now.condition} · ${weather.now.rainProbabilityPct}% rain`
    : "Weather signal loading";
  const action = weather?.farmingImpact[0] ?? "Use the latest soil reading to guide the next farm action.";

  return (
    <section className="border-l-4 border-clay bg-surface px-5 py-5 sm:px-6" aria-labelledby="soil-intelligence-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-clay">
            <Sparkles className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">Farm intelligence</p>
          </div>
          <h2 id="soil-intelligence-title" className="mt-2 text-xl font-semibold text-ink">Soil → crop → weather → action</h2>
        </div>
        <p className="text-xs text-ink-soft">Signals work together</p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
        <Step label="Soil signal" value={soilSignal} />
        <ArrowRight className="hidden h-4 w-4 text-clay lg:block" aria-hidden="true" />
        <ArrowDown className="mx-auto h-4 w-4 text-clay lg:hidden" aria-hidden="true" />
        <Step label="Crop fit" value={cropSignal} />
        <ArrowRight className="hidden h-4 w-4 text-clay lg:block" aria-hidden="true" />
        <ArrowDown className="mx-auto h-4 w-4 text-clay lg:hidden" aria-hidden="true" />
        <Step icon={<CloudRain className="h-4 w-4" />} label="Weather" value={weatherSignal} />
        <ArrowRight className="hidden h-4 w-4 text-clay lg:block" aria-hidden="true" />
        <ArrowDown className="mx-auto h-4 w-4 text-clay lg:hidden" aria-hidden="true" />
        <Step label="Farm action" value={action} strong />
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
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-clay">
        {icon}
        {label}
      </p>
      <p className={`mt-1 text-sm leading-relaxed ${strong ? "font-semibold text-ink" : "text-ink-soft"}`}>{value}</p>
    </div>
  );
}