import type { ReactNode } from "react";
import { CalendarDays, Leaf, MapPin, Ruler, Wheat } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import FarmActionQueue from "../components/dashboard/FarmActionQueue";
import FarmSituationBoard from "../components/dashboard/FarmSituationBoard";
import WeatherSummary from "../components/dashboard/WeatherSummary";
import SoilSummary from "../components/dashboard/SoilSummary";
import CropRecommendationCard from "../components/dashboard/CropRecommendationCard";
import CropHealthCard from "../components/dashboard/CropHealthCard";
import Card, { CardHeader } from "../components/common/Card";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import DataProvenance from "../components/common/DataProvenance";
import SustainabilityBar from "../components/regenerative/SustainabilityBar";
import { mockSustainabilityMetrics } from "../data/mockData";
import { useFarmer } from "../context/useFarmer";
import { useApi } from "../hooks/useApi";
import { getAdvisory, getCropRecommendation, getSoilData, getWeather } from "../services/api";
import { useTranslation } from "../i18n/useTranslation";

export default function Dashboard() {
  const { t } = useTranslation();
  const { profile, error: profileError, reloadProfile } = useFarmer();
  const weather = useApi(() => getWeather());
  const soil = useApi(() => getSoilData());
  const crop = useApi(() => getCropRecommendation());
  const advisory = useApi(() => getAdvisory());

  const firstName = profile?.name?.split(" ")[0] ?? "there";
  const location = profile
    ? `${profile.location.district}, ${profile.location.state}`
    : "Waiting for farm profile";
  const cropName = profile?.currentCrop || crop.data?.primary.crop || "Current crop pending";
  const season = crop.data?.season ?? "Current season";
  const updatedAt = weather.data?.now.updatedAt ?? profile?.onboardedAt;

  return (
    <AppLayout>
      <Header
        title={`${t("Good morning")}, ${firstName}`}
        subtitle={t("Your farm intelligence briefing for today.")}
      />

      {profileError && <ErrorState message={profileError} onRetry={reloadProfile} />}

      <div className="space-y-8 pb-4">
        <FarmIdentityStrip
          name={profile?.name ?? "Farmer profile loading"}
          location={location}
          crop={cropName}
          farmSize={profile?.farm.sizeAcres}
          season={season}
          updatedAt={updatedAt}
        />

        <FarmSituationBoard
          cropName={cropName}
          weather={weather.data}
          soil={soil.data}
          cropRecommendation={crop.data}
        />

        <Section
          state={advisory.state}
          onRetry={advisory.reload}
          loadingLabel="Preparing today's farm plan..."
        >
          <FarmActionQueue actions={advisory.data?.actions ?? []} />
        </Section>

        <EvidenceRail
          weather={weather.data?.now.condition}
          soil={soil.data ? `${soil.data.healthLabel} soil` : undefined}
          crop={crop.data ? `${crop.data.primary.confidencePct}% fit` : undefined}
        />

        <section aria-labelledby="farm-outlook-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                {t("Supporting signals")}
              </p>
              <h2 id="farm-outlook-title" className="mt-1 text-2xl font-semibold text-ink">
                {t("Farm outlook")}
              </h2>
            </div>
            <span className="text-xs text-ink-soft">{t("Details behind today&apos;s plan")}</span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Section
              state={weather.state}
              onRetry={weather.reload}
              loadingLabel="Reading weather signals..."
            >
              {weather.data && <WeatherSummary weather={weather.data} />}
            </Section>
            <Section
              state={soil.state}
              onRetry={soil.reload}
              loadingLabel="Reading soil signals..."
            >
              {soil.data && <SoilSummary soil={soil.data} />}
            </Section>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Section
              state={crop.state}
              onRetry={crop.reload}
              loadingLabel="Finding the best crop fit..."
            >
              {crop.data && <CropRecommendationCard data={crop.data} />}
            </Section>
            <CropHealthCard status="healthy" />
            <Card>
              <CardHeader
                title="Stewardship"
                subtitle="Progress that compounds over seasons"
                action={
                  <Link to="/regenerative" className="text-sm font-medium text-forest-700 hover:underline">
                    View
                  </Link>
                }
              />
              <SustainabilityBar metric={mockSustainabilityMetrics[0]} />
              <div className="mt-4 flex items-start gap-2 text-xs text-ink-soft">
                <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" />
                Healthy soil is the foundation for the next crop decision.
              </div>
            </Card>
          </div>

          <DataProvenance
            source="Mock farm intelligence services (sample data)"
            updated={updatedAt}
          />
        </section>
      </div>
    </AppLayout>
  );
}

function FarmIdentityStrip({
  name,
  location,
  crop,
  farmSize,
  season,
  updatedAt,
}: {
  name: string;
  location: string;
  crop: string;
  farmSize?: number;
  season: string;
  updatedAt?: string;
}) {
  return (
    <section className="border-y border-line py-4" aria-label="Current farm identity">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Monitoring farm
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="font-display text-xl font-semibold text-ink">{name}&apos;s farm</h2>
            <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4 lg:flex lg:items-center lg:gap-6">
          <IdentityDetail icon={Wheat} label="Crop" value={crop} />
          <IdentityDetail icon={Ruler} label="Farm size" value={farmSize ? `${farmSize} acres` : "Pending"} />
          <IdentityDetail icon={CalendarDays} label="Season" value={season} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-ink-soft">Data mode</p>
            <p className="mt-1 text-xs font-medium text-forest-700">Sample signals</p>
            <p className="text-[11px] text-ink-soft">{formatDate(updatedAt)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IdentityDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wheat;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-ink-soft">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-semibold text-ink">{value}</p>
    </div>
  );
}

function EvidenceRail({
  weather,
  soil,
  crop,
}: {
  weather?: string;
  soil?: string;
  crop?: string;
}) {
  const evidence = [
    { label: "Weather", value: weather ?? "Signal loading", to: "/weather", tone: "text-sky-700" },
    { label: "Soil", value: soil ?? "Signal loading", to: "/soil", tone: "text-clay" },
    { label: "Crop", value: crop ?? "Signal loading", to: "/crops", tone: "text-forest-700" },
    { label: "Disease", value: "No recent screening", to: "/disease", tone: "text-amber-700" },
    { label: "Vegetation", value: "Connected signal pending", to: "/dashboard", tone: "text-ink-soft" },
  ];

  return (
    <section aria-labelledby="evidence-title">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          Decision context
        </p>
        <h2 id="evidence-title" className="mt-1 text-2xl font-semibold text-ink">
          Why this recommendation?
        </h2>
      </div>
      <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {evidence.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="min-w-0 bg-surface p-4 transition-colors hover:bg-canvas focus-visible:relative"
          >
            <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${item.tone}`}>
              {item.label}
            </p>
            <p className="mt-2 truncate text-sm font-medium text-ink">{item.value}</p>
            <p className="mt-1 text-xs text-ink-soft">View signal</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatDate(value?: string) {
  if (!value) return "Waiting for update";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function Section({
  state,
  onRetry,
  loadingLabel,
  children,
}: {
  state: "idle" | "loading" | "success" | "error";
  onRetry: () => void;
  loadingLabel: string;
  children: ReactNode;
}) {
  if (state === "loading") return <Loading message={loadingLabel} />;
  if (state === "error") return <ErrorState onRetry={onRetry} />;
  return <>{children}</>;
}