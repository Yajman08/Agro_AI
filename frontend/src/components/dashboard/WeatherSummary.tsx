import { Droplets, Wind, CloudRain, Thermometer } from "lucide-react";
import Card, { CardHeader } from "../common/Card";
import type { WeatherData } from "../../types";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";

export default function WeatherSummary({ weather }: { weather: WeatherData }) {
  const { t } = useTranslation();
  const stats = [
    { icon: Thermometer, label: "Temperature", value: `${weather.now.temperatureC}°C` },
    { icon: Droplets, label: "Humidity", value: `${weather.now.humidityPct}%` },
    { icon: CloudRain, label: "Rain chance", value: `${weather.now.rainProbabilityPct}%` },
    { icon: Wind, label: "Wind", value: `${weather.now.windKmh} km/h` },
  ];

  return (
    <Card>
      <CardHeader
          title={t("Weather")}
        subtitle={weather.location}
        action={
          <Link to="/weather" className="text-sm font-medium text-forest-700 hover:underline">
            {t("View details")}
          </Link>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 shrink-0">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-ink-soft">{t(label)}</p>
              <p className="text-sm font-semibold text-ink">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
