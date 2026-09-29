import math
from pathlib import Path
from typing import Any, Optional
import pandas as pd
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from pydantic import BaseModel

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

# Load datasets safely on startup
try:
    soil_df = pd.read_csv(SOIL_FILE)
    for col in ["latitude", "longitude", "soil_ph", "nitrogen", "organic_carbon", "sand", "silt", "clay"]:
        if col in soil_df.columns:
            soil_df[col] = pd.to_numeric(soil_df[col], errors="coerce")
    soil_df = soil_df.dropna(subset=["latitude", "longitude", "soil_ph", "nitrogen"])
except Exception as err:
    soil_df = pd.DataFrame()
    print(f"Failed to load soil dataset in providers: {err}")

try:
    ndvi_df = pd.read_csv(NDVI_FILE)
    for col in ["latitude", "longitude", "ndvi"]:
        if col in ndvi_df.columns:
            ndvi_df[col] = pd.to_numeric(ndvi_df[col], errors="coerce")
    ndvi_df = ndvi_df.dropna(subset=["latitude", "longitude", "ndvi"])
except Exception as err:
    ndvi_df = pd.DataFrame()
    print(f"Failed to load NDVI dataset in providers: {err}")


# Setup HTTP Session with retry for global providers
http_session = requests.Session()
retries = Retry(total=2, backoff_factor=0.5, status_forcelist=[500, 502, 503, 504])
http_session.mount("https://", HTTPAdapter(max_retries=retries))
http_session.mount("http://", HTTPAdapter(max_retries=retries))
HEADERS = {
    "User-Agent": "AgriNexusAI/1.0 (Agricultural Intelligence Interoperability)",
    "Accept": "application/json"
}


class SoilResult(BaseModel):
    available: bool
    data_available: bool
    health_score: Optional[float] = None
    health_label: Optional[str] = None
    ph: Optional[float] = None
    texture: Optional[dict[str, float]] = None
    organic_carbon: Optional[float] = None
    nitrogen: Optional[float] = None
    source: str
    scope: str
    coverage: str
    message: Optional[str] = None


class VegetationResult(BaseModel):
    available: bool
    data_available: bool
    ndvi: Optional[float] = None
    observation_date: Optional[str] = None
    interpretation: Optional[str] = None
    source: str
    scope: str
    coverage: str
    message: Optional[str] = None


# Helper function to compute soil health score & label
def compute_soil_health(ph: float, nitrogen: float, organic_carbon: float) -> tuple[float, str]:
    ph_s = 1.0 if 6.0 <= ph <= 7.5 else (0.7 if 5.5 <= ph <= 8.0 else 0.4)
    n_s = 1.0 if nitrogen >= 2.0 else (0.7 if nitrogen >= 1.0 else 0.4)
    c_s = 1.0 if organic_carbon >= 1.0 else (0.7 if organic_carbon >= 0.5 else 0.4)
    score = round((ph_s * 0.4 + n_s * 0.3 + c_s * 0.3) * 100, 1)
    if score >= 80:
        lbl = "Excellent"
    elif score >= 65:
        lbl = "Good"
    elif score >= 50:
        lbl = "Moderate"
    else:
        lbl = "Needs attention"
    return score, lbl


# ---------------------------------------------------------
# SOIL PROVIDERS
# ---------------------------------------------------------

