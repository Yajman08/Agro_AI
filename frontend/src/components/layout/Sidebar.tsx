import { NavLink } from "react-router-dom";
import { Sprout } from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navGroups, type NavItem } from "./navItems";
import { clsx } from "../../lib/clsx";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "../../i18n/useTranslation";

export default function Sidebar() {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 border-r border-line bg-surface">
      <NavLink to="/dashboard" className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-700 text-white">
          <Sprout className="h-4.5 w-4.5" />
        </span>
        <span className="font-display text-lg font-semibold text-ink">AgriNexus AI</span>
      </NavLink>

      <nav className="flex-1 px-3 py-4 space-y-5" aria-label="Primary">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70">
              {t(group.label)}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItemLink key={item.to} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line px-3 py-4">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
        >
          <LogOut className="h-4 w-4" />
          {t("Logout")}
        </button>
        <p className="px-3 pt-3 text-xs text-ink-soft">Built for interoperable agriculture — BRICS framework</p>
      </div>
    </aside>
  );
}

function NavItemLink({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: NavItem["icon"];
}) {
  const { t } = useTranslation();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-forest-50 text-forest-700"
            : "text-ink-soft hover:bg-black/5 hover:text-ink"
        )
      }
    >
      <Icon className="h-4.5 w-4.5" />
      {t(label)}
    </NavLink>
  );
}
