import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t } = useTranslation();
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 sticky top-0 z-20 bg-canvas/90 backdrop-blur border-b border-line lg:border-none">
      <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-700 text-white">
          <Sprout className="h-4.5 w-4.5" />
        </span>
      </Link>
      <div className="hidden lg:block">
        <h1 className="text-2xl font-semibold text-ink">{t(title)}</h1>
        {subtitle && <p className="text-ink-soft mt-0.5">{t(subtitle)}</p>}
      </div>
      <div className="lg:hidden">
        <h1 className="text-lg font-semibold text-ink">{t(title)}</h1>
      </div>
    </header>
  );
}
