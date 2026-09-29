// Core domain types for AgriNexus AI.
// These shapes mirror the FastAPI backend contracts described in the project
// brief, so mock data and real API responses can be swapped in without
// touching the UI.

export interface FarmerProfile {
  id: string;
  name: string;
  phone?: string;
  location: {
    village: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  farm: {
    sizeAcres: number;
    irrigationType: "Rainfed" | "Canal" | "Borewell" | "Drip" | "Mixed";
  };
  currentCrop: string;
  preferredLanguage: string;
  onboardedAt: string;
  soil?: {
    ph?: number;
  };
}

export interface WeatherNow {
  temperatureC: number;
  condition: string;
  humidityPct: number;
  windKmh: number;
  rainProbabilityPct: number;
  updatedAt: string;
}

export interface WeatherDay {
  label: string; // "Today", "Tomorrow", "Wed" ...
  date: string;
  highC: number;
  lowC: number;
  rainProbabilityPct: number;
  condition: string;
}

export interface WeatherData {
  location: string;
  now: WeatherNow;
  forecast: WeatherDay[];
  farmingImpact: string[];
  dataSource: string;
}

export type SoilRating = "low" | "adequate" | "good" | "high";

export interface SoilMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  rating: SoilRating;
  range: { min: number; max: number };
  meaning: string;
  action: string;
}

export interface SoilData {
  healthScore: number; // 0-100
  healthLabel: string;
  metrics: SoilMetric[];
  texture: { sand: number; silt: number; clay: number };
  dataSource: string;
  lastUpdated: string;
}

export interface CropFactor {
  label: string;
  detail: string;
  supportive: boolean;
}

export interface CropOption {
  crop: string;
  confidencePct: number;
  reasons: string[];
}

export interface CropRecommendation {
  primary: CropOption;
  alternatives: CropOption[];
  factorsConsidered: CropFactor[];
  season: string;
  dataSource: string;
}

export type CropHealthStatus = "healthy" | "attention" | "disease";

export interface DiseaseResult {
  disease: string | null;
  confidencePct: number;
  observed: string[];
  actions: string[];
  prevention: string[];
  isHealthy: boolean;
}

export type AdvisoryPriority = "high" | "medium" | "low";
export type AdvisoryCategory = "weather" | "crop" | "sustainability" | "soil";

export interface AdvisoryAction {
  id: string;
  category: AdvisoryCategory;
  priority: AdvisoryPriority;
  title: string;
  reason: string;
  action: string;
  timing: string;
}

export interface KnowledgeReference {
  title: string;
  topic: string;
  source: string;
}


export interface AdvisoryData {
  summary: string;
  actions: AdvisoryAction[];
  generatedAt: string;
  location_name?: string;
  crop?: string;
  sources?: KnowledgeReference[];
}

export interface AdvisoryContextPayload {
  question?: string;
  farmer_name?: string;
  crop?: string;
  location?: {
    name?: string;
    latitude?: number;
    longitude?: number;
    district?: string;
    state?: string;
    country?: string;
  };
  weather?: {
    temperature?: number;
    condition?: string;
    humidity?: number;
    rain_probability?: number;
    precipitation?: number;
  };
  soil?: {
    ph?: number;
    health_score?: number;
    health_label?: string;
    organic_carbon?: number;
    nitrogen?: number;
    source?: string;
    scope?: string;
  };
  vegetation?: {
    ndvi?: number;
    observation_date?: string;
    interpretation?: string;
    source?: string;
    scope?: string;
  };
  disease_result?: DiseaseResult | null;
}

export interface QuickQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface RegenerativePractice {
  id: string;
  practice: string;
  benefit: string;
  whenToUse: string;
  detail: string;
}

export interface SustainabilityMetric {
  label: string;
  value: number; // 0-100
  trend: "up" | "down" | "flat";
}

export type RequestState = "idle" | "loading" | "success" | "error";

export interface EnvironmentLocation {
  name: string;
  latitude: number;
  longitude: number;
  district?: string;
  state?: string;
  country?: string;
}

export interface EnvironmentForecastDay {
  label: string;
  date: string;
  highC: number;
  lowC: number;
  condition: string;
  rainProbabilityPct: number;
}

export interface EnvironmentWeather {
  temperature: number;
  feels_like?: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  forecast: EnvironmentForecastDay[];
}

export interface EnvironmentRainfall {
  precipitation: number;
  rain_probability: number;
  daily_precipitation: number;
  unit: string;
}

export interface EnvironmentSoil {
  available: boolean;
  data_available?: boolean;
  health_score?: number;
  health_label?: string;
  ph?: number;
  texture?: { sand: number; silt: number; clay: number };
  organic_carbon?: number;
  nitrogen?: number;
  source?: string;
  scope?: string;
  coverage?: string;
  message?: string;
}

export interface EnvironmentVegetation {
  available: boolean;
  data_available?: boolean;
  ndvi?: number;
  observation_date?: string;
  interpretation?: string;
  source?: string;
  scope?: string;
  coverage?: string;
  message?: string;
}

export interface SourceMetadata {
  source: string;
  scope?: string;
  coverage?: string;
  source_type: string;
  schema_version: string;
}

export interface EnvironmentSources {
  weather: SourceMetadata;
  soil: SourceMetadata;
  satellite: SourceMetadata;
}

export interface EnvironmentData {
  location: EnvironmentLocation;
  weather: EnvironmentWeather;
  rainfall: EnvironmentRainfall;
  soil: EnvironmentSoil;
  vegetation: EnvironmentVegetation;
  sources: EnvironmentSources;
  timestamp: string;
  schema_version: string;
}

export interface GeocodeResult {
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
  district?: string;
  state?: string;
  country?: string;
}


