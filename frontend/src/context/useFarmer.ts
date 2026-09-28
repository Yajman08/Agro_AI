import { useContext } from "react";
import { FarmerContext } from "./contextStore";

export function useFarmer() {
  const ctx = useContext(FarmerContext);
  if (!ctx) throw new Error("useFarmer must be used within a FarmerProvider");
  return ctx;
}