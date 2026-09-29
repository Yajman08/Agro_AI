import { CalendarDays, MapPin, Ruler, Wheat } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import Card, { CardHeader } from "../components/common/Card";
import SoilMetricRow from "../components/soil/SoilMetricRow";
import SoilHealthCommand from "../components/soil/SoilHealthCommand";
import SoilActionPlan from "../components/soil/SoilActionPlan";
import SoilIntelligencePath from "../components/soil/SoilIntelligencePath";
import DataProvenance from "../components/common/DataProvenance";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import ConfidenceBar from "../components/common/ConfidenceBar";
import { useFarmer } from "../context/useFarmer";
import { useApi } from "../hooks/useApi";
import { getCropRecommendation, getSoilData, getWeather } from "../services/api";
import type { SoilData } from "../types";
import { useTranslation } from "../i18n/useTranslation";

export default function Soil() {
  const { profile, error: profileError, reloadProfile } = useFarmer();
  const soil = useApi(() => getSoilData(profile?.location.latitude ?? 12.5218, profile?.location.longitude ?? 76.8951));
  const crop = useApi(() => getCropRecommendation({
    latitude: profile?.location.latitude ?? 12.5218,
    longitude: profile?.location.longitude ?? 76.8951,
    month: new Date().getMonth() + 1,
  }));
  const weather = useApi(() => getWeather(profile?.location.latitude ?? 12.5218, profile?.location.longitude ?? 76.8951));

  const location = profile
    ? `${profile.location.village}, ${profile.location.district}, ${profile.location.state}`
    : "Farm location loading";
  const currentCrop = profile?.currentCrop || "Current crop pending";

  return (
    <AppLayout>
      <Header title="Soil intelligence" subtitle="Is your soil ready for the crop, and what should you do next?" />

      {profileError && <ErrorState message={profileError} onRetry={reloadProfile} />}
      {soil.state === "loading" && <Loading message="Reading soil signals for your farm..." />}
      {soil.state === "error" && <ErrorState onRetry={soil.reload} />}

      {soil.data && (
        <div className="space-y-8 pb-4">
          <SoilFarmContext
            name={profile?.name ?? "Farmer profile loading"}
            location={location}
            crop={currentCrop}
            farmSize={profile?.farm.sizeAcres}
            updatedAt={soil.data.lastUpdated}
          />

          <SoilHealthCommand data={soil.data} cropName={currentCrop} />

          <SoilProfile data={soil.data} />

          {crop.state === "loading" && <Loading message="Checking how the soil fits your crop..." />}
          {crop.state === "error" && <ErrorState message="We couldn't load the crop fit yet." onRetry={crop.reload} />}
          {crop.data && <CropFit data={soil.data} crop={crop.data} currentCrop={currentCrop} />}

          <SoilActionPlan metrics={soil.data.metrics} />

          {weather.state === "loading" && <Loading message="Connecting soil signals with weather..." />}
          {weather.state === "error" && <ErrorState message="We couldn't load the weather connection yet." onRetry={weather.reload} />}
          {weather.state === "success" && (
            <SoilIntelligencePath
              soil={soil.data}
              crop={crop.data}
              weather={weather.data}
              currentCrop={currentCrop}
            />
          )}

          <SoilHistory />

          <DataProvenance source={soil.data.dataSource} updated={soil.data.lastUpdated} />
        </div>
      )}
    </AppLayout>
  );
}

function SoilFarmContext({
  name,
  location,
  crop,
  farmSize,
  updatedAt,
}: {
  name: string;
  location: string;
  crop: string;
  farmSize?: number;
  updatedAt: string;
}) {
  const { t } = useTranslation();
  return (
    <section className="border-y border-line py-4" aria-label="Farm soil context">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Soil for this farm")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              <MapPin className="h-3.5 w-3.5 text-clay" />
              {name}&apos;s farm · {location}
            </p>
            <p className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <Wheat className="h-3.5 w-3.5 text-forest-700" />
              {crop}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5" />
            {farmSize ? `${farmSize} acres` : "Farm size pending"}
          </span>
          <span>
            <strong className="font-medium text-forest-700">Sample data</strong> · Updated {formatDate(updatedAt)}
          </span>
        </div>
      </div>
    </section>
  );
}

