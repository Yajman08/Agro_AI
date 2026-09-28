import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import RequireAuth from "./auth/RequireAuth";
import { LanguageProvider } from "./i18n/LanguageContext";
import { FarmerProvider } from "./context/FarmerContext";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Weather from "./pages/Weather";
import Soil from "./pages/Soil";
import Crops from "./pages/Crops";
import Disease from "./pages/Disease";
import Advisory from "./pages/Advisory";
import Regenerative from "./pages/Regenerative";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <FarmerProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<SessionEntry />} />
              <Route element={<RequireAuth />}>
                <Route path="/home" element={<Home />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/soil" element={<Soil />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/disease" element={<Disease />} />
                <Route path="/advisory" element={<Advisory />} />
                <Route path="/regenerative" element={<Regenerative />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              <Route path="*" element={<SessionEntry />} />
            </Routes>
          </FarmerProvider>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

function SessionEntry() {
  const { session } = useAuth();
  return <Navigate to={session ? "/dashboard" : "/login"} replace />;
}