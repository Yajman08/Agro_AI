import { Link } from "react-router-dom";
import {
  Layers,
  CloudSun,
  Satellite,
  ScanLine,
  Wheat,
  MessagesSquare,
  Leaf,
  Sprout,
} from "lucide-react";
import LandingNav from "../components/landing/LandingNav";
import FlowDiagram from "../components/landing/FlowDiagram";
import FeatureCard from "../components/landing/FeatureCard";
import BricsSection from "../components/landing/BricsSection";
import Button from "../components/common/Button";
import { useTranslation } from "../i18n/useTranslation";

const capabilities = [
  {
    icon: Layers,
    title: "Soil insights",
    description: "Understand pH, nutrients and texture in plain language, with clear next steps.",
  },
  {
    icon: CloudSun,
    title: "Weather guidance",
    description: "See what today's and this week's weather means for your specific farming tasks.",
  },
  {
    icon: Satellite,
    title: "Vegetation monitoring",
    description: "Track how your crop's vegetation compares to expected conditions over time.",
  },
  {
    icon: Wheat,
    title: "Crop recommendation",
    description: "Get a recommended crop for your land, with the reasoning shown alongside it.",
  },
  {
    icon: ScanLine,
    title: "Disease detection",
    description: "Photograph a leaf to check for common diseases and get a suggested response.",
  },
  {
    icon: MessagesSquare,
    title: "AI advisory",
    description: "Receive a short, prioritized list of actions — not a wall of raw data.",
  },
];

const steps = [
  {
    title: "Tell us about your farm",
    description: "Share your location, farm size and current crop in a short, five-step form.",
  },
  {
    title: "We gather your farm's conditions",
    description: "Soil, weather and satellite vegetation data are combined for your exact location.",
  },
  {
    title: "Get a personalized advisory",
    description: "AI turns that data into a short list of actions in simple, everyday language.",
  },
];

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="bg-canvas">
      <LandingNav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-14 pb-16 sm:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold text-ink leading-[1.08] mb-5">{t("Smarter farming decisions, powered by AI.")}</h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-8 max-w-xl">
            {t("Understand your soil, monitor crop conditions, detect diseases, and receive localized agricultural guidance from one intelligent platform.")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/onboarding">
              <Button size="lg">Get started</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                Explore dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-14 sm:mt-20 rounded-2xl border border-line bg-surface p-6 sm:p-10">
          <FlowDiagram />
        </div>
      </section>

      {/* What it does */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-line">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-ink mb-4">{t("One platform, from field data to farm decisions")}</h2>
          <p className="text-ink-soft leading-relaxed">
            {t("AgriNexus AI brings together your soil, local weather, and satellite vegetation data, then turns it into guidance a farmer can act on the same day — without needing to interpret raw numbers or technical terms.")}
          </p>
        </div>
      </section>

      {/* Core capabilities */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold text-ink mb-8">Core capabilities</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((c) => (
            <FeatureCard key={c.title} {...c} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-line">
        <h2 className="text-2xl sm:text-3xl font-semibold text-ink mb-10">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-white text-sm font-semibold">
                {i + 1}
              </span>
              <h3 className="font-semibold text-ink">{t(step.title)}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{t(step.description)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainable agriculture */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-line">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink mb-4">{t("Guidance rooted in regenerative agriculture")}</h2>
            <p className="text-ink-soft leading-relaxed mb-6">
              Alongside short-term advisories, AgriNexus AI surfaces
              longer-term practices — crop rotation, cover crops, composting
              and integrated pest management — that build healthier soil and
              reduce dependence on chemical inputs over time.
            </p>
            <Link to="/regenerative">
              <Button variant="secondary">See regenerative practices</Button>
            </Link>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-4">
            {["Healthier soil, season after season", "Lower water and chemical use", "Guidance suited to your specific field"].map(
              (line) => (
                <div key={line} className="flex items-start gap-3">
                  <Leaf className="h-4.5 w-4.5 text-forest-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-ink">{line}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* BRICS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-line">
        <BricsSection />
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 border-t border-line">
        <div className="rounded-2xl bg-forest-700 text-white px-6 sm:px-12 py-12 sm:py-16 text-center">
          <Sprout className="h-8 w-8 mx-auto mb-4 text-forest-100" />
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
            Set up your farm profile in a few minutes
          </h2>
          <p className="text-forest-100 max-w-xl mx-auto mb-8">
            Answer a few short questions and start seeing insights for your
            own land right away.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-white text-forest-700 hover:bg-forest-50 px-5 py-3 text-base font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-5 sm:px-8 py-10 text-sm text-ink-soft border-t border-line">
        {t("AgriNexus AI — a hackathon prototype. Data shown is sample data unless connected to a live source.")}
      </footer>
    </div>
  );
}
