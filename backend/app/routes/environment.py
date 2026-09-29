from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import pandas as pd
import requests
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

router = APIRouter(
    prefix="/api",
    tags=["Environment & Interoperability"]
)

BASE_DIR = Path(__file__).resolve().parents[3]

SOIL_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "Soil"
    / "soil_dataset_india_clean.csv"
)

NDVI_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "satellite"
    / "brics_modis_ndvi_india_clean.csv"
)

# Load datasets on startup
try:
    soil_df = pd.read_csv(SOIL_FILE)
    for col in ["latitude", "longitude", "soil_ph", "nitrogen", "organic_carbon", "sand", "silt", "clay"]:
        if col in soil_df.columns:
            soil_df[col] = pd.to_numeric(soil_df[col], errors="coerce")
    soil_df = soil_df.dropna(subset=["latitude", "longitude", "soil_ph", "nitrogen"])
except Exception as error:
    soil_df = pd.DataFrame()
    print(f"Failed to load soil dataset in environment route: {error}")

try:
    ndvi_df = pd.read_csv(NDVI_FILE)
    for col in ["latitude", "longitude", "ndvi"]:
        if col in ndvi_df.columns:
            ndvi_df[col] = pd.to_numeric(ndvi_df[col], errors="coerce")
    ndvi_df = ndvi_df.dropna(subset=["latitude", "longitude", "ndvi"])
except Exception as error:
    ndvi_df = pd.DataFrame()
    print(f"Failed to load NDVI dataset in environment route: {error}")


# ---------------------------------------------------------
# Response Schemas (Normalized Interoperability Layer v1.0)
# ---------------------------------------------------------

class LocationSchema(BaseModel):
    name: str
    latitude: float
    longitude: float
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None


class ForecastDaySchema(BaseModel):
    label: str
    date: str
    highC: float
    lowC: float
    condition: str
    rainProbabilityPct: float


class WeatherSchema(BaseModel):
    temperature: float
    feels_like: Optional[float] = None
    humidity: float
    wind_speed: float
    condition: str
    forecast: list[ForecastDaySchema] = []


class RainfallSchema(BaseModel):
    precipitation: float
    rain_probability: float
    daily_precipitation: float = 0.0
    unit: str = "mm"


class SoilTextureSchema(BaseModel):
    sand: float
    silt: float
    clay: float


class SoilSchema(BaseModel):
    available: bool = True
    health_score: Optional[float] = None
    health_label: Optional[str] = None
    ph: Optional[float] = None
    texture: Optional[SoilTextureSchema] = None
    organic_carbon: Optional[float] = None
    nitrogen: Optional[float] = None
    message: Optional[str] = None


class VegetationSchema(BaseModel):
    available: bool = True
    ndvi: Optional[float] = None
    observation_date: Optional[str] = None
    interpretation: Optional[str] = None
    message: Optional[str] = None


class SourceMetadata(BaseModel):
    source: str
    source_type: str
    schema_version: str = "1.0"


class SourcesSchema(BaseModel):
    weather: SourceMetadata
    soil: SourceMetadata
    satellite: SourceMetadata


class EnvironmentResponse(BaseModel):
    location: LocationSchema
    weather: WeatherSchema
    rainfall: RainfallSchema
    soil: SoilSchema
    vegetation: VegetationSchema
    sources: SourcesSchema
    timestamp: str
    schema_version: str = "1.0"


class GeocodeResult(BaseModel):
    name: str
    display_name: str
    latitude: float
    longitude: float
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None


# ---------------------------------------------------------
# Weather helper
# ---------------------------------------------------------

def weather_code_to_text(code: int) -> str:
    codes = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
        55: "Dense drizzle", 61: "Light rain", 63: "Moderate rain", 65: "Heavy rain",
        71: "Light snow", 73: "Moderate snow", 75: "Heavy snow", 80: "Rain showers",
        81: "Moderate rain showers", 82: "Heavy rain showers", 95: "Thunderstorm",
        96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
    }
    return codes.get(code, "Clear")


# ---------------------------------------------------------
# Geocoding Endpoint
# ---------------------------------------------------------

@router.get("/geocode", response_model=list[GeocodeResult])
def geocode_location(q: str = Query(..., min_length=2)):
    """
    Resolve city/town/location name to latitude/longitude using Open-Meteo Geocoding API.
    """
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": q,
        "count": 5,
        "language": "en",
        "format": "json"
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()
        results = []
        for item in data.get("results", []):
            name = item.get("name", q)
            state = item.get("admin1", "")
            country = item.get("country", "")
            district = item.get("admin2", state)
            
            parts = [name]
            if state and state != name:
                parts.append(state)
            if country:
                parts.append(country)
            display_name = ", ".join(parts)
            
            results.append(GeocodeResult(
                name=name,
                display_name=display_name,
                latitude=float(item["latitude"]),
                longitude=float(item["longitude"]),
                district=district if district else None,
                state=state if state else None,
                country=country if country else None,
            ))
        return results
    except Exception as err:
        raise HTTPException(status_code=502, detail=f"Geocoding service unavailable: {err}")


