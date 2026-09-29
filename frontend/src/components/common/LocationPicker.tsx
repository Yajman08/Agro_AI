import { useState } from "react";
import { Navigation, MapPin, Search, Loader2, Check } from "lucide-react";
import Button from "./Button";
import { geocodeLocation, reverseGeocode } from "../../services/api";
import type { GeocodeResult } from "../../types";
import { useFarmer } from "../../context/useFarmer";

interface LocationPickerProps {
  onLocationSelected?: (lat: number, lon: number, name: string) => void;
  className?: string;
}

const PRESET_LOCATIONS: { name: string; state: string; lat: number; lon: number }[] = [
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "Mandya", state: "Karnataka", lat: 12.5218, lon: 76.8951 },
  { name: "Mysuru", state: "Karnataka", lat: 12.2958, lon: 76.6394 },
  { name: "Dharwad", state: "Karnataka", lat: 15.4589, lon: 75.0078 },
  { name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090 },
];

export default function LocationPicker({ onLocationSelected, className = "" }: LocationPickerProps) {
  const { profile, saveProfile } = useFarmer();
  const [mode, setMode] = useState<"options" | "manual">("options");
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 1. Geolocation API (Use My Location)
  const handleUseMyLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please enter manually.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const info = await reverseGeocode(lat, lon);
          const locName = info.display_name || info.name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
          await saveProfile({
            location: {
              village: info.name || "Current Location",
              district: info.district || info.name || "Local",
              state: info.state || "Karnataka",
              country: info.country || "India",
              latitude: lat,
              longitude: lon,
            },
          });
          if (onLocationSelected) onLocationSelected(lat, lon, locName);
        } catch {
          await saveProfile({
            location: {
              village: "Current Location",
              district: "Local Area",
              state: "Karnataka",
              country: "India",
              latitude: lat,
              longitude: lon,
            },
          });
          if (onLocationSelected) onLocationSelected(lat, lon, "Current Location");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission was denied. Please enter your location manually below.");
        } else {
          setError("Could not obtain location. Please enter manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 2. Manual Geocoding Search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const res = await geocodeLocation(searchQuery.trim());
      setResults(res);
      if (res.length === 0) {
        setError("No matching locations found. Try another city or town name.");
      }
    } catch (err) {
      setError("Geocoding service unavailable. Select a preset city below.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = async (lat: number, lon: number, name: string, state?: string, district?: string) => {
    setError(null);
    try {
      await saveProfile({
        location: {
          village: name,
          district: district || name,
          state: state || "Karnataka",
          country: "India",
          latitude: lat,
          longitude: lon,
        },
      });
      if (onLocationSelected) onLocationSelected(lat, lon, name);
    } catch (err) {
      setError("Failed to save location.");
    }
  };

  return (
    <div className={`space-y-4 rounded-xl border border-line bg-surface p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-forest-600" />
          <h3 className="text-sm font-semibold text-ink">Farmer Location</h3>
        </div>
        {profile?.location && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-forest-700 bg-forest-50 px-2 py-1 rounded-md border border-forest-200">
            <Check className="h-3 w-3" />
            {profile.location.village}, {profile.location.state} ({profile.location.latitude.toFixed(2)}, {profile.location.longitude.toFixed(2)})
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-sienna-50 border-l-2 border-sienna-500 p-2.5 text-xs text-sienna-700">
          {error}
        </div>
      )}

      {/* Two Clear Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Option A: Use My Location */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="flex flex-col items-center justify-center p-3 rounded-lg border border-forest-200 bg-forest-50/50 hover:bg-forest-100/60 hover:border-forest-400 transition-all text-center gap-1.5"
        >
          {locating ? (
            <Loader2 className="h-5 w-5 animate-spin text-forest-700" />
          ) : (
            <Navigation className="h-5 w-5 text-forest-700" />
          )}
          <span className="text-xs font-semibold text-forest-900">
            {locating ? "Obtaining Location..." : "📍 Use My Location"}
          </span>
          <span className="text-[10px] text-ink-soft">Browser Geolocation API</span>
        </button>

        {/* Option B: Enter Location Manually */}
        <button
          type="button"
          onClick={() => setMode(mode === "manual" ? "options" : "manual")}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-center gap-1.5 ${
            mode === "manual"
              ? "border-forest-500 bg-forest-50 text-forest-900"
              : "border-line bg-surface hover:bg-canvas text-ink"
          }`}
        >
          <Search className="h-5 w-5 text-ink-soft" />
          <span className="text-xs font-semibold">✏️ Enter Location Manually</span>
          <span className="text-[10px] text-ink-soft">City / Town Search</span>
        </button>
      </div>

      {/* Manual Search Form & Suggestions */}
      {mode === "manual" && (
        <div className="space-y-3 pt-2 border-t border-line">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter City or Town (e.g. Bengaluru, Mandya)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-xs text-ink placeholder:text-ink-soft focus:border-forest-500 focus:outline-none"
            />
            <Button type="submit" size="sm" disabled={searching}>
              {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
            </Button>
          </form>

          {/* Search Results List */}
          {results.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-line bg-surface divide-y divide-line">
              {results.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectLocation(res.latitude, res.longitude, res.name, res.state, res.district)}
                  className="w-full px-3 py-2 text-left hover:bg-forest-50 text-xs flex justify-between items-center"
                >
                  <span className="font-medium text-ink">{res.display_name}</span>
                  <span className="text-[10px] text-ink-soft">
                    {res.latitude.toFixed(2)}, {res.longitude.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <p className="text-[11px] font-semibold text-ink-soft mb-1.5">Quick Location Presets:</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_LOCATIONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectLocation(preset.lat, preset.lon, preset.name, preset.state)}
                  className="px-2.5 py-1 text-xs rounded-md border border-line bg-canvas hover:border-forest-400 hover:bg-forest-50 text-ink font-medium"
                >
                  {preset.name} ({preset.state})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
