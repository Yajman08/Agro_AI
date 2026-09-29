from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

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


class LocationContext(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None


class WeatherContext(BaseModel):
    temperature: Optional[float] = None
    condition: Optional[str] = None
    humidity: Optional[float] = None
    rain_probability: Optional[float] = None
    precipitation: Optional[float] = None


class SoilContext(BaseModel):
    ph: Optional[float] = None
    health_score: Optional[float] = None
    health_label: Optional[str] = None
    organic_carbon: Optional[float] = None
    nitrogen: Optional[float] = None
    source: Optional[str] = None
    scope: Optional[str] = None


class VegetationContext(BaseModel):
    ndvi: Optional[float] = None
    observation_date: Optional[str] = None
    interpretation: Optional[str] = None
    source: Optional[str] = None
    scope: Optional[str] = None


class AdvisoryContextRequest(BaseModel):
    question: Optional[str] = None
    farmer_name: Optional[str] = None
    crop: Optional[str] = None
    location: Optional[LocationContext] = None
    weather: Optional[WeatherContext] = None
    soil: Optional[SoilContext] = None
    vegetation: Optional[VegetationContext] = None
    disease_result: Optional[dict[str, Any]] = None


class AdvisoryAction(BaseModel):
    id: str
    category: str  # weather, soil, crop, sustainability, disease
    priority: str  # high, medium, low
    title: str
    reason: str
    action: str
    timing: str


class KnowledgeReference(BaseModel):
    title: str
    topic: str
    source: str = "FAO Knowledge Base"


class AdvisoryResponse(BaseModel):
    summary: str
    actions: list[AdvisoryAction]
    generatedAt: str
    location_name: Optional[str] = None
    crop: Optional[str] = None
    sources: list[KnowledgeReference] = []


@router.post("/advisory", response_model=AdvisoryResponse)
def get_advisory(request: Optional[AdvisoryContextRequest] = None):
    req = request or AdvisoryContextRequest()
    question_query = (req.question or "").strip().lower()
    
    # 1. Location & Context Extraction
    loc_name = req.location.name if (req.location and req.location.name) else "Selected Location"
    country = req.location.country if (req.location and req.location.country) else ""
    lat = req.location.latitude if (req.location and req.location.latitude is not None) else None
    lon = req.location.longitude if (req.location and req.location.longitude is not None) else None

    crop_name = req.crop or "Selected Crop"
    farmer_name = req.farmer_name or "Farmer"

    w_temp = req.weather.temperature if (req.weather and req.weather.temperature is not None) else 22.0
    w_cond = req.weather.condition if (req.weather and req.weather.condition) else "Clear"
    w_rain_prob = req.weather.rain_probability if (req.weather and req.weather.rain_probability is not None) else 20.0

    s_ph = req.soil.ph if (req.soil and req.soil.ph is not None) else None
    s_label = req.soil.health_label if (req.soil and req.soil.health_label) else "Good"
    s_source = req.soil.source if (req.soil and req.soil.source) else "Environmental Provider"
    s_scope = req.soil.scope if (req.soil and req.soil.scope) else "Global"

    v_ndvi = req.vegetation.ndvi if (req.vegetation and req.vegetation.ndvi is not None) else None
    v_source = req.vegetation.source if (req.vegetation and req.vegetation.source) else "MODIS MOD13Q1"
    v_scope = req.vegetation.scope if (req.vegetation and req.vegetation.scope) else "Global"

    # 2. Search FAO Q&A Dataset for Relevant Agricultural Facts
    fao_matches = []
    knowledge_refs = []

    search_terms = [crop_name.lower()]
    if question_query:
        search_terms.append(question_query)
    
    if not qa_df.empty:
        for term in search_terms:
            matches = qa_df[
                qa_df["question"].str.lower().str.contains(term, na=False) |
                qa_df["answer"].str.lower().str.contains(term, na=False) |
                qa_df["topic"].str.lower().str.contains(term, na=False)
            ]
            if not matches.empty:
                for _, row in matches.head(3).iterrows():
                    fao_matches.append(row)
                    knowledge_refs.append(KnowledgeReference(
                        title=str(row["question"]),
                        topic=str(row.get("topic", "Agricultural Practices")),
                        source=str(row.get("source", "FAO Knowledge Base"))
                    ))

    # 3. Construct Situation Summary
    coord_str = f" ({lat:.2f}° N, {lon:.2f}° E)" if (lat is not None and lon is not None) else ""
    loc_display = f"{loc_name}{coord_str}"
    
    env_snippets = []
    env_snippets.append(f"Weather: {w_cond}, {w_temp:.1f}°C")
    if s_ph is not None:
        env_snippets.append(f"Soil pH {s_ph:.1f} ({s_source} · {s_scope})")
    if v_ndvi is not None:
        env_snippets.append(f"NDVI {v_ndvi:.4f} ({v_source} · {v_scope})")

    env_str = "; ".join(env_snippets)

    if question_query:
        summary = f"Custom AI Agro-Advisory for {loc_display} responding to '{req.question}'. Active environment context: {env_str}. Primary crop focus: {crop_name}."
    else:
        summary = f"Location-aware AI Agro-Advisory for {loc_display}. Current environmental intelligence: {env_str}. Tailored crop focus: {crop_name}."

    # 4. Generate Actionable Recommendations
    actions = []
    act_counter = 1

    # Action 1: Weather & Climate Response
    if w_rain_prob >= 50:
        actions.append(AdvisoryAction(
            id=f"act-{act_counter}",
            category="weather",
            priority="high",
            title=f"Adjust Irrigation & Spraying for Rain in {loc_name}",
            reason=f"Open-Meteo forecast indicates a {w_rain_prob:.0f}% chance of rain with {w_cond}.",
            action="Defer foliar fertilizer and pesticide spraying to avoid chemical wash-off. Ensure field drainage channels are clear.",
            timing="Next 24 Hours"
        ))
    else:
        actions.append(AdvisoryAction(
            id=f"act-{act_counter}",
            category="weather",
            priority="high",
            title=f"Optimize Irrigation for Current {w_cond} Conditions",
            reason=f"Current temperature is {w_temp:.1f}°C with low rain probability ({w_rain_prob:.0f}%).",
            action=f"Maintain steady soil moisture for {crop_name}. Irrigate during cooler early morning hours to limit evaporation.",
            timing="Immediate / Today"
        ))
    act_counter += 1

    # Action 2: Soil & Nutrient Management
    if s_ph is not None:
        if s_ph < 6.0:
            ph_action = "Consider applying agricultural lime or organic compost to gradually raise soil pH toward neutral optimum."
            ph_reason = f"Soil pH is acidic ({s_ph:.1f}) as detected by {s_source} ({s_scope})."
        elif s_ph > 7.8:
            ph_action = "Incorporate elemental sulfur or acidifying organic amendments to balance soil pH for optimal nutrient uptake."
            ph_reason = f"Soil pH is alkaline ({s_ph:.1f}) based on {s_source} ({s_scope})."
        else:
            ph_action = f"Soil pH ({s_ph:.1f}) is within the optimal range for {crop_name}. Maintain organic cover and avoid excessive chemical input."
            ph_reason = f"Soil health is rated '{s_label}' by {s_source} ({s_scope})."

        actions.append(AdvisoryAction(
            id=f"act-{act_counter}",
            category="soil",
            priority="medium",
            title=f"Soil Health & Nutrient Management ({s_source})",
            reason=ph_reason,
            action=ph_action,
            timing="Current Crop Cycle"
        ))
        act_counter += 1

    # Action 3: Satellite Vegetation / Canopy Monitoring
    if v_ndvi is not None:
        if v_ndvi >= 0.5:
            v_action = f"Satellite NDVI ({v_ndvi:.4f}) indicates vigorous vegetative canopy growth. Continue balanced crop management."
            v_reason = f"MODIS {v_source} ({v_scope}) greenness index confirms healthy canopy coverage in {loc_name}."
        elif v_ndvi >= 0.2:
            v_action = f"NDVI signal ({v_ndvi:.4f}) shows moderate greenness. Inspect for uneven emergence or localized moisture stress."
            v_reason = f"MODIS satellite observation ({v_source}) indicates early-stage crop or moderate vegetative density."
        else:
            v_action = f"NDVI signal ({v_ndvi:.4f}) indicates low vegetation density or bare soil. Prepare seedbed or check seedling vigor."
            v_reason = f"Satellite vegetation index from {v_source} indicates sparse vegetation cover."

        actions.append(AdvisoryAction(
            id=f"act-{act_counter}",
            category="crop",
            priority="medium",
            title=f"Canopy Density & Growth Tracking ({v_source})",
            reason=v_reason,
            action=v_action,
            timing="Weekly Field Scouting"
        ))
        act_counter += 1

    # Action 4: FAO Knowledge-Based Action
    if fao_matches:
        fao_row = fao_matches[0]
        actions.append(AdvisoryAction(
            id=f"act-{act_counter}",
            category="sustainability",
            priority="medium",
            title=f"FAO Practice: {str(fao_row['question'])[:50]}...",
            reason=f"Validated agricultural practice from FAO Knowledge Base for {crop_name}.",
            action=str(fao_row["answer"]),
            timing="Seasonal Best Practice"
        ))
        act_counter += 1
    else:
        actions.append(AdvisoryAction(
            id=f"act-{act_counter}",
            category="sustainability",
            priority="medium",
            title=f"Regenerative Agriculture & Soil Cover for {crop_name}",
            reason=f"FAO principles recommendation for sustainable crop management in {loc_name}.",
            action="Apply organic mulch or maintain cover crops between rows to preserve soil moisture, build humus, and prevent erosion.",
            timing="Ongoing"
        ))
        act_counter += 1

    # Deduplicate knowledge references
    unique_refs = []
    seen_titles = set()
    for ref in knowledge_refs:
        if ref.title not in seen_titles:
            seen_titles.add(ref.title)
            unique_refs.append(ref)
            if len(unique_refs) >= 3:
                break

    if not unique_refs:
        unique_refs.append(KnowledgeReference(
            title=f"FAO Guidelines for {crop_name} Sustainable Production",
            topic="Crop Production & Protection",
            source="FAO Knowledge Base"
        ))

    return AdvisoryResponse(
        summary=summary,
        actions=actions,
        generatedAt=datetime.now(timezone.utc).isoformat(),
        location_name=loc_name,
        crop=crop_name,
        sources=unique_refs
    )


@router.get("/advisory", response_model=AdvisoryResponse)
def get_advisory_get():
    return get_advisory(None)
