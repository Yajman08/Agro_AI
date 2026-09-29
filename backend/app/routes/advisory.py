from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/api",
    tags=["Advisory"]
)

BASE_DIR = Path(__file__).resolve().parents[3]

QA_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "farmer_qa"
    / "farmer_qa_dataset_clean.csv"
)

try:
    qa_df = pd.read_csv(QA_FILE)
except Exception:
    qa_df = pd.DataFrame()


class AdvisoryQuestionRequest(BaseModel):
    question: Optional[str] = None


class AdvisoryAction(BaseModel):
    id: str
    category: str
    priority: str
    title: str
    reason: str
    action: str
    timing: str


class AdvisoryResponse(BaseModel):
    summary: str
    actions: list[AdvisoryAction]
    generatedAt: str


@router.post("/advisory", response_model=AdvisoryResponse)
def get_advisory(request: Optional[AdvisoryQuestionRequest] = None):
    query = (request.question or "").strip().lower() if request else ""

    actions = []

    if not qa_df.empty and query:
        # Search for matching Q&A
        matches = qa_df[
            qa_df["question"].str.lower().str.contains(query, na=False) |
            qa_df["answer"].str.lower().str.contains(query, na=False) |
            qa_df["topic"].str.lower().str.contains(query, na=False)
        ]

        if not matches.empty:
            for idx, row in enumerate(matches.head(3).iterrows()):
                data = row[1]
                category = "soil" if "soil" in str(data.get("topic", "")).lower() else "crop"
                actions.append(
                    AdvisoryAction(
                        id=f"act-{idx+1}",
                        category=category,
                        priority="high" if idx == 0 else "medium",
                        title=str(data["question"]),
                        reason=f"Topic: {data.get('topic', 'General Agriculture')} ({data.get('source', 'FAO')})",
                        action=str(data["answer"]),
                        timing="Immediate"
                    )
                )

    if not actions:
        # Default structured advice based on standard FAO recommendations
        actions = [
            AdvisoryAction(
                id="act-1",
                category="weather",
                priority="high",
                title="Monitor Field Moisture & Soil Conditions",
                reason="Regular field observation prevents over-watering and nutrient runoff.",
                action="Inspect soil moisture at root level before scheduling irrigation.",
                timing="Before next irrigation cycle"
            ),
            AdvisoryAction(
                id="act-2",
                category="soil",
                priority="medium",
                title="Maintain Organic Soil Cover & Mulch",
                reason="Soil cover conserves moisture and suppresses weed growth.",
                action="Retain crop residues or apply organic mulch to exposed soil.",
                timing="Current season"
            ),
            AdvisoryAction(
                id="act-3",
                category="crop",
                priority="medium",
                title="Inspect Leaves for Early Disease Signs",
                reason="Early detection of pathogens allows targeted, non-chemical interventions.",
                action="Check lower leaf surfaces for discoloration, spots, or fungal growth.",
                timing="Weekly inspection"
            )
        ]

    summary = (
        f"Custom advisory for '{request.question}': {len(actions)} prioritized recommendations prepared."
        if request and request.question
        else "Prioritized farming advisory based on soil, weather, and crop recommendations."
    )

    return AdvisoryResponse(
        summary=summary,
        actions=actions,
        generatedAt=datetime.now(timezone.utc).isoformat()
    )


@router.get("/advisory", response_model=AdvisoryResponse)
def get_advisory_get():
    return get_advisory(None)
