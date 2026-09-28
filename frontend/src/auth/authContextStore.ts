import { createContext } from "react";
import type { FarmerProfile } from "../types";
import type { MockAuthSession } from "./mockAuth";

export interface AuthContextValue {
  session: MockAuthSession | null;
  login: (identifier: string, password: string) => Promise<void>;
  demoLogin: (farmerId?: string) => Promise<void>;
  logout: () => void;
  updateSessionProfile: (profile: FarmerProfile) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);