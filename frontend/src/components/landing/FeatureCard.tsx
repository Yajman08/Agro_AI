import type { ComponentType } from "react";
import { useTranslation } from "../../i18n/useTranslation";

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700 mb-4">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-semibold text-ink mb-1.5">{t(title)}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{t(description)}</p>
    </div>
  );
}
