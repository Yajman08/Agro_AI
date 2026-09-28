import { createContext } from "react";
import type { FarmerProfile } from "../types";

export interface FarmerContextValue {
  profile: FarmerProfile | null;
  loading: boolean;
  error: string | null;
  reloadProfile: () => void;
  saving: boolean;
  saveError: string | null;
  saveProfile: (profile: Partial<FarmerProfile>) => Promise<FarmerProfile>;
}

export const FarmerContext = createContext<FarmerContextValue | undefined>(undefined);