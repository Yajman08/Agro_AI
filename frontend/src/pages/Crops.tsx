import { CalendarDays, MapPin, Ruler, Wheat } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import CropAlternative from "../components/crop/CropAlternative";
import CropActionPlan from "../components/crop/CropActionPlan";
import CropEvidenceRail from "../components/crop/CropEvidenceRail";
import CropIntelligencePath from "../components/crop/CropIntelligencePath";
import CropRecommendationCommand from "../components/crop/CropRecommendationCommand";
import DataProvenance from "../components/common/DataProvenance";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Loading from "../components/common/Loading";
import { useFarmer } from "../context/useFarmer";
import { useApi } from "../hooks/useApi";
import { getCropRecommendation, getSoilData, getWeather } from "../services/api";
import { useTranslation } from "../i18n/useTranslation";

export default function Crops() {
  const { t } = useTranslation();
  const { profile, error: profileError, reloadProfile } = useFarmer();
  const crop = useApi(() => {
    const lat = profile?.location.latitude ?? 12.5218;
    const lon = profile?.location.longitude ?? 76.8951;
    return getCropRecommendation({
      latitude: lat,
      longitude: lon,
      month: new Date().getMonth() + 1,
    });
  });
  const soil = useApi(() => {
    const lat = profile?.location.latitude ?? 12.5218;
    const lon = profile?.location.longitude ?? 76.8951;
    return getSoilData(lat, lon);
  });
  const weather = useApi(() => {
    const lat = profile?.location.latitude ?? 12.5218;
    const lon = profile?.location.longitude ?? 76.8951;
    return getWeather(lat, lon);
  });

  const location = profile
    ? `${profile.location.village}, ${profile.location.district}, ${profile.location.state}`
    : "Farm location loading";
  const currentCrop = profile?.currentCrop ?? "Current crop not provided";

  return (
    <AppLayout>
      <Header title="Crop intelligence" subtitle="What crop makes sense for this farm, and why?" />

      {profileError && <ErrorState message={profileError} onRetry={reloadProfile} />}
      {crop.state === "loading" && <Loading message="Finding the best crop fit for your farm..." />}
      {crop.state === "error" && <ErrorState onRetry={crop.reload} />}

      {crop.data && (
        <div className="space-y-8 pb-4">
          <CropFarmContext
            name={profile?.name ?? "Farmer profile loading"}
            location={location}
            currentCrop={currentCrop}
            farmSize={profile?.farm.sizeAcres}
            season={crop.data.season}
          />

          <CropRecommendationCommand data={crop.data} currentCrop={currentCrop} />

          <CropEvidenceRail data={crop.data} />

          <CropActionPlan data={crop.data} />

          {soil.state === "loading" && <Loading message="Connecting soil signals..." />}
          {weather.state === "loading" && <Loading message="Connecting weather signals..." />}
          {soil.state === "error" && <ErrorState message="We couldn't load the soil connection yet." onRetry={soil.reload} />}
          {weather.state === "error" && <ErrorState message="We couldn't load the weather connection yet." onRetry={weather.reload} />}
          {(soil.state === "success" || weather.state === "success") && (
            <CropIntelligencePath crop={crop.data} soil={soil.data} weather={weather.data} />
          )}

          <section aria-labelledby="crop-alternatives-title">
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Context, not competition")}</p>
              <h2 id="crop-alternatives-title" className="mt-1 text-2xl font-semibold text-ink">{t("Alternatives worth considering")}</h2>
            </div>
            {crop.data.alternatives.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {crop.data.alternatives.map((alternative) => (
                  <CropAlternative key={alternative.crop} option={alternative} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-line bg-surface">
                <EmptyState title="No alternatives in this recommendation" description="The model returned one primary crop for the available farm signals." />
              </div>
            )}
          </section>

          <DataProvenance source={crop.data.dataSource} aiGenerated updated={undefined} />
        </div>
      )}
    </AppLayout>
  );
}

function CropFarmContext({
  name,
  location,
  currentCrop,
  farmSize,
  season,
}: {
  name: string;
  location: string;
  currentCrop: string;
  farmSize?: number;
  season: string;
}) {
  const { t } = useTranslation();
  return (
    <section className="border-y border-line py-4" aria-label="Farm crop context">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Crop recommendation for this farm")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              <MapPin className="h-3.5 w-3.5 text-forest-700" />
              {name}&apos;s farm · {location}
            </p>
            <p className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <Wheat className="h-3.5 w-3.5 text-forest-700" />
              {t("Current crop")}: {currentCrop}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5" />
            {farmSize ? `${farmSize} acres` : "Farm size pending"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {season}
          </span>
          <span><strong className="font-medium text-forest-700">{t("Sample model")}</strong> · {t("Update time not provided")}</span>
        </div>
      </div>
    </section>
  );
}