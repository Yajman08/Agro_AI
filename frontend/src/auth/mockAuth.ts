import type { FarmerProfile } from "../types";
import { mockFarmerProfile } from "../data/mockData";

export interface MockAuthSession {
  farmerId: string;
  email: string;
  farmerProfile: FarmerProfile;
}

export const AUTH_SESSION_KEY = "agrinexus.authSession";

const demoProfiles: MockAuthSession[] = [
  {
    farmerId: "farmer_1042",
    email: "manjunath@example.test",
    farmerProfile: mockFarmerProfile,
  },
  {
    farmerId: "farmer_2087",
    email: "lakshmi@example.test",
    farmerProfile: {
      ...mockFarmerProfile,
      id: "farmer_2087",
      name: "Lakshmi",
      location: { ...mockFarmerProfile.location, village: "Mysuru", district: "Mysuru" },
      currentCrop: "Ragi",
    },
  },
  {
    farmerId: "farmer_3194",
    email: "arjun@example.test",
    farmerProfile: {
      ...mockFarmerProfile,
      id: "farmer_3194",
      name: "Arjun",
      location: { ...mockFarmerProfile.location, village: "Dharwad", district: "Dharwad" },
      currentCrop: "Maize",
    },
  },
];

export function readMockSession(): MockAuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const serialized = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!serialized) return null;
    const session = JSON.parse(serialized) as MockAuthSession;
    return session.farmerId && session.farmerProfile ? session : null;
  } catch {
    return null;
  }
}

export function saveMockSession(session: MockAuthSession): void {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearMockSession(): void {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export async function loginMockUser(identifier: string, password: string): Promise<MockAuthSession> {
  const normalized = identifier.trim().toLowerCase();
  const session = demoProfiles.find(
    (candidate) => candidate.email === normalized || candidate.farmerProfile.phone === identifier.trim()
  );

  if (!session || password !== "demo123") {
    throw new Error("That demo sign-in did not match. Use Demo Login or a listed demo account with password demo123.");
  }
  return session;
}

export async function loginDemoFarmer(farmerId = "farmer_1042"): Promise<MockAuthSession> {
  const session = demoProfiles.find((candidate) => candidate.farmerId === farmerId);
  if (!session) throw new Error("This demo farmer is unavailable.");
  return session;
}

export async function registerNewFarmer(params: {
  name: string;
  email: string;
  village: string;
  district: string;
  state: string;
  sizeAcres?: number;
  currentCrop?: string;
}): Promise<MockAuthSession> {
  const newId = `farmer_${Date.now()}`;
  const profile: FarmerProfile = {
    id: newId,
    name: params.name.trim() || "Judge / Guest",
    phone: params.email.includes("@") ? undefined : params.email.trim(),
    location: {
      village: params.village.trim() || "Mandya",
      district: params.district.trim() || "Mandya",
      state: params.state.trim() || "Karnataka",
      country: "India",
      latitude: 12.5218,
      longitude: 76.8951,
    },
    farm: {
      sizeAcres: params.sizeAcres && params.sizeAcres > 0 ? Number(params.sizeAcres) : 2.5,
      irrigationType: "Canal",
    },
    currentCrop: params.currentCrop?.trim() || "Rice",
    preferredLanguage: "English",
    onboardedAt: new Date().toISOString(),
    soil: { ph: 6.5 },
  };

  const session: MockAuthSession = {
    farmerId: newId,
    email: params.email.trim().toLowerCase() || "farmer@agrinexus.ai",
    farmerProfile: profile,
  };

  saveMockSession(session);
  return session;
}

export async function loginGuestFarmer(): Promise<MockAuthSession> {
  return registerNewFarmer({
    name: "Guest Judge",
    email: "judge@agrinexus.ai",
    village: "Mandya",
    district: "Mandya",
    state: "Karnataka",
    sizeAcres: 2.5,
    currentCrop: "Rice",
  });
}