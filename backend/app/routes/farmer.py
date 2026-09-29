from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional


router = APIRouter(
    prefix="/api/farmer",
    tags=["Farmer"]
)


class Location(BaseModel):
    village: str
    district: str
    state: str
    country: str
    latitude: float
    longitude: float


class Farm(BaseModel):
    sizeAcres: float
    irrigationType: str


class Soil(BaseModel):
    ph: Optional[float] = None


class FarmerProfile(BaseModel):
    id: str
    name: str
    phone: Optional[str] = None
    location: Location
    farm: Farm
    currentCrop: str
    preferredLanguage: str
    onboardedAt: str
    soil: Optional[Soil] = None


farmer_profile = FarmerProfile(
    id="farmer-001",
    name="Manjunath",
    phone=None,
    location=Location(
        village="Mandya",
        district="Mandya",
        state="Karnataka",
        country="India",
        latitude=12.5218,
        longitude=76.8951
    ),
    farm=Farm(
        sizeAcres=2.5,
        irrigationType="Canal"
    ),
    currentCrop="Rice",
    preferredLanguage="Kannada",
    onboardedAt="2026-09-28T00:00:00Z",
    soil=Soil(
        ph=6.7
    )
)


@router.get("/profile", response_model=FarmerProfile)
def get_farmer_profile():
    return farmer_profile


@router.put("/profile", response_model=FarmerProfile)
def update_farmer_profile(profile: FarmerProfile):
    global farmer_profile

    farmer_profile = profile

    return farmer_profile