class IndiaSoilProvider:
    """Provides local soil data for locations covered by India Soil Dataset."""

    @staticmethod
    def get_soil(lat: float, lon: float) -> Optional[SoilResult]:
        if soil_df.empty:
            return None

        # Check if coordinates are within India bounding box (~6 to 38 N, 68 to 98 E)
        if not (6.0 <= lat <= 38.0 and 68.0 <= lon <= 98.0):
            return None

        df_work = soil_df.copy()
        df_work["dist"] = (df_work["latitude"] - lat)**2 + (df_work["longitude"] - lon)**2
        min_dist_deg = df_work["dist"].min() ** 0.5

        # Within ~2.0 degrees (~200km)
        if min_dist_deg <= 2.0:
            nearest_row = df_work.loc[df_work["dist"].idxmin()]
            ph = float(nearest_row["soil_ph"])
            nitrogen = float(nearest_row["nitrogen"])
            carbon = float(nearest_row["organic_carbon"])
            sand = float(nearest_row.get("sand", 40.0))
            silt = float(nearest_row.get("silt", 35.0))
            clay = float(nearest_row.get("clay", 25.0))

            score, lbl = compute_soil_health(ph, nitrogen, carbon)

            return SoilResult(
                available=True,
                data_available=True,
                health_score=score,
                health_label=lbl,
                ph=round(ph, 2),
                texture={"sand": round(sand, 1), "silt": round(silt, 1), "clay": round(clay, 1)},
                organic_carbon=round(carbon, 2),
                nitrogen=round(nitrogen, 2),
                source="India Soil Dataset",
                scope="India",
                coverage="local",
                message=None
            )
        return None


class GlobalSoilProvider:
    """Queries SoilGrids / global soil provider for global locations."""

    @staticmethod
    def get_soil(lat: float, lon: float) -> SoilResult:
        url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
        params = [
            ("lon", lon),
            ("lat", lat),
            ("depth", "0-5cm"),
            ("value", "mean"),
            ("property", "phh2o"),
            ("property", "soc"),
            ("property", "nitrogen"),
            ("property", "sand"),
            ("property", "silt"),
            ("property", "clay"),
        ]

        try:
            r = http_session.get(url, params=params, headers=HEADERS, timeout=7)
            if r.ok:
                data = r.json()
                layers = data.get("properties", {}).get("layers", [])
                extracted = {}
                for layer in layers:
                    name = layer.get("name")
                    depths = layer.get("depths", [])
                    if depths and "values" in depths[0]:
                        raw = depths[0]["values"].get("mean")
                        dfactor = layer.get("unit_measure", {}).get("d_factor", 1)
                        if raw is not None and dfactor > 0:
                            extracted[name] = raw / dfactor

                ph_raw = extracted.get("phh2o")
                soc_raw = extracted.get("soc")
                n_raw = extracted.get("nitrogen")
                sand = extracted.get("sand", 40.0)
                silt = extracted.get("silt", 35.0)
                clay = extracted.get("clay", 25.0)

                if ph_raw is not None and soc_raw is not None:
                    ph = round(ph_raw, 2)
                    # Convert SoilGrids units: soc is g/kg -> divide by 10 for %
                    organic_carbon = round(soc_raw / 10.0, 2) if soc_raw > 5 else round(soc_raw, 2)
                    # Nitrogen is g/kg or cg/kg -> scale to mg/kg or g/kg suitable for score
                    nitrogen = round(n_raw, 2) if n_raw is not None else 1.5

                    score, lbl = compute_soil_health(ph, nitrogen, organic_carbon)

                    return SoilResult(
                        available=True,
                        data_available=True,
                        health_score=score,
                        health_label=lbl,
                        ph=ph,
                        texture={"sand": round(sand, 1), "silt": round(silt, 1), "clay": round(clay, 1)},
                        organic_carbon=organic_carbon,
                        nitrogen=nitrogen,
                        source="SoilGrids",
                        scope="Global",
                        coverage="global",
                        message=None
                    )
        except Exception as err:
            print(f"GlobalSoilProvider query error for ({lat}, {lon}): {err}")

        return SoilResult(
            available=False,
            data_available=False,
            source="SoilGrids",
            scope="Global",
            coverage="global",
            message="No soil observation available for this location."
        )


class SoilProviderResolver:
    @staticmethod
    def get_soil(lat: float, lon: float) -> SoilResult:
        # Try local India Soil Provider first
        local_result = IndiaSoilProvider.get_soil(lat, lon)
        if local_result and local_result.data_available:
            return local_result

        # Fallback to Global Soil Provider
        return GlobalSoilProvider.get_soil(lat, lon)


