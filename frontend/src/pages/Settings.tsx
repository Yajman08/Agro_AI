import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import Card, { CardHeader } from "../components/common/Card";
import SelectField from "../components/common/SelectField";
import Button from "../components/common/Button";
import LanguageSelector from "../i18n/LanguageSelector";
import { useTranslation } from "../i18n/useTranslation";
import { useAuth } from "../auth/useAuth";
import { Bell, Globe, LogOut, Ruler } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("Metric (°C, mm)");
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Header title="Settings" subtitle="Manage how AgriNexus AI works for you" />

      <div className="max-w-xl space-y-6">
        <Card>
          <CardHeader title="Notifications" />
          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <Bell className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm text-ink">{t("Advisory and weather alerts")}</span>
            </span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-5 w-9 rounded-full appearance-none bg-black/10 checked:bg-forest-600 relative transition-colors cursor-pointer before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-transform"
              aria-label="Toggle advisory and weather alerts"
            />
          </label>
        </Card>

        <Card>
          <CardHeader title="Preferences" />
          <div className="space-y-4">
            <LanguageSelector />
            <SelectField
              label="Units"
              options={["Metric (°C, mm)", "Imperial (°F, in)"]}
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="About" />
          <div className="space-y-3 text-sm text-ink-soft">
            <p className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("AgriNexus AI — BRICS interoperability framework, v0.1 (hackathon prototype)")}
            </p>
            <p className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              {t("Data shown throughout this app is sample data unless connected to a live source.")}
            </p>
          </div>
        </Card>

        <Button
          variant="ghost"
          icon={<LogOut className="h-4 w-4" />}
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          {t("Logout")}
        </Button>
      </div>
    </AppLayout>
  );
}
