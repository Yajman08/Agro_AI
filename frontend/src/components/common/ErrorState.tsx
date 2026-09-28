import { AlertTriangle } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "../../i18n/useTranslation";

export default function ErrorState({
  message = "We couldn't retrieve the latest information.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center px-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sienna-100">
        <AlertTriangle className="h-5 w-5 text-sienna-700" />
      </span>
      <p className="text-sm text-ink-soft max-w-xs">{t(message)}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
