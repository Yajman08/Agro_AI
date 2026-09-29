import { useEffect, useState, useCallback } from "react";
import type { FormEvent } from "react";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import AdvisoryCard from "../components/advisory/AdvisoryCard";
import QuickQuestionChip from "../components/advisory/QuickQuestionChip";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import DataProvenance from "../components/common/DataProvenance";
import { getAdvisory, getEnvironmentData } from "../services/api";
import { mockQuickQuestions } from "../data/mockData";
import type { AdvisoryData, RequestState, EnvironmentData, AdvisoryContextPayload } from "../types";
import { Sparkles, MapPin, BookOpen, RefreshCw } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import { useFarmer } from "../context/useFarmer";

export default function Advisory() {
  const { t } = useTranslation();
  const { profile } = useFarmer();

  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [data, setData] = useState<AdvisoryData | null>(null);
  const [envData, setEnvData] = useState<EnvironmentData | null>(null);
  const [state, setState] = useState<RequestState>("idle");
  const [error, setError] = useState<string | null>(null);

  const lat = profile?.location.latitude ?? 12.9716;
  const lon = profile?.location.longitude ?? 77.5946;
  const cropName = profile?.currentCrop || "Wheat";
  const farmerName = profile?.name || "Farmer";

  // Build full active payload for contextual AI advisory
  const generatePayload = useCallback((customQuestion?: string): AdvisoryContextPayload => {
    return {
      question: customQuestion || question,
      farmer_name: farmerName,
      crop: cropName,
      location: {
        name: envData?.location.name || (profile?.location.village ? `${profile.location.village}, ${profile.location.state}` : "Selected Location"),
        latitude: lat,
        longitude: lon,
        district: profile?.location.district,
        state: profile?.location.state,
        country: profile?.location.country,
      },
      weather: envData ? {
        temperature: envData.weather.temperature,
        condition: envData.weather.condition,
        humidity: envData.weather.humidity,
        rain_probability: envData.rainfall.rain_probability,
        precipitation: envData.rainfall.precipitation,
      } : undefined,
      soil: envData ? {
        ph: envData.soil.ph,
        health_score: envData.soil.health_score,
        health_label: envData.soil.health_label,
        organic_carbon: envData.soil.organic_carbon,
        nitrogen: envData.soil.nitrogen,
        source: envData.soil.source,
        scope: envData.soil.scope,
      } : undefined,
      vegetation: envData ? {
        ndvi: envData.vegetation.ndvi,
        observation_date: envData.vegetation.observation_date,
        interpretation: envData.vegetation.interpretation,
        source: envData.vegetation.source,
        scope: envData.vegetation.scope,
      } : undefined,
    };
  }, [question, farmerName, cropName, envData, profile, lat, lon]);

  // Load Environmental Intelligence first to form active decision context
  useEffect(() => {
    let active = true;
    getEnvironmentData(lat, lon)
      .then((env) => {
        if (active) setEnvData(env);
      })
      .catch(() => {
        // Continue even if env fetch falls back
      });
    return () => {
      active = false;
    };
  }, [lat, lon]);

  // Generate advisory whenever location / env context or initial page load occurs
  const fetchAdvisory = useCallback(async (customQuestion?: string) => {
    setState("loading");
    setError(null);
    if (customQuestion !== undefined) {
      setSubmittedQuestion(customQuestion || null);
    }
    try {
      const payload = generatePayload(customQuestion);
      const advisory = await getAdvisory(payload);
      setData(advisory);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't prepare your advisory.");
      setState("error");
    }
  }, [generatePayload]);

  useEffect(() => {
    void fetchAdvisory();
  }, [lat, lon, cropName, fetchAdvisory]);

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) return;
    void fetchAdvisory(question.trim());
  };

  return (
    <AppLayout>
      <Header title="Your AI Farm Advisor" subtitle="Personalized, location-aware actions powered by environmental intelligence & FAO knowledge" />

      <div className="space-y-8">

        {/* Location & Crop Context Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-forest-700 shrink-0" />
            <span>
              Active Location: <strong className="text-ink">{envData?.location.name || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`}</strong> · Crop: <strong className="text-ink">{cropName}</strong>
            </span>
          </div>
          <button
            onClick={() => void fetchAdvisory()}
            disabled={state === "loading"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 rounded-lg transition-colors shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${state === "loading" ? "animate-spin" : ""}`} />
            {state === "loading" ? "Generating..." : "Generate Advisory"}
          </button>
        </div>

        {/* Ask Question Card */}
        <Card>
          <div className="flex items-start gap-3 mb-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-50 text-forest-700 shrink-0">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-medium text-ink">{t("Ask a question about your farm")}</p>
              <p className="text-sm text-ink-soft mt-0.5">
                {t("Get a short, practical answer based on your available farm data.")}
              </p>
            </div>
          </div>

          <form onSubmit={submitQuestion} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="advisory-question" className="sr-only">
              Your farming question
            </label>
            <input
              id="advisory-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. What should I do before tomorrow's rain?"
              className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!question.trim() || state === "loading"}
              className="inline-flex items-center justify-center rounded-full bg-forest-700 text-white px-5 py-2.5 text-sm font-medium hover:bg-forest-900 disabled:cursor-not-allowed disabled:bg-forest-300 transition-colors"
            >
              {state === "loading" ? "Generating..." : "Ask advisor"}
            </button>
          </form>

          <div className="mt-5">
            <p className="text-sm font-medium text-ink-soft mb-3">{t("Try one of these")}</p>
            <div className="flex flex-wrap gap-2">
              {mockQuickQuestions.map((quickQuestion) => (
                <QuickQuestionChip
                  key={quickQuestion.id}
                  question={quickQuestion.question}
                  onClick={() => {
                    setQuestion(quickQuestion.question);
                    void fetchAdvisory(quickQuestion.question);
                  }}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {state === "loading" && (
          <Loading message="Generating personalized advisory..." />
        )}

        {/* Error State */}
        {state === "error" && (
          <ErrorState
            message={error ?? "We couldn't prepare your advisory."}
            onRetry={() => void fetchAdvisory(submittedQuestion || undefined)}
          />
        )}

        {/* Empty State */}
        {state === "idle" && (
          <Card>
            <EmptyState
              icon={<Sparkles className="h-5 w-5" />}
              title="Your advisory will appear here"
              description="Choose a question above or click 'Generate Advisory' to receive practical actions."
            />
          </Card>
        )}

        {/* Advisory Output */}
        {data && state === "success" && (
          <div className="space-y-8">
            <Card className="bg-forest-700 text-white border-none shadow-md">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </span>
                <div>
                  <p className="text-xs text-forest-100 mb-1 font-medium">
                    AI-generated advisory{submittedQuestion ? ` for “${submittedQuestion}”` : ""} · {data.location_name || "Location Aware"}
                  </p>
                  <p className="font-medium text-sm sm:text-base leading-relaxed">{data.summary}</p>
                </div>
              </div>
            </Card>

            {/* Action Cards */}
            <section aria-label="Actionable Farming Recommendations">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft mb-3">
                {t("Prioritized Actions for")} {data.crop || cropName}
              </h2>
              <div className="space-y-4">
                {data.actions.map((action) => (
                  <AdvisoryCard key={action.id} advisory={action} />
                ))}
              </div>
            </section>

            {/* FAO Knowledge & Source References */}
            {data.sources && data.sources.length > 0 && (
              <Card className="border-forest-200 bg-forest-50/40">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-forest-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900">
                    FAO Knowledge Base & Source References
                  </h3>
                </div>
                <div className="space-y-2 text-xs">
                  {data.sources.map((src, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-surface border border-line gap-1">
                      <span className="font-medium text-ink">{src.title}</span>
                      <span className="text-[10px] text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 shrink-0">
                        {src.source} · {src.topic}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <DataProvenance
              source={`FAO Knowledge Base & Environmental Providers (${envData?.soil.source || "SoilGrids"} · ${envData?.vegetation.source || "MODIS MOD13Q1"})`}
              updated={data.generatedAt}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
