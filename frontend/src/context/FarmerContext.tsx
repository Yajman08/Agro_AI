import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { FarmerProfile } from "../types";
import { getFarmerProfile, updateFarmerProfile } from "../services/api";
import { mockFarmerProfile } from "../data/mockData";
import { FarmerContext } from "./contextStore";
import { useAuth } from "../auth/useAuth";

export function FarmerProvider({ children }: { children: ReactNode }) {
  const { session, updateSessionProfile } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const farmerId = session?.farmerId ?? "farmer_1042";
  const sessionProfile = session?.farmerProfile ?? mockFarmerProfile;

  useEffect(() => {
    let cancelled = false;

    getFarmerProfile(farmerId, sessionProfile)
      .then((loadedProfile) => {
        if (!cancelled) {
          setProfile(loadedProfile);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "We couldn't load your farmer profile.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [farmerId, reloadKey, sessionProfile]);

  const reloadProfile = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  const saveProfile = useCallback(async (profileChanges: Partial<FarmerProfile>) => {
    setSaving(true);
    setSaveError(null);

    try {
      const currentProfile = profile ?? sessionProfile;
      const updatedProfile = await updateFarmerProfile(profileChanges, farmerId, currentProfile);
      setProfile(updatedProfile);
      updateSessionProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const message = err instanceof Error ? err.message : "We couldn't save your farmer profile.";
      setSaveError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [farmerId, profile, sessionProfile, updateSessionProfile]);

  const activeProfile = profile ?? sessionProfile;

  return (
    <FarmerContext.Provider
      value={{
        profile: activeProfile,
        loading: loading && !activeProfile,
        error,
        reloadProfile,
        saving,
        saveError,
        saveProfile,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
}

