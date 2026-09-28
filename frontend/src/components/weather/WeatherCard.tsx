import { CloudSun, Droplets, Wind, CloudRain } from "lucide-react";
import type { WeatherData } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

export default function WeatherCard({ weather }: { weather: WeatherData }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl bg-sky-700 text-white p-6 sm:p-8 shadow-soft relative overflow-hidden">
      <div className="absolute -right-8 -top-8 opacity-15">
        <CloudSun className="h-40 w-40" />
      </div>
      <p className="text-sky-100/90 text-sm">{weather.location}</p>
      <div className="flex items-end gap-3 mt-2">
        <p className="font-display text-6xl font-semibold">{weather.now.temperatureC}°</p>
        <p className="pb-2 text-sky-100">{weather.now.condition}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm">
        <Stat icon={Droplets} label={t("Humidity")} value={`${weather.now.humidityPct}%`} />
        <Stat icon={Wind} label={t("Wind")} value={`${weather.now.windKmh} km/h`} />
        <Stat icon={CloudRain} label={t("Rain")} value={`${weather.now.rainProbabilityPct}%`} />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div>
      <Icon className="h-4 w-4 text-sky-100/90 mb-1" />
      <p className="text-xs text-sky-100/80">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}