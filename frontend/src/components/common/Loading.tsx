import { Sprout } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

export default function Loading({ message = "Loading…" }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft"
    >
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-100 opacity-75" />
        <Sprout className="relative h-5 w-5 text-forest-600" />
      </span>
      <p className="text-sm">{t(message)}</p>
    </div>
  );
}
