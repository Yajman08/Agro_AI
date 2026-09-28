import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import Card, { CardHeader } from "../components/common/Card";
import TextField from "../components/common/TextField";
import SelectField from "../components/common/SelectField";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import { useFarmer } from "../context/useFarmer";
import LanguageSelector from "../i18n/LanguageSelector";
import { useTranslation } from "../i18n/useTranslation";
import { useAuth } from "../auth/useAuth";
import { Pencil, Check, LogOut } from "lucide-react";
import type { FarmerProfile } from "../types";

export default function Profile() {
  const { profile, loading, error, reloadProfile, saveProfile, saving: profileSaving, saveError } =
    useFarmer();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FarmerProfile | null>(null);

  if (loading) {
    return (
      <AppLayout>
        <Header title="Farm profile" />
        <Loading message="Loading your profile..." />
      </AppLayout>
    );
  }

  if (error || !profile) {
    return (
      <AppLayout>
        <Header title="Farm profile" />
        <ErrorState
          message={error ?? "Your farmer profile is not available yet."}
          onRetry={reloadProfile}
        />
      </AppLayout>
    );
  }

  const save = async () => {
    if (!form) return;
    try {
      const updated = await saveProfile(form);
      setForm(updated);
      setEditing(false);
    } catch {
      // The shared save error is rendered below the form.
    }
  };

  const currentProfile = form ?? profile;

  return (
    <AppLayout>
      <Header title="Farm profile" subtitle="Your details, used to personalize every screen" />

      <div className="max-w-xl space-y-6">
        <Card>
          <CardHeader
            title="Farmer details"
            action={
              !editing ? (
                <Button variant="ghost" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>
                  Edit
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Check className="h-3.5 w-3.5" />}
                  onClick={save}
                  disabled={profileSaving}
                >
                  {profileSaving ? "Saving..." : "Save"}
                </Button>
              )
            }
          />

          {editing ? (
            <div className="space-y-4">
              <TextField
                label="Full name"
                value={currentProfile.name}
                onChange={(e) => setForm({ ...currentProfile, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Village"
                  value={currentProfile.location.village}
                  onChange={(e) =>
                    setForm({ ...currentProfile, location: { ...currentProfile.location, village: e.target.value } })
                  }
                />
                <TextField
                  label="District"
                  value={currentProfile.location.district}
                  onChange={(e) =>
                    setForm({ ...currentProfile, location: { ...currentProfile.location, district: e.target.value } })
                  }
                />
              </div>
              <TextField
                label="Farm size (acres)"
                type="number"
                value={currentProfile.farm.sizeAcres}
                onChange={(e) =>
                  setForm({ ...currentProfile, farm: { ...currentProfile.farm, sizeAcres: Number(e.target.value) } })
                }
              />
              <SelectField
                label="Irrigation type"
                options={["Rainfed", "Canal", "Borewell", "Drip", "Mixed"]}
                value={currentProfile.farm.irrigationType}
                onChange={(e) =>
                  setForm({
                    ...currentProfile,
                    farm: { ...currentProfile.farm, irrigationType: e.target.value as FarmerProfile["farm"]["irrigationType"] },
                  })
                }
              />
              <TextField
                label="Current crop"
                value={currentProfile.currentCrop}
                onChange={(e) => setForm({ ...currentProfile, currentCrop: e.target.value })}
              />
              <TextField
                label="Preferred language"
                value={currentProfile.preferredLanguage}
                onChange={(e) => setForm({ ...currentProfile, preferredLanguage: e.target.value })}
              />
              <TextField
                label="Soil pH"
                type="number"
                step="0.1"
                value={currentProfile.soil?.ph ?? ""}
                onChange={(e) =>
                  setForm({
                    ...currentProfile,
                    soil: e.target.value ? { ph: Number(e.target.value) } : undefined,
                  })
                }
              />
            </div>
          ) : (
            <dl className="divide-y divide-line">
              <Row label="Name" value={currentProfile.name} />
              <Row
                label="Location"
                value={`${currentProfile.location.village}, ${currentProfile.location.district}, ${currentProfile.location.state}`}
              />
              <Row label="Farm size" value={`${currentProfile.farm.sizeAcres} acres`} />
              <Row label="Irrigation" value={currentProfile.farm.irrigationType} />
              <Row label="Current crop" value={currentProfile.currentCrop} />
              <Row label="Preferred language" value={currentProfile.preferredLanguage} />
              <Row
                label="Soil pH"
                value={currentProfile.soil?.ph?.toString() ?? "Not provided"}
              />
            </dl>
          )}
        </Card>
        <Card>
          <CardHeader title={t("Language")} subtitle={t("Choose the language for the application interface.")} />
          <LanguageSelector />
        </Card>
        {saveError && <ErrorState message={saveError} onRetry={save} />}
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

function Row({ label, value }: { label: string; value: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <dt className="text-sm text-ink-soft">{t(label)}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
