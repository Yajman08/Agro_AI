import type {
  FarmerProfile,
  WeatherData,
  SoilData,
  CropRecommendation,
  DiseaseResult,
  AdvisoryData,
  AdvisoryContextPayload,
  RegenerativePractice,
  EnvironmentData,
  GeocodeResult,
} from "../types";
import {
  mockFarmerProfile,
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

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://freeware-dana-switching-contamination.trycloudflare.com";

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
  try {
    const res = await fetch(`${API_BASE_URL}/api/farmer/profile`);
    if (res.ok) {
      const data = (await res.json()) as FarmerProfile;
      storeFarmerProfile(data, farmerId);
      return data;
    }
  } catch {
    // Ignore network error and fall back to local storage
  }
  return delay(readStoredFarmerProfile(farmerId) ?? fallbackProfile, 300);
}

export async function updateFarmerProfile(
  profile: Partial<FarmerProfile>,
  farmerId = mockFarmerProfile.id,
  fallbackProfile: FarmerProfile = mockFarmerProfile
): Promise<FarmerProfile> {
  const current = readStoredFarmerProfile(farmerId) ?? fallbackProfile;
  const updated: FarmerProfile = {
    ...current,
    ...profile,
    location: { ...current.location, ...(profile.location ?? {}) },
    farm: { ...current.farm, ...(profile.farm ?? {}) },
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/farmer/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = (await res.json()) as FarmerProfile;
      storeFarmerProfile(data, farmerId);
      return data;
    }
  } catch {
    // Ignore network error and save locally
  }

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

export async function detectDisease(imageFile: File): Promise<DiseaseResult> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`${API_BASE_URL}/api/disease-detection`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new ApiError(
      message || "Failed to detect crop disease",
      res.status
    );
  }

  return (await res.json()) as DiseaseResult;
}

export async function getAdvisory(
  payload?: AdvisoryContextPayload | string
): Promise<AdvisoryData> {
  const body = typeof payload === "string" ? { question: payload } : (payload ?? {});
  try {
    const res = await fetch(`${API_BASE_URL}/api/advisory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return (await res.json()) as AdvisoryData;
    }
  } catch {
    // Ignore network error and fall back to local mock
  }

  return delay(mockAdvisory, 500);
}


export interface RegenerativeData {
  metrics: { label: string; value: number; trend: "up" | "down" | "flat" }[];
  practices: RegenerativePractice[];
}

export async function getRegenerativeData(): Promise<RegenerativeData> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/regenerative`);
    if (res.ok) {
      return (await res.json()) as RegenerativeData;
    }
  } catch {
    // Ignore network error and fall back
  }

  return delay({
    metrics: [
      { label: "Soil Organic Matter Index", value: 78.5, trend: "up" },
      { label: "Water Infiltration Efficiency", value: 84.0, trend: "up" },
      { label: "Biodiversity & Habitat Cover", value: 72.0, trend: "flat" },
      { label: "Synthetic Input Reduction", value: 65.0, trend: "up" },
    ],
    practices: [],
  }, 400);
}

export async function getEnvironmentData(
  latitude: number,
  longitude: number,
  locationName?: string
): Promise<EnvironmentData> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });
  if (locationName) {
    params.set("name", locationName);
  }

  const res = await fetch(`${API_BASE_URL}/api/environment?${params.toString()}`);
  if (!res.ok) {
    const message = await res.text();
    throw new ApiError(message || "Failed to load environmental intelligence", res.status);
  }

  return (await res.json()) as EnvironmentData;
}

export async function geocodeLocation(query: string): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({ q: query });
  const res = await fetch(`${API_BASE_URL}/api/geocode?${params.toString()}`);
  if (!res.ok) {
    throw new ApiError("Failed to search location", res.status);
  }
  return (await res.json()) as GeocodeResult[];
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult> {
  const params = new URLSearchParams({ lat: String(latitude), lon: String(longitude) });
  const res = await fetch(`${API_BASE_URL}/api/reverse-geocode?${params.toString()}`);
  if (!res.ok) {
    return {
      name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
      display_name: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
      latitude,
      longitude,
    };
  }
  return (await res.json()) as GeocodeResult;
}

