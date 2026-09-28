import { Layers, CloudSun, Satellite, Sparkles, MessageCircleHeart } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

const steps = [
  { label: "Soil", icon: Layers },
  { label: "Weather", icon: CloudSun },
  { label: "Satellite", icon: Satellite },
  { label: "AI", icon: Sparkles },
  { label: "Advisory", icon: MessageCircleHeart },
];

export default function FlowDiagram() {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-3 sm:gap-2"
      role="img"
      aria-label="Data flows from soil, weather and satellite information through AI into a personalised advisory"
    >
      {steps.map((step, i) => (
        <div key={step.label} className="flex sm:flex-1 items-center sm:flex-col gap-3 sm:gap-2 w-full sm:w-auto">
          <div className="flex flex-col items-center gap-2 sm:flex-1 sm:justify-center">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 ${
                step.label === "AI"
                  ? "bg-forest-700 text-white"
                  : "bg-forest-50 text-forest-700"
              }`}
            >
              <step.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-ink">{t(step.label)}</span>
          </div>
          {i < steps.length - 1 && (
            <span
              className="hidden sm:block h-px flex-1 bg-line self-center mt-[-20px]"
              aria-hidden
            />
          )}
        </div>
      ))}
    </div>
  );
}
