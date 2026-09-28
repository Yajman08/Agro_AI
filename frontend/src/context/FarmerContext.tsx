import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { FarmerProfile } from "../types";
import { getFarmerProfile, updateFarmerProfile } from "../services/api";
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
  const farmerId = session?.farmerId;
  const sessionProfile = session?.farmerProfile;

  useEffect(() => {
    let cancelled = false;

    if (!farmerId || !sessionProfile) return;

    getFarmerProfile(farmerId, sessionProfile)
      .then((loadedProfile) => {
        if (!cancelled) setProfile(loadedProfile);
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
      if (!farmerId || !profile) throw new Error("Sign in to save this farmer profile.");
      const updatedProfile = await updateFarmerProfile(profileChanges, farmerId, profile);
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
  }, [farmerId, profile, updateSessionProfile]);

  return (
    <FarmerContext.Provider
      value={{
        profile: farmerId && profile?.id === farmerId ? profile : null,
        loading: Boolean(farmerId) && (loading || profile?.id !== farmerId),
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

