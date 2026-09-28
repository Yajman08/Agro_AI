import { ArrowUpRight, Check, Clock3, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import type { SoilMetric } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

export default function SoilActionPlan({ metrics }: { metrics: SoilMetric[] }) {
  const { t } = useTranslation();
  return (
    <section className="border-y border-line bg-surface px-0 py-6 sm:rounded-[1.25rem] sm:border sm:px-6 sm:py-7" aria-labelledby="soil-action-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700">
            <Layers className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{t("Soil action plan")}</p>
          </div>
          <h2 id="soil-action-title" className="mt-2 text-2xl font-semibold text-ink">{t("What to do next")}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t("Practical actions from the latest soil readings.")}</p>
        </div>
        <Link to="/advisory" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-forest-700 hover:underline">
          {t("Ask advisor")}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 divide-y divide-line">
        {metrics.map((metric, index) => (
          <div key={metric.key} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-50 text-forest-700">
              {metric.rating === "good" || metric.rating === "adequate" ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <div>
              <p className="font-semibold text-ink">{t(metric.action)}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t(metric.meaning)}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft sm:pt-1">
              <Clock3 className="h-3.5 w-3.5" />
              {t("From latest reading")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}