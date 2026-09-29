from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.farmer import router as farmer_router
from app.routes.weather import router as weather_router
from app.routes.soil import router as soil_router
from app.routes.crops import router as crops_router
from app.routes.disease import router as disease_router
# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="AgriNexus AI API",
    description="AI-powered interoperable digital agriculture platform",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API Routes
# --------------------------------------------------

app.include_router(farmer_router)
app.include_router(weather_router)
app.include_router(soil_router)
app.include_router(crops_router)
app.include_router(disease_router)
# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AgriNexus AI API",
        "version": "1.0.0",
    }