function SoilProfile({ data }: { data: SoilData }) {
  const { t } = useTranslation();
  const chemistryKeys = ["ph", "nitrogen", "phosphorus", "potassium"];
  const qualityKeys = ["organicCarbon", "moisture"];

  return (
    <section aria-labelledby="soil-profile-title">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Signal profile")}</p>
        <h2 id="soil-profile-title" className="mt-1 text-2xl font-semibold text-ink">{t("Soil profile")}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t("The measurements behind the health score, grouped by what they tell us.")}</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <SignalGroup title="Chemistry" description="Nutrients and pH" keys={chemistryKeys} data={data} />
        <SignalGroup title="Soil quality" description="Organic matter and moisture" keys={qualityKeys} data={data} />
      </div>
    </section>
  );
}

function SignalGroup({
  title,
  description,
  keys,
  data,
}: {
  title: string;
  description: string;
  keys: string[];
  data: SoilData;
}) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader title={t(title)} subtitle={t(description)} />
      <div>
        {keys.map((key) => {
          const metric = data.metrics.find((item) => item.key === key);
          return metric ? (
            <SoilMetricRow key={key} metric={metric} />
          ) : (
            <UnavailableMetric key={key} label={metricLabel(key)} />
          );
        })}
      </div>
    </Card>
  );
}

function UnavailableMetric({ label }: { label: string }) {
  const { t } = useTranslation();
  return (
    <div className="border-b border-line py-4 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-ink">{t(label)}</p>
        <span className="text-xs font-medium text-ink-soft">{t("Not in current sample")}</span>
      </div>
      <div className="mt-3 h-1.5 w-full bg-black/5" />
      <p className="mt-3 text-sm text-ink-soft">{t("This signal will become available when connected soil data provides it.")}</p>
    </div>
  );
}

function CropFit({
  data,
  crop,
  currentCrop,
}: {
  data: SoilData;
  crop: NonNullable<ReturnType<typeof getCropRecommendation> extends Promise<infer T> ? T : never>;
  currentCrop: string;
}) {
  const { t } = useTranslation();
  const soilReasons = crop.primary.reasons.filter((reason) => /soil|pH|nitrogen|carbon/i.test(reason));
  const sameCrop = crop.primary.crop.toLowerCase() === currentCrop.toLowerCase();

  return (
    <section aria-labelledby="crop-fit-title">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Crop decision")}</p>
        <h2 id="crop-fit-title" className="mt-1 text-2xl font-semibold text-ink">{t("How your soil fits your crop")}</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="border-l-4 border-forest-500 bg-forest-50 p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-forest-700">{t("Current crop")}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{currentCrop}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {sameCrop ? "The current recommendation matches this crop." : `The mock recommendation currently points to ${crop.primary.crop}.`}
          </p>
        </div>
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-ink-soft">Recommended crop from available signals</p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">{crop.primary.crop}</p>
            </div>
            <span className="text-right text-xs text-ink-soft">{data.healthLabel} soil</span>
          </div>
          <div className="mt-4"><ConfidenceBar value={crop.primary.confidencePct} /></div>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {(soilReasons.length > 0 ? soilReasons : crop.primary.reasons.slice(0, 2)).map((reason) => (
              <li key={reason} className="flex gap-2"><span className="text-forest-500">•</span>{reason}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

function SoilHistory() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="soil-history-title">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Longitudinal view")}</p>
        <h2 id="soil-history-title" className="mt-1 text-2xl font-semibold text-ink">{t("Soil history")}</h2>
      </div>
      <div className="border border-dashed border-line bg-surface">
        <EmptyState
          icon={<CalendarDays className="h-5 w-5" />}
          title="No previous soil readings available"
          description="Future readings will make changes in soil health and nutrient balance visible over time."
        />
      </div>
    </section>
  );
}

function metricLabel(key: string) {
  return { ph: "pH", nitrogen: "Nitrogen", phosphorus: "Phosphorus", potassium: "Potassium", organicCarbon: "Organic carbon", moisture: "Moisture" }[key] ?? key;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}