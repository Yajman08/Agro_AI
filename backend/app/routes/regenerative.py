from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/api",
    tags=["Regenerative Agriculture"]
)

BASE_DIR = Path(__file__).resolve().parents[3]

REGENERATIVE_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "regenerative"
    / "regenerative_agriculture_dataset_clean.csv"
)

try:
    regen_df = pd.read_csv(REGENERATIVE_FILE)
except Exception:
    regen_df = pd.DataFrame()


class PracticeItem(BaseModel):
    id: str
    practice: str
    benefit: str
    whenToUse: str
    detail: str


class SustainabilityMetricItem(BaseModel):
    label: str
    value: float
    trend: str


class RegenerativeResponse(BaseModel):
    metrics: list[SustainabilityMetricItem]
    practices: list[PracticeItem]


@router.get("/regenerative", response_model=RegenerativeResponse)
def get_regenerative_practices():
    practices = []

    if not regen_df.empty:
        for idx, row in regen_df.iterrows():
            practices.append(
                PracticeItem(
                    id=f"regen-{idx+1}",
                    practice=str(row.get("practice", "Regenerative Practice")),
                    benefit=str(row.get("benefits", "Improves soil health and farm resilience.")),
                    whenToUse=str(row.get("suitable_conditions", "Applicable during general farming operations.")),
                    detail=str(row.get("description", "Sustainable farming practice based on FAO guidelines."))
                )
            )

    if not practices:
        practices = [
            PracticeItem(
                id="regen-1",
                practice="No-till farming",
                benefit="Protects soil structure, reduces erosion and maintains biological activity.",
                whenToUse="Seeding into existing residues",
                detail="Plant crops with minimum mechanical soil disturbance."
            ),
            PracticeItem(
                id="regen-2",
                practice="Cover cropping",
                benefit="Suppresses weeds, recycles nutrients and increases organic matter.",
                whenToUse="Between main cropping seasons",
                detail="Grow cover crops during fallow periods to maintain living root cover."
            ),
            PracticeItem(
                id="regen-3",
                practice="Crop rotation",
                benefit="Improves nutrient cycling and reduces pest and disease pressure.",
                whenToUse="Multi-season planning",
                detail="Sequence crops with complementary root structures and nutrient demands."
            )
        ]

    metrics = [
        SustainabilityMetricItem(label="Soil Organic Matter Index", value=78.5, trend="up"),
        SustainabilityMetricItem(label="Water Infiltration Efficiency", value=84.0, trend="up"),
        SustainabilityMetricItem(label="Biodiversity & Habitat Cover", value=72.0, trend="flat"),
        SustainabilityMetricItem(label="Synthetic Input Reduction", value=65.0, trend="up"),
    ]

    return RegenerativeResponse(
        metrics=metrics,
        practices=practices
    )
