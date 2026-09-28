import {
  CloudRain,
  Layers,
  Leaf,
  Satellite,
  ScanLine,
  Wheat,
} from "lucide-react";
import type { ComponentType } from "react";
import type { CropRecommendation, SoilData, WeatherData } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

interface FarmSituationBoardProps {
  cropName: string;
  weather: WeatherData | null;
  soil: SoilData | null;
  cropRecommendation: CropRecommendation | null;
}

type SignalTone = "weather" | "soil" | "crop" | "disease" | "vegetation";

const signalStyles: Record<
  SignalTone,
  { icon: ComponentType<{ className?: string }>; tone: string }
> = {
  weather: { icon: CloudRain, tone: "bg-sky-100 text-sky-700" },
  soil: { icon: Layers, tone: "bg-clay/10 text-clay" },
  crop: { icon: Wheat, tone: "bg-forest-50 text-forest-700" },
  disease: { icon: ScanLine, tone: "bg-amber-100 text-amber-700" },
  vegetation: { icon: Satellite, tone: "bg-white/10 text-forest-100" },
};

const fieldCells = [
  "bg-forest-500",
  "bg-forest-300",
  "bg-forest-500",
  "bg-moss",
  "bg-moss",
  "bg-forest-500",
  "bg-forest-300",
  "bg-forest-500",
  "bg-forest-500",
  "bg-moss",
  "bg-forest-500",
  "bg-forest-300",
];

export default function FarmSituationBoard({
  cropName,
  weather,
  soil,
  cropRecommendation,
}: FarmSituationBoardProps) {
  const { t } = useTranslation();
  const healthScore = soil?.healthScore;
  const healthLabel = soil?.healthLabel ?? "Reading farm signals";
  const rainChance = weather?.now.rainProbabilityPct;
  const condition = weather
    ? rainChance && rainChance >= 60
      ? "Rain is shaping today's farm decisions."
      : "Conditions are steady for the next farm decision."
    : "Weather and soil signals are loading for this farm.";

  return (
    <section
      className="overflow-hidden rounded-[1.5rem] bg-command text-white shadow-[0_18px_45px_rgba(32,54,41,0.18)]"
      aria-labelledby="farm-situation-title"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)]">
        <div className="p-5 sm:p-7 lg:p-9">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-100/75">
                {t("Farm intelligence view")}
              </p>
              <h2 id="farm-situation-title" className="mt-2 text-2xl sm:text-3xl font-semibold text-white">
                {t("Farm situation")}
              </h2>
              <p className="mt-1 text-sm text-forest-100/75">
                {t("A stylized field view, not a GIS map")}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-forest-100/80">
              {t("Sample signals")}
            </span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5">
            <div>
              <p className="text-sm text-forest-100/75">{t("Overall farm condition")}</p>
              <p className="mt-1 font-display text-4xl font-semibold text-white">{healthLabel}</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-forest-100/80">{condition}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-5xl font-semibold text-white">
                {healthScore ?? "--"}
              </p>
              <p className="text-xs text-forest-100/70">{t("health score / 100")}</p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.25rem] border border-white/10 bg-black/10 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3 text-xs text-forest-100/70">
              <span className="inline-flex items-center gap-2">
                <Leaf className="h-3.5 w-3.5" />
                {cropName || "Current crop pending"}
              </span>
              <span>{t("Illustrative plot view")}</span>
            </div>
            <div
              className="grid grid-cols-4 gap-1.5 sm:gap-2"
              role="img"
              aria-label={`Illustrative field board for ${cropName || "the current crop"}`}
            >
              {fieldCells.map((cell, index) => (
                <div
                  key={`${cell}-${index}`}
                  className={`relative aspect-[1.45] overflow-hidden rounded-[0.65rem] ${cell} opacity-90`}
                >
                  <span className="absolute inset-x-2 top-1/2 h-px bg-white/25" />
                  <span className="absolute inset-y-2 left-1/2 w-px bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.04] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-100/75">
            {t("Signals contributing now")}
          </p>
          <div className="mt-4 space-y-2.5">
            <SignalItem
              tone="weather"
              label="Weather"
              value={weather ? `${weather.now.condition} · ${weather.now.rainProbabilityPct}% rain` : "Loading signal"}
            />
            <SignalItem
              tone="soil"
              label="Soil"
              value={soil ? `${soil.healthLabel} · ${soil.healthScore}/100` : "Loading signal"}
            />
            <SignalItem
              tone="crop"
              label="Crop fit"
              value={cropRecommendation ? `${cropRecommendation.primary.crop} · ${cropRecommendation.primary.confidencePct}% fit` : "Loading signal"}
            />
            <SignalItem tone="disease" label="Disease" value="No recent screening" />
            <SignalItem
              tone="vegetation"
              label="Vegetation"
              value="Connected signal pending"
              dark
            />
          </div>
          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="text-xs leading-relaxed text-forest-100/70">
              Farm Intelligence combines available signals into practical next steps. Missing signals stay visible instead of being presented as certainty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalItem({
  tone,
  label,
  value,
  dark = false,
}: {
  tone: SignalTone;
  label: string;
  value: string;
  dark?: boolean;
}) {
  const { t } = useTranslation();
  const { icon: Icon, tone: iconTone } = signalStyles[tone];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${dark ? "bg-white/10 text-forest-100" : iconTone}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-white">{t(label)}</p>
        <p className="truncate text-xs text-forest-100/65">{value}</p>
      </div>
    </div>
  );
}