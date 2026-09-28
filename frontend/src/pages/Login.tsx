import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import Card from "../components/common/Card";
import TextField from "../components/common/TextField";
import Button from "../components/common/Button";
import { useAuth } from "../auth/useAuth";
import { useTranslation } from "../i18n/useTranslation";

export default function Login() {
  const { login, demoLogin } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(identifier, password);
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const signInDemo = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await demoLogin();
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Demo sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas px-5 py-10 sm:flex sm:items-center sm:justify-center sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-700 text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-ink">AgriNexus AI</p>
            <p className="text-xs text-ink-soft">Farm intelligence for better decisions</p>
          </div>
        </div>

        <Card>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-700">Farmer sign in</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">{t("Login")}</h1>
          <p className="mt-1 text-sm text-ink-soft">Enter your account details or start with a demo farmer session.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <TextField
              label={t("Mobile number or email")}
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
            <TextField
              label={t("Password")}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && <p role="alert" className="border-l-2 border-sienna-500 bg-sienna-100 px-3 py-2 text-sm text-sienna-700">{error}</p>}
            <Button type="submit" fullWidth size="lg" disabled={submitting}>
              {submitting ? "Signing in..." : t("Sign in")}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
            <span className="h-px flex-1 bg-line" />
            <span>Hackathon demo</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <Button variant="secondary" fullWidth onClick={signInDemo} disabled={submitting}>
            {t("Demo Login")}
          </Button>
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
            Demo accounts: manjunath@example.test, lakshmi@example.test, arjun@example.test · Password: demo123
          </p>
        </Card>
        <p className="mt-5 text-center text-xs text-ink-soft">Mock frontend session. No backend authentication is used.</p>
      </div>
    </main>
  );
}