# ---------------------------------------------------------
# VEGETATION / NDVI PROVIDERS
# ---------------------------------------------------------

class LocalNDVIProvider:
    """Provides local MODIS NDVI observations for Indian locations."""

    @staticmethod
    def get_ndvi(lat: float, lon: float) -> Optional[VegetationResult]:
        if ndvi_df.empty:
            return None

        if not (6.0 <= lat <= 38.0 and 68.0 <= lon <= 98.0):
            return None

        df_work = ndvi_df.copy()
        df_work["dist"] = (df_work["latitude"] - lat)**2 + (df_work["longitude"] - lon)**2
        min_dist_deg = df_work["dist"].min() ** 0.5

        # Within ~3.0 degrees (~300km)
        if min_dist_deg <= 3.0:
            nearest_row = df_work.loc[df_work["dist"].idxmin()]
            val = float(nearest_row["ndvi"])
            obs_date = str(nearest_row.get("date") or nearest_row.get("modis_date") or "2026-01-01")

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

            return VegetationResult(
                available=True,
                data_available=True,
                ndvi=round(val, 4),
                observation_date=obs_date,
                interpretation=interp,
                source="MODIS NDVI",
                scope="India",
                coverage="local",
                message=None
            )
        return None


class GlobalMODISProvider:
    """Queries ORNL DAAC / TESViS MODIS REST service for global MOD13Q1 NDVI observations."""

    @staticmethod
    def get_ndvi(lat: float, lon: float) -> VegetationResult:
        base_url = "https://modis.ornl.gov/rst/api/v1/MOD13Q1"
        try:
            r_dates = http_session.get(
                f"{base_url}/dates",
                params={"latitude": lat, "longitude": lon},
                headers=HEADERS,
                timeout=7
            )
            if r_dates.ok:
                dates = r_dates.json().get("dates", [])
                if dates:
                    # Query recent dates backwards to find a valid observation
                    for d_info in reversed(dates[-5:]):
                        mdate = d_info.get("modis_date")
                        cdate = d_info.get("calendar_date")
                        if not mdate:
                            continue

                        sub_res = http_session.get(
                            f"{base_url}/subset",
                            params={
                                "latitude": lat,
                                "longitude": lon,
                                "band": "250m_16_days_NDVI",
                                "startDate": mdate,
                                "endDate": mdate,
                                "kmAboveBelow": 0,
                                "kmLeftRight": 0,
                            },
                            headers=HEADERS,
                            timeout=7
                        )
                        if sub_res.ok:
                            sub_data = sub_res.json().get("subset", [])
                            if sub_data and sub_data[0].get("data"):
                                raw_val = sub_data[0]["data"][0]
                                # Valid range for integer MODIS NDVI is -2000 to 10000
                                if -2000 < raw_val <= 10000:
                                    val = round(raw_val * 0.0001, 4)
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

                                    return VegetationResult(
                                        available=True,
                                        data_available=True,
                                        ndvi=val,
                                        observation_date=cdate or mdate,
                                        interpretation=interp,
                                        source="MODIS MOD13Q1",
                                        scope="Global",
                                        coverage="global",
                                        message=None
                                    )
        except Exception as err:
            print(f"GlobalMODISProvider query error for ({lat}, {lon}): {err}")

        return VegetationResult(
            available=False,
            data_available=False,
            ndvi=None,
            source="MODIS MOD13Q1",
            scope="Global",
            coverage="global",
            message="No valid vegetation observation available for this location."
        )


class VegetationProviderResolver:
    @staticmethod
    def get_ndvi(lat: float, lon: float) -> VegetationResult:
        # Try local MODIS provider first
        local_result = LocalNDVIProvider.get_ndvi(lat, lon)
        if local_result and local_result.data_available:
            return local_result

        # Fallback to Global MODIS Provider
        return GlobalMODISProvider.get_ndvi(lat, lon)
