import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sprout, UserCheck, UserPlus, Sparkles, LogIn } from "lucide-react";
import Card from "../components/common/Card";
import TextField from "../components/common/TextField";
import Button from "../components/common/Button";
import { useAuth } from "../auth/useAuth";
import { useFarmer } from "../context/useFarmer";
import { useTranslation } from "../i18n/useTranslation";

import LocationPicker from "../components/common/LocationPicker";

type ActiveTab = "guest" | "register" | "signin";

export default function Login() {
  const { login, demoLogin, guestLogin, registerFarmer } = useAuth();
  const { saveProfile } = useFarmer();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState<ActiveTab>("guest");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regVillage, setRegVillage] = useState("Bengaluru");
  const [regDistrict, setRegDistrict] = useState("Bengaluru Urban");
  const [regState, setRegState] = useState("Karnataka");
  const [regLat, setRegLat] = useState(12.9716);
  const [regLon, setRegLon] = useState(77.5946);
  const [regSize, setRegSize] = useState("2.5");
  const [regCrop, setRegCrop] = useState("Rice");

  // Sign In Form State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const destination =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

  // 1. Guest Access (Instant 1-Click for Judges)
  const handleGuestLogin = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await guestLogin();
      // Sync guest profile to backend
      await saveProfile({
        name: "Guest Judge",
        location: {
          village: "Mandya",
          district: "Mandya",
          state: "Karnataka",
          country: "India",
          latitude: 12.5218,
          longitude: 76.8951,
        },
        farm: { sizeAcres: 2.5, irrigationType: "Canal" },
        currentCrop: "Rice",
      });
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Guest access failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Create Farmer Account
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError("Please enter your name.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await registerFarmer({
        name: regName.trim(),
        email: regEmail.trim(),
        village: regVillage.trim() || "Mandya",
        district: regDistrict.trim() || "Mandya",
        state: regState.trim() || "Karnataka",
        sizeAcres: Number(regSize) || 2.5,
        currentCrop: regCrop.trim() || "Rice",
      });

      // Sync custom registered profile to backend API
      await saveProfile({
        name: regName.trim(),
        location: {
          village: regVillage.trim() || "Bengaluru",
          district: regDistrict.trim() || "Bengaluru Urban",
          state: regState.trim() || "Karnataka",
          country: "India",
          latitude: regLat,
          longitude: regLon,
        },
        farm: { sizeAcres: Number(regSize) || 2.5, irrigationType: "Canal" },
        currentCrop: regCrop.trim() || "Rice",
      });

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Traditional Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(identifier, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Quick Demo Farmers
  const handleDemoFarmer = async (farmerId: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await demoLogin(farmerId);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:flex sm:items-center sm:justify-center sm:py-12">
      <div className="mx-auto w-full max-w-lg">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-700 text-white shadow-sm">
            <Sprout className="h-6 w-6" />
          </span>
          <div className="text-left">
            <p className="font-display text-xl font-semibold text-ink">AgriNexus AI</p>
            <p className="text-xs text-ink-soft">Interoperable Digital Agriculture Platform</p>
          </div>
        </div>

        <Card className="shadow-md">
          {/* Tab Navigation */}
          <div className="mb-6 flex border-b border-line pb-2 gap-2">
            <button
              onClick={() => { setTab("guest"); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                tab === "guest"
                  ? "bg-forest-50 text-forest-700 border border-forest-200"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Guest Judge
            </button>
            <button
              onClick={() => { setTab("register"); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                tab === "register"
                  ? "bg-forest-50 text-forest-700 border border-forest-200"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </button>
            <button
              onClick={() => { setTab("signin"); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                tab === "signin"
                  ? "bg-forest-50 text-forest-700 border border-forest-200"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          </div>

          {/* TAB 1: GUEST ACCESS (RECOMMENDED FOR HACKATHON JUDGES) */}
          {tab === "guest" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-forest-50/70 p-4 border border-forest-200/60">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-forest-700 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-semibold text-ink">Welcome, Hackathon Judge!</h2>
                    <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                      Click below to explore all 7 AI & data features immediately as a Guest. No credentials or setup required.
                    </p>
                  </div>
                </div>
              </div>

              {error && <p className="border-l-2 border-sienna-500 bg-sienna-100 px-3 py-2 text-xs text-sienna-700">{error}</p>}

              <Button
                fullWidth
                size="lg"
                icon={<Sparkles className="h-4 w-4" />}
                onClick={handleGuestLogin}
                disabled={submitting}
              >
                {submitting ? "Entering Prototype..." : "⚡ Continue as Guest (Instant Access)"}
              </Button>

              <div className="pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-2 text-center">
                  Or Test Pre-Configured Demo Farmers
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleDemoFarmer("farmer_1042")}
                    disabled={submitting}
                    className="rounded-lg border border-line bg-surface p-2 text-center text-xs hover:border-forest-500 hover:bg-forest-50/50"
                  >
                    <p className="font-medium text-ink">Manjunath</p>
                    <p className="text-[10px] text-ink-soft">Rice · Mandya</p>
                  </button>
                  <button
                    onClick={() => handleDemoFarmer("farmer_2087")}
                    disabled={submitting}
                    className="rounded-lg border border-line bg-surface p-2 text-center text-xs hover:border-forest-500 hover:bg-forest-50/50"
                  >
                    <p className="font-medium text-ink">Lakshmi</p>
                    <p className="text-[10px] text-ink-soft">Ragi · Mysuru</p>
                  </button>
                  <button
                    onClick={() => handleDemoFarmer("farmer_3194")}
                    disabled={submitting}
                    className="rounded-lg border border-line bg-surface p-2 text-center text-xs hover:border-forest-500 hover:bg-forest-50/50"
                  >
                    <p className="font-medium text-ink">Arjun</p>
                    <p className="text-[10px] text-ink-soft">Maize · Dharwad</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE FARMER ACCOUNT */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <h2 className="text-sm font-semibold text-ink">Create Custom Farmer Account</h2>
              <p className="text-xs text-ink-soft mb-3">Your custom name & location will be used across weather, soil, and crop models.</p>

              <TextField
                label="Full Name"
                placeholder="e.g. Dr. Alex Smith"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />

              <LocationPicker
                onLocationSelected={(latitude, longitude, name) => {
                  setRegLat(latitude);
                  setRegLon(longitude);
                  setRegVillage(name);
                }}
              />

              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Email / Mobile"
                  placeholder="alex@judge.org"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                <TextField
                  label="Village / Town"
                  placeholder="Mandya"
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="District"
                  placeholder="Mandya"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                />
                <TextField
                  label="State"
                  placeholder="Karnataka"
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Farm Size (Acres)"
                  type="number"
                  step="0.5"
                  value={regSize}
                  onChange={(e) => setRegSize(e.target.value)}
                />
                <TextField
                  label="Current Crop"
                  placeholder="Rice"
                  value={regCrop}
                  onChange={(e) => setRegCrop(e.target.value)}
                />
              </div>

              {error && <p className="border-l-2 border-sienna-500 bg-sienna-100 px-3 py-2 text-xs text-sienna-700">{error}</p>}

              <Button type="submit" fullWidth size="lg" disabled={submitting} className="mt-2">
                {submitting ? "Creating Account..." : "🚀 Create Account & Open Dashboard"}
              </Button>
            </form>
          )}

          {/* TAB 3: TRADITIONAL SIGN IN */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <h2 className="text-sm font-semibold text-ink">Demo Sign In</h2>
              <TextField
                label={t("Mobile number or email")}
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
              <TextField
                label={t("Password")}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {error && <p className="border-l-2 border-sienna-500 bg-sienna-100 px-3 py-2 text-xs text-sienna-700">{error}</p>}
              <Button type="submit" fullWidth size="lg" disabled={submitting}>
                {submitting ? "Signing in..." : t("Sign in")}
              </Button>
              <p className="text-center text-xs text-ink-soft pt-1">
                Demo accounts: manjunath@example.test · Password: demo123
              </p>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}