@router.get("/reverse-geocode", response_model=GeocodeResult)
def reverse_geocode(lat: float, lon: float):
    """
    Convert lat/lon to human readable location name using Nominatim API.
    """
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
    headers = {"User-Agent": "AgriNexusAI/1.0"}
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.ok:
            data = res.json()
            address = data.get("address", {})
            city = address.get("city") or address.get("town") or address.get("village") or address.get("county") or "Local Area"
            state = address.get("state", "")
            country = address.get("country", "India")
            district = address.get("state_district") or address.get("county") or state
            display_name = f"{city}, {state}" if state else f"{city}, {country}"
            return GeocodeResult(
                name=city,
                display_name=display_name,
                latitude=lat,
                longitude=lon,
                district=district,
                state=state,
                country=country
            )
    except Exception:
        pass
    return GeocodeResult(
        name=f"{lat:.2f}, {lon:.2f}",
        display_name=f"{lat:.4f}° N, {lon:.4f}° E",
        latitude=lat,
        longitude=lon,
    )


# ---------------------------------------------------------
# Interoperability Endpoint: /api/environment
# ---------------------------------------------------------

@router.get("/environment", response_model=EnvironmentResponse)
def get_environment(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    name: Optional[str] = None
):
    """
    Normalized Data Integration & Interoperability Layer.
    Combines Weather (Open-Meteo), Soil (India Soil Dataset), and Satellite Vegetation (MODIS NDVI).
    """
    # 1. Location Name Resolution
    loc_name = name
    state_name = None
    district_name = None
    country_name = "India"

    if not loc_name:
        try:
            geo_info = reverse_geocode(lat=lat, lon=lon)
            loc_name = geo_info.display_name
            state_name = geo_info.state
            district_name = geo_info.district
            country_name = geo_info.country or "India"
        except Exception:
            loc_name = f"{lat:.4f}, {lon:.4f}"

    location_data = LocationSchema(
        name=loc_name,
        latitude=lat,
        longitude=lon,
        district=district_name,
        state=state_name,
        country=country_name
    )

    # 2. Weather & Rainfall Data (Open-Meteo)
    weather_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,apparent_temperature",
        "hourly": "precipitation_probability",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum",
        "forecast_days": 3,
        "timezone": "auto",
        "wind_speed_unit": "kmh",
    }

    try:
        w_res = requests.get(weather_url, params=params, timeout=12)
        w_res.raise_for_status()
        w_data = w_res.json()

        current = w_data.get("current", {})
        daily = w_data.get("daily", {})

        current_temp = float(current.get("temperature_2m", 25.0))
        feels_like = float(current.get("apparent_temperature", current_temp))
        humidity = float(current.get("relative_humidity_2m", 60.0))
        wind_speed = float(current.get("wind_speed_10m", 10.0))
        precip = float(current.get("precipitation", 0.0))
        code = int(current.get("weather_code", 0))
        condition = weather_code_to_text(code)

        hourly_probs = w_data.get("hourly", {}).get("precipitation_probability", [])
        rain_prob = float(hourly_probs[0]) if hourly_probs else 0.0

        daily_precip_list = daily.get("precipitation_sum", [0.0])
        daily_precip = float(daily_precip_list[0]) if daily_precip_list else precip

        forecast_list = []
        dates = daily.get("time", [])
        w_codes = daily.get("weather_code", [])
        max_temps = daily.get("temperature_2m_max", [])
        min_temps = daily.get("temperature_2m_min", [])
        rain_probs = daily.get("precipitation_probability_max", [])

        for i, date_str in enumerate(dates):
            if i == 0:
                lbl = "Today"
            elif i == 1:
                lbl = "Tomorrow"
            else:
                try:
                    lbl = datetime.fromisoformat(date_str).strftime("%a")
                except Exception:
                    lbl = date_str

            forecast_list.append(ForecastDaySchema(
                label=lbl,
                date=date_str,
                highC=float(max_temps[i]) if i < len(max_temps) else current_temp,
                lowC=float(min_temps[i]) if i < len(min_temps) else current_temp - 5,
                condition=weather_code_to_text(int(w_codes[i])) if i < len(w_codes) else condition,
                rainProbabilityPct=float(rain_probs[i]) if i < len(rain_probs) else rain_prob
            ))

        weather_obj = WeatherSchema(
            temperature=current_temp,
            feels_like=feels_like,
            humidity=humidity,
            wind_speed=wind_speed,
            condition=condition,
            forecast=forecast_list
        )

        rainfall_obj = RainfallSchema(
            precipitation=precip,
            rain_probability=rain_prob,
            daily_precipitation=daily_precip,
            unit="mm"
        )

    except Exception as err:
        # Graceful fallback weather
        weather_obj = WeatherSchema(
            temperature=25.0,
            feels_like=25.0,
            humidity=65.0,
            wind_speed=12.0,
            condition="Partly cloudy",
            forecast=[]
        )
        rainfall_obj = RainfallSchema(
            precipitation=0.0,
            rain_probability=20.0,
            daily_precipitation=0.0,
            unit="mm"
        )

    # 3. Soil Data (India Soil Dataset)
    if not soil_df.empty:
        soil_work = soil_df.copy()
        soil_work["dist"] = (soil_work["latitude"] - lat)**2 + (soil_work["longitude"] - lon)**2
        nearest_row = soil_work.loc[soil_work["dist"].idxmin()]
        min_dist_deg = soil_work["dist"].min() ** 0.5

        if min_dist_deg <= 10.0:  # Within ~1000km range
            ph = float(nearest_row["soil_ph"])
            nitrogen = float(nearest_row["nitrogen"])
            carbon = float(nearest_row["organic_carbon"])
            sand = float(nearest_row.get("sand", 40.0))
            silt = float(nearest_row.get("silt", 35.0))
            clay = float(nearest_row.get("clay", 25.0))

            # Soil score calculation
            ph_s = 1.0 if 6.0 <= ph <= 7.5 else (0.7 if 5.5 <= ph <= 8.0 else 0.4)
            n_s = 1.0 if nitrogen >= 2.0 else (0.7 if nitrogen >= 1.0 else 0.4)
            c_s = 1.0 if carbon >= 1.0 else (0.7 if carbon >= 0.5 else 0.4)
            score = round((ph_s * 0.4 + n_s * 0.3 + c_s * 0.3) * 100, 1)

            lbl = "Excellent" if score >= 80 else ("Good" if score >= 65 else ("Moderate" if score >= 50 else "Needs attention"))

            soil_obj = SoilSchema(
                available=True,
                health_score=score,
                health_label=lbl,
                ph=round(ph, 2),
                texture=SoilTextureSchema(sand=round(sand, 1), silt=round(silt, 1), clay=round(clay, 1)),
                organic_carbon=round(carbon, 2),
                nitrogen=round(nitrogen, 2),
                message=None
            )
        else:
            soil_obj = SoilSchema(available=False, message="No nearby soil observation available.")
    else:
        soil_obj = SoilSchema(available=False, message="Soil dataset currently unavailable.")

    # 4. Satellite / MODIS NDVI Data
    if not ndvi_df.empty:
        ndvi_work = ndvi_df.copy()
        ndvi_work["dist"] = (ndvi_work["latitude"] - lat)**2 + (ndvi_work["longitude"] - lon)**2
        min_dist = ndvi_work["dist"].min() ** 0.5

        if min_dist <= 5.0:  # Within ~500km
            nearest_ndvi_row = ndvi_work.loc[ndvi_work["dist"].idxmin()]
            val = float(nearest_ndvi_row["ndvi"])
            obs_date = str(nearest_ndvi_row.get("date") or nearest_ndvi_row.get("modis_date") or "2026-01-01")

            if val >= 0.6:
                interp = "Dense / Healthy Green Vegetation"
            elif val >= 0.4:
                interp = "Moderate Green Vegetation"
            elif val >= 0.2:
                interp = "Sparse Vegetation / Early Stage Crop"
            elif val >= 0:
                interp = "Bare Soil / Minimal Vegetation"
            else:
                interp = "Water Body or Non-Vegetated Surface"

            vegetation_obj = VegetationSchema(
                available=True,
                ndvi=round(val, 4),
                observation_date=obs_date,
                interpretation=interp,
                message=None
            )
        else:
            vegetation_obj = VegetationSchema(
                available=False,
                message="No nearby NDVI observation available."
            )
    else:
        vegetation_obj = VegetationSchema(
            available=False,
            message="MODIS NDVI satellite dataset unavailable."
        )

    # 5. Sources metadata & response
    sources_obj = SourcesSchema(
        weather=SourceMetadata(source="Open-Meteo", source_type="weather", schema_version="1.0"),
        soil=SourceMetadata(source="India Soil Dataset", source_type="soil", schema_version="1.0"),
        satellite=SourceMetadata(source="MODIS NDVI", source_type="satellite", schema_version="1.0")
    )

    return EnvironmentResponse(
        location=location_data,
        weather=weather_obj,
        rainfall=rainfall_obj,
        soil=soil_obj,
        vegetation=vegetation_obj,
        sources=sources_obj,
        timestamp=datetime.now(timezone.utc).isoformat(),
        schema_version="1.0"
    )
