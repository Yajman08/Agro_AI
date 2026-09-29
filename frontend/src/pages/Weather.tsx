import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import WeatherCard from "../components/weather/WeatherCard";
import ForecastChart from "../components/weather/ForecastChart";
import Card, { CardHeader } from "../components/common/Card";
import DataProvenance from "../components/common/DataProvenance";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import { useApi } from "../hooks/useApi";
import { getWeather } from "../services/api";
import { CloudRain } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import { useFarmer } from "../context/useFarmer";

export default function Weather() {
  const { t } = useTranslation();
  const { profile } = useFarmer();

  const weather = useApi(() => {
    if (!profile) {
      return Promise.reject(
        new Error("Farmer profile is not available")
      );
    }

    return getWeather(
      profile.location.latitude,
      profile.location.longitude
    );
  });

  const { state, data, reload } = weather;

  return (
    <AppLayout>
      <Header title="Weather" subtitle="Current conditions and this week's forecast" />

      {state === "loading" && <Loading message="Getting your weather..." />}
      {state === "error" && <ErrorState onRetry={reload} />}

      {data && (
        <div className="space-y-6">
          <WeatherCard weather={data} />

          <Card>
            <CardHeader title="This week" subtitle="Temperature range and rain chance" />
            <ForecastChart forecast={data.forecast} />
          </Card>

          <div className="grid sm:grid-cols-3 gap-3">
            {data.forecast.slice(0, 6).map((day) => (
              <div
                key={day.label}
                className="rounded-xl border border-line bg-surface p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{t(day.label)}</p>
                  <p className="text-xs text-ink-soft">{day.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">
                    {day.highC}° / {day.lowC}°
                  </p>
                  <p className="text-xs text-sky-700">{day.rainProbabilityPct}% rain</p>
                </div>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader title="Farming impact" subtitle="What this weather means for your tasks" />
            <ul className="space-y-3">
              {data.farmingImpact.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 shrink-0">
                    <CloudRain className="h-4 w-4" />
                  </span>
                  <p className="text-sm text-ink pt-1">{line}</p>
                </li>
              ))}
            </ul>
            <DataProvenance source={data.dataSource} updated={data.now.updatedAt} />
          </Card>
        </div>
      )}
    </AppLayout>
  );
}