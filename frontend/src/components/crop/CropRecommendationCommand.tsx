import { ArrowUpRight, Wheat } from "lucide-react";
import { Link } from "react-router-dom";
import type { CropRecommendation } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

export default function CropRecommendationCommand({
  data,
  currentCrop,
}: {
  data: CropRecommendation;
  currentCrop: string;
}) {
  const { t } = useTranslation();
  return (
    <section className="overflow-hidden rounded-[1.5rem] bg-command text-white shadow-[0_18px_45px_rgba(32,54,41,0.18)]" aria-labelledby="crop-command-title">
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)]">
        <div className="p-5 sm:p-7 lg:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-100/75">{t("Crop suitability command")}</p>
              <h2 id="crop-command-title" className="mt-2 text-2xl sm:text-3xl font-semibold text-white">{t("What crop fits this farm?")}</h2>
              <p className="mt-1 text-sm text-forest-100/75">{t("A recommendation built from the available farm signals.")}</p>
            </div>
            <Wheat className="h-6 w-6 shrink-0 text-moss" />
          </div>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-100/70">{t("Recommended crop")}</p>
              <p className="mt-2 font-display text-5xl font-semibold text-white">{data.primary.crop}</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-forest-100/80">
                {data.primary.reasons[0] ?? "This is the strongest available crop match for the current farm context."}
              </p>
            </div>
            <div className="text-left sm:min-w-[10rem] sm:text-right">
              <p className="font-display text-5xl font-semibold text-white">{data.primary.confidencePct}%</p>
              <p className="text-xs text-forest-100/70">{t("overall suitability")}</p>
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-xs text-forest-100/70">
              <span>{t("Recommendation confidence")}</span>
              <span>{data.primary.confidencePct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Crop recommendation confidence" aria-valuenow={data.primary.confidencePct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-moss transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, data.primary.confidencePct))}%` }} />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.04] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-100/75">{t("Farm crop context")}</p>
          <div className="mt-5 space-y-4">
            <ContextLine label="Current crop" value={currentCrop || "Not provided"} />
            <ContextLine label="Recommended season" value={data.season} />
            <ContextLine label="Model status" value="Sample recommendation" />
          </div>
          <Link to="/advisory" className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-forest-100 hover:text-white hover:underline">
            {t("Ask the farm advisor")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContextLine({ label, value }: { label: string; value: string }) {
  const { t } = useTranslation();
  return (
    <div className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <p className="text-xs text-forest-100/65">{t(label)}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}