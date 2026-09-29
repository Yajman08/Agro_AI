import { useState } from "react";
import { MapPin, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2, Layers } from "lucide-react";
import Card, { CardHeader } from "../common/Card";
import Loading from "../common/Loading";
import ErrorState from "../common/ErrorState";
import LocationPicker from "../common/LocationPicker";
import type { EnvironmentData } from "../../types";
import { useApi } from "../../hooks/useApi";
import { getEnvironmentData } from "../../services/api";
import { useFarmer } from "../../context/useFarmer";

export default function EnvironmentalIntelligence() {
  const { profile } = useFarmer();
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const lat = profile?.location.latitude ?? 12.9716;
  const lon = profile?.location.longitude ?? 77.5946;
  const locName = profile?.location.village ? `${profile.location.village}, ${profile.location.state}` : undefined;

  const env = useApi(() => getEnvironmentData(lat, lon, locName), [lat, lon, locName]);

  if (env.state === "loading" && !env.data) {
    return (
      <Card className="p-6">
        <Loading message="Fetching complete location-aware environmental intelligence..." />
      </Card>
    );
  }

  if (env.state === "error" && !env.data) {
    return (
      <Card className="p-6">
        <ErrorState message="Failed to load environmental context." onRetry={env.reload} />
      </Card>
    );
  }

  const data: EnvironmentData | null = env.data;
  if (!data) return null;

  const soilSourceTag = data.soil.source
    ? `${data.soil.source} · ${data.soil.scope || "Global"}`
    : data.sources?.soil?.source || "India Soil Dataset";

  const vegSourceTag = data.vegetation.source
    ? `${data.vegetation.source} · ${data.vegetation.scope || "Global"}`
    : data.sources?.satellite?.source || "MODIS MOD13Q1";

  return (
    <section className="space-y-4" aria-labelledby="env-intel-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-forest-700 text-white text-xs font-bold">
              AI
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-700">
              Interoperability & Data Integration Layer v1.0
            </p>
          </div>
          <h2 id="env-intel-heading" className="mt-1 text-2xl font-semibold text-ink">
            Location-Aware Environmental Intelligence
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 rounded-lg transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            {showLocationPicker ? "Close Picker" : "Change Location"}
          </button>
          <button
            onClick={env.reload}
            className="p-1.5 text-ink-soft hover:text-ink rounded-lg border border-line bg-surface hover:bg-canvas transition-colors"
            title="Refresh signals"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Location Picker Overlay/Modal */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelected={() => {
            setShowLocationPicker(false);
            env.reload();
          }}
        />
      )}

      {/* Interoperability Demonstration Section */}
      <div className="rounded-xl border border-forest-200/80 bg-gradient-to-r from-forest-50/50 via-surface to-surface p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-forest-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              Data Sources & Interoperability Normalization
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium text-forest-800 bg-forest-100/70 border border-forest-200 rounded-full shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-forest-700" />
            Interoperability-ready agricultural intelligence layer
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="rounded-lg bg-surface p-2.5 border border-line">
            <span className="text-[10px] text-ink-soft uppercase font-semibold block">Weather</span>
            <span className="font-medium text-ink flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              Open-Meteo · Global
            </span>
          </div>

          <div className="rounded-lg bg-surface p-2.5 border border-line">
            <span className="text-[10px] text-ink-soft uppercase font-semibold block">Soil</span>
            <span className="font-medium text-ink flex items-center gap-1 mt-0.5 truncate">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              {soilSourceTag}
            </span>
          </div>

          <div className="rounded-lg bg-surface p-2.5 border border-line">
            <span className="text-[10px] text-ink-soft uppercase font-semibold block">Vegetation</span>
            <span className="font-medium text-ink flex items-center gap-1 mt-0.5 truncate">
              <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              {vegSourceTag}
            </span>
          </div>

          <div className="rounded-lg bg-surface p-2.5 border border-line">
            <span className="text-[10px] text-ink-soft uppercase font-semibold block">Agricultural Knowledge</span>
            <span className="font-medium text-ink flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-forest-600 shrink-0" />
              FAO Knowledge Base
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Environmental Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* 1. WEATHER CARD */}
        <Card className="relative overflow-hidden border-sky-200/60 bg-gradient-to-br from-sky-50/40 via-surface to-surface">
          <CardHeader
            title="🌡 Weather"
            subtitle="Current conditions & forecast"
            action={
              <span className="text-[10px] font-medium text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded border border-sky-200">
                Weather · Open-Meteo · Global
              </span>
            }
          />
          <div className="mt-3 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-ink">{data.weather.temperature.toFixed(1)}°C</p>
                <p className="text-xs text-ink-soft">
                  {data.weather.feels_like !== undefined && `Feels like ${data.weather.feels_like.toFixed(1)}°C · `}
                  {data.weather.condition}
                </p>
              </div>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-100">
                💧 {data.weather.humidity}% Hum
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-xs">
              <div>
                <span className="text-[10px] text-ink-soft uppercase block">Wind Speed</span>
                <span className="font-semibold text-ink">{data.weather.wind_speed.toFixed(1)} km/h</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-soft uppercase block">Condition</span>
                <span className="font-semibold text-ink truncate block">{data.weather.condition}</span>
              </div>
            </div>

            {/* 3-Day Forecast mini bar */}
            {data.weather.forecast.length > 0 && (
              <div className="pt-2 border-t border-line">
                <span className="text-[10px] font-semibold text-ink-soft uppercase block mb-1.5">3-Day Forecast</span>
                <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
                  {data.weather.forecast.slice(0, 3).map((day, i) => (
                    <div key={i} className="rounded bg-surface p-1 border border-line">
                      <p className="font-semibold text-ink truncate">{day.label}</p>
                      <p className="text-ink-soft">{day.highC.toFixed(0)}° / {day.lowC.toFixed(0)}°</p>
                      <p className="text-[9px] text-sky-600 font-medium">{day.rainProbabilityPct.toFixed(0)}% rain</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 2. RAINFALL CARD */}
        <Card className="relative overflow-hidden border-blue-200/60 bg-gradient-to-br from-blue-50/40 via-surface to-surface">
          <CardHeader
            title="🌧 Rainfall"
            subtitle="Precipitation & probability"
            action={
              <span className="text-[10px] font-medium text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                Precipitation · Open-Meteo
              </span>
            }
          />
          <div className="mt-3 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-ink">{data.rainfall.precipitation.toFixed(1)} <span className="text-sm font-medium">{data.rainfall.unit}</span></p>
                <p className="text-xs text-ink-soft">Current precipitation rate</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${
                data.rainfall.rain_probability >= 50
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-canvas text-ink-soft border-line"
              }`}>
                {data.rainfall.rain_probability.toFixed(0)}% Rain Prob
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-xs">
              <div>
                <span className="text-[10px] text-ink-soft uppercase block">Daily Total</span>
                <span className="font-semibold text-ink">{data.rainfall.daily_precipitation.toFixed(1)} {data.rainfall.unit}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-soft uppercase block">Rain Status</span>
                <span className="font-semibold text-ink">
                  {data.rainfall.rain_probability >= 60 ? "High Chance" : data.rainfall.rain_probability >= 30 ? "Moderate" : "Low Risk"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-line">
              <p className="text-[11px] text-ink-soft">
                {data.rainfall.rain_probability >= 50
                  ? "🌧 Rain expected today. Hold off on heavy chemical spraying."
                  : "☀️ Low rainfall forecast. Suitable for routine irrigation."}
              </p>
            </div>
          </div>
        </Card>

        {/* 3. SOIL HEALTH CARD */}
        <Card className="relative overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 via-surface to-surface">
          <CardHeader
            title="🌱 Soil Health"
            subtitle={data.soil.available ? "Soil observation available" : "No observation"}
            action={
              <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 truncate max-w-[140px]">
                {soilSourceTag}
              </span>
            }
          />
          <div className="mt-3 space-y-3">
            {data.soil.available && data.soil.data_available !== false ? (
              <>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-3xl font-bold text-ink">{data.soil.health_score?.toFixed(1)} <span className="text-xs text-ink-soft font-normal">/ 100</span></p>
                    <p className="text-xs text-emerald-700 font-medium">{data.soil.health_label} Soil Health</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    pH {data.soil.ph?.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-xs">
                  <div>
                    <span className="text-[10px] text-ink-soft uppercase block">Organic Carbon</span>
                    <span className="font-semibold text-ink">{data.soil.organic_carbon?.toFixed(2)} %</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft uppercase block">Nitrogen</span>
                    <span className="font-semibold text-ink">{data.soil.nitrogen?.toFixed(2)} mg/kg</span>
                  </div>
                </div>

                {data.soil.texture && (
                  <div className="pt-2 border-t border-line text-[11px]">
                    <span className="text-[10px] text-ink-soft uppercase block mb-1">Texture Composition</span>
                    <div className="flex gap-2 font-medium text-ink">
                      <span>Sand: {data.soil.texture.sand}%</span>
                      <span>Silt: {data.soil.texture.silt}%</span>
                      <span>Clay: {data.soil.texture.clay}%</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center">
                <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-1.5" />
                <p className="text-xs text-ink font-medium">
                  {data.soil.message || "No soil observation available for this location."}
                </p>
                <p className="text-[11px] text-ink-soft mt-1">
                  Source: {soilSourceTag}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 4. SATELLITE / VEGETATION CARD */}
        <Card className="relative overflow-hidden border-purple-200/60 bg-gradient-to-br from-purple-50/40 via-surface to-surface">
          <CardHeader
            title="🛰 Vegetation"
            subtitle="Satellite NDVI observation"
            action={
              <span className="text-[10px] font-medium text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-200 truncate max-w-[140px]">
                {vegSourceTag}
              </span>
            }
          />
          <div className="mt-3 space-y-3">
            {data.vegetation.available && data.vegetation.data_available !== false ? (
              <>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-3xl font-bold text-ink">{data.vegetation.ndvi?.toFixed(4)}</p>
                    <p className="text-xs text-purple-700 font-medium">{data.vegetation.interpretation}</p>
                  </div>
                  <span className="text-[10px] font-medium text-ink-soft bg-canvas px-2 py-1 rounded border border-line">
                    📅 {data.vegetation.observation_date}
                  </span>
                </div>

                <div className="pt-2 border-t border-line">
                  <span className="text-[10px] text-ink-soft uppercase block mb-1">NDVI Scale</span>
                  <div className="h-2 w-full rounded-full bg-line overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-600"
                      style={{ width: `${Math.min(Math.max((data.vegetation.ndvi || 0) * 100, 0), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-line text-[11px] text-ink-soft">
                  Source: {vegSourceTag}
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-1.5" />
                <p className="text-xs text-ink font-medium">
                  {data.vegetation.message || "No vegetation observation available for this location."}
                </p>
                <p className="text-[11px] text-ink-soft mt-1">
                  Source: {vegSourceTag}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 5. Location Source Provenance Footer */}
      <div className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-2.5 text-xs text-ink-soft">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-forest-600 shrink-0" />
          <span>
            Active Location Context: <strong className="text-ink">{data.location.name}</strong> ({data.location.latitude.toFixed(4)}° N, {data.location.longitude.toFixed(4)}° E)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-forest-600 shrink-0" />
          <span className="hidden sm:inline">Normalized Interoperable Response v{data.schema_version}</span>
        </div>
      </div>
    </section>
  );
}
