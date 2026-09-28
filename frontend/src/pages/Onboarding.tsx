import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Sprout } from "lucide-react";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import TextField from "../components/common/TextField";
import SelectField from "../components/common/SelectField";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ErrorState from "../components/common/ErrorState";
import { useFarmer } from "../context/useFarmer";
import { mockFarmerProfile } from "../data/mockData";
import type { FarmerProfile } from "../types";
import { useTranslation } from "../i18n/useTranslation";

const stepLabels = ["Name", "Location", "Farm", "Crop", "Soil"];

interface FormState {
  name: string;
  village: string;
  district: string;
  state: string;
  sizeAcres: string;
  irrigationType: string;
  currentCrop: string;
  soilPh: string;
  soilKnown: boolean;
}

const initialForm: FormState = {
  name: "",
  village: "",
  district: "",
  state: "Karnataka",
  sizeAcres: "",
  irrigationType: "Rainfed",
  currentCrop: "",
  soilPh: "",
  soilKnown: false,
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, saveProfile, saving, saveError } = useFarmer();

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = async () => {
    const baseProfile = profile ?? mockFarmerProfile;
    const updatedProfile: Partial<FarmerProfile> = {
      name: form.name.trim(),
      location: {
        ...baseProfile.location,
        village: form.village.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
      },
      farm: {
        ...baseProfile.farm,
        sizeAcres: Number(form.sizeAcres),
        irrigationType: form.irrigationType as FarmerProfile["farm"]["irrigationType"],
      },
      currentCrop: form.currentCrop.trim(),
      soil: form.soilPh.trim() ? { ph: Number(form.soilPh) } : undefined,
      onboardedAt: new Date().toISOString(),
    };

    try {
      await saveProfile(updatedProfile);
      setDone(true);
    } catch {
      // The shared save error is rendered below the form.
    }
  };

  const canProceed = (() => {
    switch (step) {
      case 1:
        return form.name.trim().length > 0;
      case 2:
        return form.village.trim().length > 0 && form.district.trim().length > 0;
      case 3:
        return form.sizeAcres.trim().length > 0;
      case 4:
        return form.currentCrop.trim().length > 0;
      default:
        return true;
    }
  })();

  if (done) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-5">
        <Card className="max-w-md w-full text-center py-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 text-forest-700 mx-auto mb-5">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-semibold text-ink mb-2">
            {t("Your farm profile is ready.")}
          </h1>
          <p className="text-ink-soft mb-8">
            {t("We'll use this to personalize weather, soil and crop guidance for your land.")}
          </p>
          <Button size="lg" fullWidth onClick={() => navigate("/dashboard")}>
            Go to dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-5 py-10 sm:py-16">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-700 text-white">
            <Sprout className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-semibold text-ink">AgriNexus AI</span>
        </div>

        <OnboardingProgress step={step} total={5} labels={stepLabels} />

        <Card>
          {step === 1 && (
            <StepShell title="What's your name?" subtitle="We'll use this to greet you on your dashboard.">
              <TextField
                label="Full name"
                placeholder="e.g. Manjunath"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                autoFocus
              />
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Where is your farm?" subtitle="This helps us pull accurate weather and soil data.">
              <div className="space-y-4">
                <TextField
                  label="Village / town"
                  placeholder="e.g. Krishnarajpete"
                  value={form.village}
                  onChange={(e) => update({ village: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="District"
                    placeholder="e.g. Mandya"
                    value={form.district}
                    onChange={(e) => update({ district: e.target.value })}
                  />
                  <TextField
                    label="State"
                    value={form.state}
                    onChange={(e) => update({ state: e.target.value })}
                  />
                </div>
              </div>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="Tell us about your farm" subtitle="A rough estimate is fine.">
              <div className="space-y-4">
                <TextField
                  label="Farm size (acres)"
                  type="number"
                  min="0"
                  placeholder="e.g. 2.5"
                  value={form.sizeAcres}
                  onChange={(e) => update({ sizeAcres: e.target.value })}
                />
                <SelectField
                  label="Irrigation type"
                  options={["Rainfed", "Canal", "Borewell", "Drip", "Mixed"]}
                  value={form.irrigationType}
                  onChange={(e) => update({ irrigationType: e.target.value })}
                />
              </div>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="What are you currently growing?" subtitle="If your land is empty right now, tell us your last crop.">
              <TextField
                label="Current crop"
                placeholder="e.g. Rice"
                value={form.currentCrop}
                onChange={(e) => update({ currentCrop: e.target.value })}
              />
            </StepShell>
          )}

          {step === 5 && (
            <StepShell
              title="Do you have a recent soil test?"
              subtitle="Optional — we can estimate this for your area if not."
            >
              <div className="space-y-4">
                <TextField
                  label="Soil pH (if known)"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 6.4"
                  value={form.soilPh}
                  onChange={(e) => update({ soilPh: e.target.value, soilKnown: true })}
                />
                <p className="text-xs text-ink-soft">
                  Don't have this handy? Leave it blank — we'll use estimated
                  values for your area until your next test.
                </p>
              </div>
            </StepShell>
          )}

          {saveError && <ErrorState message={saveError} onRetry={finish} />}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-line">
            <Button variant="ghost" onClick={back} disabled={step === 1}>
              Back
            </Button>
            {step < 5 ? (
              <Button onClick={next} disabled={!canProceed}>
                Continue
              </Button>
            ) : (
              <Button onClick={finish} disabled={saving}>
                {saving ? "Saving..." : "Finish setup"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-xl font-semibold text-ink mb-1.5">{t(title)}</h2>
      {subtitle && <p className="text-sm text-ink-soft mb-6">{t(subtitle)}</p>}
      {children}
    </div>
  );
}
