import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { AdvisoryAction } from "../../types";
import PriorityBadge from "../advisory/PriorityBadge";
import EmptyState from "../common/EmptyState";
import { useTranslation } from "../../i18n/useTranslation";

export default function FarmActionQueue({ actions }: { actions: AdvisoryAction[] }) {
  const { t } = useTranslation();
  return (
    <section
      className="border-y border-line bg-surface px-0 py-6 sm:rounded-[1.25rem] sm:border sm:px-6 sm:py-7"
      aria-labelledby="farm-plan-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700">
            <Sparkles className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{t("AI action plan")}</p>
          </div>
          <h2 id="farm-plan-title" className="mt-2 text-2xl font-semibold text-ink">
            {t("Today's farm plan")}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t("The next few actions that matter most for this farm.")}</p>
        </div>
        <Link
          to="/advisory"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-forest-700 hover:underline"
        >
          {t("Full plan")}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {actions.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="No actions yet"
          description="Your next farm actions will appear when the available signals are ready."
        />
      ) : (
        <div className="mt-6 divide-y divide-line">
          {actions.slice(0, 3).map((action, index) => (
            <div key={action.id} className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-50 font-display text-sm font-semibold text-forest-700">
                {index + 1}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink">{action.title}</h3>
                  <PriorityBadge priority={action.priority} />
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{action.reason}</p>
                <div className="mt-3 border-l-2 border-forest-300 pl-3">
                  <p className="text-sm font-medium text-ink">{action.action}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                    <Clock3 className="h-3.5 w-3.5" />
                    {action.timing}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-ink-soft sm:pt-1">
                {t(action.category)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}