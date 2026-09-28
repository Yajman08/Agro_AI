import { Info } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

export default function DataProvenance({
  source,
  updated,
  aiGenerated = true,
}: {
  source: string;
  updated?: string;
  aiGenerated?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 mt-4 border-t border-line text-xs text-ink-soft">
      <span className="inline-flex items-center gap-1">
        <Info className="h-3.5 w-3.5" />
        {t("Data source")}: {source}
      </span>
      {updated && <span>{t("Last updated")}: {updated}</span>}
      {aiGenerated && <span>{t("AI-generated")} — based on available data</span>}
    </div>
  );
}
