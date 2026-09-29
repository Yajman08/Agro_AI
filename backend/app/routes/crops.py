from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any
import sys
from pathlib import Path

# Project root: C:\Users\Sagar\Agro_AI
BASE_DIR = Path(__file__).resolve().parents[3]

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.crop_recommendation import recommend_crops


router = APIRouter(
    prefix="/api",
    tags=["Crop Recommendation"]
)


class CropRecommendationRequest(BaseModel):
    latitude: float
    longitude: float
    month: int


@router.post("/crop-recommendation")
def crop_recommendation(
    request: CropRecommendationRequest
) -> dict[str, Any]:

    if not -90 <= request.latitude <= 90:
        raise HTTPException(
            status_code=400,
            detail="Invalid latitude."
        )

    if not -180 <= request.longitude <= 180:
        raise HTTPException(
            status_code=400,
            detail="Invalid longitude."
        )

    if not 1 <= request.month <= 12:
        raise HTTPException(
            status_code=400,
            detail="Month must be between 1 and 12."
        )

    try:

        results = recommend_crops(
            latitude=request.latitude,
            longitude=request.longitude,
            month=request.month,
            top_n=5
        )

        if results.empty:
            raise HTTPException(
                status_code=404,
                detail="No crop recommendations found."
            )

        recommendations = []

        for _, row in results.iterrows():

            score = float(row["recommendation_score"]) * 100

            recommendations.append({
                "crop": str(row["display_crop"]),

                "confidencePct": round(score, 2),

                "reasons": [
                    f"Yield suitability: {float(row['yield_score']) * 100:.1f}%",
                    f"Soil suitability: {float(row['soil_score']) * 100:.1f}%",
                    f"Season suitability: {float(row['calendar_score']) * 100:.1f}%",
                    f"Vegetation signal: {float(row['ndvi_score']) * 100:.1f}%"
                ]
            })

        primary = recommendations[0]

        alternatives = recommendations[1:]

        factors = [
            {
                "label": "Historical yield",
                "detail": "Historical crop yield performance",
                "supportive": float(
                    results.iloc[0]["yield_score"]
                ) >= 0.5
            },
            {
                "label": "Soil suitability",
                "detail": "Nearest available soil observation",
                "supportive": float(
                    results.iloc[0]["soil_score"]
                ) >= 0.5
            },
            {
                "label": "Crop calendar",
                "detail": "Planting season compatibility",
                "supportive": float(
                    results.iloc[0]["calendar_score"]
                ) >= 0.5
            },
            {
                "label": "NDVI",
                "detail": "Local vegetation signal",
                "supportive": float(
                    results.iloc[0]["ndvi_score"]
                ) >= 0.5
            }
        ]

        return {
            "primary": primary,
            "alternatives": alternatives,
            "factorsConsidered": factors,
            "season": f"Month {request.month}",
            "dataSource": (
                "AgriNexus AI: Soil + Crop Yield + "
                "Crop Calendar + MODIS NDVI"
            )
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Crop recommendation failed: {str(error)}"
        )