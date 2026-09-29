import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { FarmerProfile } from "../types";
import {
  clearMockSession,
  loginDemoFarmer,
  loginGuestFarmer,
  loginMockUser,
  readMockSession,
  registerNewFarmer,
  saveMockSession,
} from "./mockAuth";
import type { MockAuthSession } from "./mockAuth";
import { AuthContext } from "./authContextStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MockAuthSession | null>(() => readMockSession());

  const login = useCallback(async (identifier: string, password: string) => {
    const nextSession = await loginMockUser(identifier, password);
    saveMockSession(nextSession);
    setSession(nextSession);
  }, []);

  const demoLogin = useCallback(async (farmerId?: string) => {
    const nextSession = await loginDemoFarmer(farmerId);
    saveMockSession(nextSession);
    setSession(nextSession);
  }, []);

  const guestLogin = useCallback(async () => {
    const nextSession = await loginGuestFarmer();
    saveMockSession(nextSession);
    setSession(nextSession);
  }, []);

  const registerFarmer = useCallback(
    async (params: {
      name: string;
      email: string;
      village: string;
      district: string;
      state: string;
      sizeAcres?: number;
      currentCrop?: string;
    }) => {
      const nextSession = await registerNewFarmer(params);
      saveMockSession(nextSession);
      setSession(nextSession);
    },
    []
  );

  const logout = useCallback(() => {
    clearMockSession();
    setSession(null);
  }, []);

  const updateSessionProfile = useCallback((profile: FarmerProfile) => {
    setSession((current) => {
      if (!current) return current;
      const updated = { ...current, farmerProfile: profile };
      saveMockSession(updated);
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ session, login, demoLogin, guestLogin, registerFarmer, logout, updateSessionProfile }),
    [session, login, demoLogin, guestLogin, registerFarmer, logout, updateSessionProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}