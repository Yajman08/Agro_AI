import { NavLink } from "react-router-dom";
import { mobileNav } from "./navItems";
import { clsx } from "../../lib/clsx";
import { useTranslation } from "../../i18n/useTranslation";

export default function MobileNav() {
  const { t } = useTranslation();
  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-line pb-[env(safe-area-inset-bottom,0px)]"
    >
      <ul className="flex items-stretch justify-between px-1">
        {mobileNav.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-forest-700" : "text-ink-soft"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {t(label)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
