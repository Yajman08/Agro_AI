from datetime import datetime, timezone
from pathlib import Path
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.providers import SoilProviderResolver

router = APIRouter(
    prefix="/api",
    tags=["Soil"]
)



# ---------------------------------------------------------
# Dataset
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[3]

SOIL_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "Soil"
    / "soil_dataset_india_clean.csv"
)


# Load once when FastAPI starts
try:
    soil_df = pd.read_csv(SOIL_FILE)
except Exception as error:
    soil_df = pd.DataFrame()
    print(f"Failed to load soil dataset: {error}")


# ---------------------------------------------------------
# Response models
# ---------------------------------------------------------

class SoilMetric(BaseModel):
    key: str
    label: str
    value: float
    unit: str
    rating: str
    range: dict[str, float]
    meaning: str
    action: str


class SoilTexture(BaseModel):
    sand: float
    silt: float
    clay: float


class SoilData(BaseModel):
    healthScore: float
    healthLabel: str
    metrics: list[SoilMetric]
    texture: SoilTexture
    dataSource: str
    lastUpdated: str


# ---------------------------------------------------------
# Helper functions
# ---------------------------------------------------------

def get_rating(value: float, minimum: float, maximum: float) -> str:
    if minimum <= value <= maximum:
        return "good"

    if value < minimum:
        return "low"

    return "high"


def get_soil_score(
    ph: float,
    nitrogen: float,
    organic_carbon: float
) -> float:

    # pH suitability
    if 6.0 <= ph <= 7.5:
        ph_score = 1.0
    elif 5.5 <= ph <= 8.0:
        ph_score = 0.7
    else:
        ph_score = 0.4

    # Nitrogen suitability
    if nitrogen >= 2:
        nitrogen_score = 1.0
    elif nitrogen >= 1:
        nitrogen_score = 0.7
    else:
        nitrogen_score = 0.4

    # Organic carbon suitability
    if organic_carbon >= 1:
        carbon_score = 1.0
    elif organic_carbon >= 0.5:
        carbon_score = 0.7
    else:
        carbon_score = 0.4

    return (
        ph_score * 0.4
        + nitrogen_score * 0.3
        + carbon_score * 0.3
    )


# ---------------------------------------------------------
# API
# ---------------------------------------------------------

@router.get("/soil", response_model=SoilData)
def get_soil(
    lat: float | None = None,
    lon: float | None = None,
):

    if soil_df.empty:
        raise HTTPException(
            status_code=500,
            detail="Soil dataset could not be loaded."
        )

    # -----------------------------------------------------
    # Make sure required columns are numeric
    # -----------------------------------------------------

    required_columns = [
        "latitude",
        "longitude",
        "soil_ph",
        "nitrogen",
        "organic_carbon",
        "sand",
        "silt",
        "clay",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in soil_df.columns
    ]

    if missing_columns:
        raise HTTPException(
            status_code=500,
            detail=f"Missing soil columns: {missing_columns}"
        )

    df = soil_df.copy()

    for column in required_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    df = df.dropna(
        subset=required_columns
    )

    if df.empty:
        raise HTTPException(
            status_code=404,
            detail="No valid soil records available."
        )

    # -----------------------------------------------------
    # Find nearest soil observation
    # -----------------------------------------------------

    if lat is not None and lon is not None:
        if not -90 <= lat <= 90:
            raise HTTPException(status_code=400, detail="Invalid latitude.")
        if not -180 <= lon <= 180:
            raise HTTPException(status_code=400, detail="Invalid longitude.")

        res = SoilProviderResolver.get_soil(lat, lon)
        if res.data_available and res.ph is not None and res.organic_carbon is not None:
            ph = res.ph
            nitrogen = res.nitrogen if res.nitrogen is not None else 1.5
            organic_carbon = res.organic_carbon
            sand = res.texture["sand"] if res.texture else 40.0
            silt = res.texture["silt"] if res.texture else 35.0
            clay = res.texture["clay"] if res.texture else 25.0
            data_source = f"AgriNexus AI: {res.source} ({res.scope})"
        else:
            # Fallback to nearest local record if global provider returned no data
            df["distance"] = (df["latitude"] - lat) ** 2 + (df["longitude"] - lon) ** 2
            row = df.loc[df["distance"].idxmin()]
            ph = float(row["soil_ph"])
            nitrogen = float(row["nitrogen"])
            organic_carbon = float(row["organic_carbon"])
            sand = float(row["sand"])
            silt = float(row["silt"])
            clay = float(row["clay"])
            data_source = "AgriNexus AI: India Soil Dataset"
    else:
        row = df.iloc[0]
        ph = float(row["soil_ph"])
        nitrogen = float(row["nitrogen"])
        organic_carbon = float(row["organic_carbon"])
        sand = float(row["sand"])
        silt = float(row["silt"])
        clay = float(row["clay"])
        data_source = "AgriNexus AI: India Soil Dataset"

    # -----------------------------------------------------

    # Soil health score
    # -----------------------------------------------------

    score = get_soil_score(
        ph,
        nitrogen,
        organic_carbon
    )

    health_score = round(score * 100, 1)

    if health_score >= 80:
        health_label = "Excellent"
    elif health_score >= 65:
        health_label = "Good"
    elif health_score >= 50:
        health_label = "Moderate"
    else:
        health_label = "Needs attention"

    # -----------------------------------------------------
    # Metrics
    # -----------------------------------------------------

    ph_rating = get_rating(
        ph,
        6.0,
        7.5
    )

    nitrogen_rating = (
        "good"
        if nitrogen >= 2
        else "adequate"
        if nitrogen >= 1
        else "low"
    )

    carbon_rating = (
        "good"
        if organic_carbon >= 1
        else "adequate"
        if organic_carbon >= 0.5
        else "low"
    )

    metrics = [

        SoilMetric(
            key="ph",
            label="Soil pH",
            value=round(ph, 2),
            unit="pH",
            rating=ph_rating,
            range={
                "min": 6.0,
                "max": 7.5
            },
            meaning=(
                "Measures soil acidity or alkalinity "
                "and affects nutrient availability."
            ),
            action=(
                "Maintain soil pH within the suitable "
                "range for the selected crop."
            ),
        ),

        SoilMetric(
            key="nitrogen",
            label="Nitrogen",
            value=round(nitrogen, 2),
            unit="mg/kg",
            rating=nitrogen_rating,
            range={
                "min": 40,
                "max": 120
            },
            meaning=(
                "Nitrogen supports vegetative growth "
                "and crop development."
            ),
            action=(
                "Monitor crop growth and soil nutrient "
                "conditions before applying additional nitrogen."
            ),
        ),

        SoilMetric(
            key="organic_carbon",
            label="Organic Carbon",
            value=round(organic_carbon, 2),
            unit="%",
            rating=carbon_rating,
            range={
                "min": 0.5,
                "max": 1.2
            },
            meaning=(
                "Organic carbon is an indicator of "
                "soil organic matter and soil quality."
            ),
            action=(
                "Maintain or increase organic matter "
                "through appropriate soil management."
            ),
        ),
    ]

    # -----------------------------------------------------
    # Final response
    # -----------------------------------------------------

    return SoilData(

        healthScore=health_score,

        healthLabel=health_label,

        metrics=metrics,

        texture=SoilTexture(
            sand=round(sand, 2),
            silt=round(silt, 2),
            clay=round(clay, 2),
        ),

        dataSource=data_source,

        lastUpdated=datetime.now(
            timezone.utc
        ).isoformat(),
    )