import type {
  FarmerProfile,
  WeatherData,
  SoilData,
  CropRecommendation,
  DiseaseResult,
  AdvisoryData,
} from "../types";
import {
  mockFarmerProfile,
  mockWeather,
  mockSoil,
  mockCropRecommendation,
  mockDiseaseResultSick,
  mockDiseaseResultHealthy,
  mockAdvisory,
} from "../data/mockData";

// ----------------------------------------------------------------------------
// API SERVICE LAYER
//
// Every function below currently resolves with MOCK DATA after a small
// artificial delay, so loading states are visible during development.
//
// When the FastAPI + ML backend is ready, replace the body of each function
// with a real `fetch` call to VITE_API_BASE_URL — the function signatures and
// return types are already shaped to match the documented backend contracts,
// so no component code should need to change.
//
// Example of the real implementation for getWeather():
//
//   export async function getWeather(lat: number, lon: number) {
//     const res = await fetch(`${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`);
//     if (!res.ok) throw new ApiError("Failed to load weather", res.status);
//     return (await res.json()) as WeatherData;
//   }
// ----------------------------------------------------------------------------

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function delay<T>(value: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const FARMER_PROFILE_STORAGE_KEY = "agrinexus.farmerProfile";

function farmerProfileStorageKey(farmerId: string) {
  return farmerId === mockFarmerProfile.id
    ? FARMER_PROFILE_STORAGE_KEY
    : `${FARMER_PROFILE_STORAGE_KEY}.${farmerId}`;
}

function readStoredFarmerProfile(farmerId: string): FarmerProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(farmerProfileStorageKey(farmerId));
    return stored ? (JSON.parse(stored) as FarmerProfile) : null;
  } catch {
    throw new ApiError("We couldn't load your saved farmer profile.");
  }
}

function storeFarmerProfile(profile: FarmerProfile, farmerId: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(farmerProfileStorageKey(farmerId), JSON.stringify(profile));
  } catch {
    throw new ApiError("We couldn't save your farmer profile locally.");
  }
}

export async function getFarmerProfile(
  farmerId = mockFarmerProfile.id,
  fallbackProfile: FarmerProfile = mockFarmerProfile
): Promise<FarmerProfile> {
  // Real endpoint: GET /api/farmer/profile
  return delay(readStoredFarmerProfile(farmerId) ?? fallbackProfile);
}

export async function updateFarmerProfile(
  profile: Partial<FarmerProfile>,
  farmerId = mockFarmerProfile.id,
  fallbackProfile: FarmerProfile = mockFarmerProfile
): Promise<FarmerProfile> {
  // Real endpoint: PUT /api/farmer/profile
  const current = readStoredFarmerProfile(farmerId) ?? fallbackProfile;
  const updated: FarmerProfile = {
    ...current,
    ...profile,
    location: { ...current.location, ...(profile.location ?? {}) },
    farm: { ...current.farm, ...(profile.farm ?? {}) },
  };
  storeFarmerProfile(updated, farmerId);
  return delay(updated, 500);
}

export async function getWeather(
  latitude?: number,
  longitude?: number
): Promise<WeatherData> {
  if (latitude === undefined || longitude === undefined) {
    throw new ApiError(
      "Latitude and longitude are required for weather data."
    );
  }

  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });

  const res = await fetch(
    `${API_BASE_URL}/api/weather?${params.toString()}`
  );

  if (!res.ok) {
    const message = await res.text();

    throw new ApiError(
      message || "Failed to load weather data",
      res.status
    );
  }

  return (await res.json()) as WeatherData;
}

export async function getSoilData(
  latitude?: number,
  longitude?: number
): Promise<SoilData> {
  const params = new URLSearchParams();

  if (latitude !== undefined) {
    params.set("lat", String(latitude));
  }

  if (longitude !== undefined) {
    params.set("lon", String(longitude));
  }

  const res = await fetch(
    `${API_BASE_URL}/api/soil?${params.toString()}`
  );

  if (!res.ok) {
    const message = await res.text();

    throw new ApiError(
      message || "Failed to load soil data",
      res.status
    );
  }

  return (await res.json()) as SoilData;
}

export interface CropRecommendationRequest {
  latitude: number;
  longitude: number;
  month: number;
}

export async function getCropRecommendation(
  request: CropRecommendationRequest
): Promise<CropRecommendation> {
  const res = await fetch(`${API_BASE_URL}/api/crop-recommendation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new ApiError(
      message || "Failed to get crop recommendation",
      res.status
    );
  }

  return (await res.json()) as CropRecommendation;
}

export async function detectDisease(_imageFile: File): Promise<DiseaseResult> {
  // Real endpoint: POST /api/disease-detection (multipart/form-data)
  // Mock: alternate between a detected issue and a healthy result so the
  // UI's two result states are both easy to demo.
  const isHealthySample = Math.random() > 0.5;
  return delay(isHealthySample ? mockDiseaseResultHealthy : mockDiseaseResultSick, 1400);
}

export async function getAdvisory(_question?: string): Promise<AdvisoryData> {
  // Real endpoint: POST /api/advisory
  return delay(mockAdvisory, 800);
}
