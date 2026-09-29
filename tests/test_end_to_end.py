import sys
import os
from pathlib import Path
import asyncio

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "backend"))
sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import UploadFile
from app.routes.farmer import get_farmer_profile, update_farmer_profile, FarmerProfile, Location, Farm, Soil
from app.routes.weather import get_weather
from app.routes.soil import get_soil
from app.routes.crops import crop_recommendation, CropRecommendationRequest
from app.routes.disease import disease_detection
from app.routes.advisory import get_advisory, AdvisoryQuestionRequest
from app.routes.regenerative import get_regenerative_practices


def run_e2e_tests():
    print("=" * 70)
    print("AgriNexus AI - End-to-End System & API Verification")
    print("=" * 70)

    # 1. Health Check
    print("\n[1/7] Testing Farmer Profile API...")
    profile = get_farmer_profile()
    assert profile.id == "farmer-001"
    print(f"  [OK] Farmer Profile retrieved: {profile.name} ({profile.location.village}, {profile.location.state})")

    # Update profile
    profile.currentCrop = "Rice"
    updated = update_farmer_profile(profile)
    assert updated.currentCrop == "Rice"
    print(f"  [OK] Farmer Profile updated successfully.")

    # 2. Weather API
    print("\n[2/7] Testing Weather API (Live Open-Meteo)...")
    weather = get_weather(lat=profile.location.latitude, lon=profile.location.longitude)
    assert weather.now.temperatureC is not None
    print(f"  [OK] Weather retrieved: {weather.now.temperatureC}°C, {weather.now.condition}, Humidity: {weather.now.humidityPct}%")
    print(f"  [OK] Forecast days: {len(weather.forecast)} days available.")

    # 3. Soil API
    print("\n[3/7] Testing Soil API (India Soil Dataset)...")
    soil_data = get_soil(lat=profile.location.latitude, lon=profile.location.longitude)
    assert soil_data.healthScore > 0
    print(f"  [OK] Soil Data retrieved: Health Score {soil_data.healthScore} ({soil_data.healthLabel})")
    print(f"  [OK] Metrics: pH={soil_data.metrics[0].value}, Texture=(Sand: {soil_data.texture.sand}%, Clay: {soil_data.texture.clay}%)")

    # 4. Crop Recommendation API
    print("\n[4/7] Testing Crop Recommendation API (ML Model)...")
    crop_req = CropRecommendationRequest(
        latitude=profile.location.latitude,
        longitude=profile.location.longitude,
        month=9
    )
    crop_res = crop_recommendation(crop_req)
    assert "primary" in crop_res
    print(f"  [OK] Top Crop Recommendation: {crop_res['primary']['crop']} ({crop_res['primary']['confidencePct']}% confidence)")
    print(f"  [OK] Alternatives count: {len(crop_res['alternatives'])}")

    # 5. Disease Detection API
    print("\n[5/7] Testing Disease Detection API (MobileNetV2)...")
    sample_img_path = PROJECT_ROOT / "data" / "india" / "disease" / "PlantVillage-Dataset" / "raw" / "color" / "Potato___Early_blight"
    img_files = list(sample_img_path.glob("*.jpg"))
    assert len(img_files) > 0, "No sample test image found!"

    with open(img_files[0], "rb") as f:
        upload = UploadFile(file=f, filename=img_files[0].name, headers={"content-type": "image/jpeg"})
        disease_res = asyncio.run(disease_detection(upload))

    assert "disease" in disease_res
    print(f"  [OK] Disease Detected: {disease_res['disease']} ({disease_res['confidencePct']}% confidence)")
    print(f"  [OK] Actions: {len(disease_res['actions'])} management actions provided.")

    # 6. AI Agro-Advisory API
    print("\n[6/7] Testing AI Agro-Advisory API...")
    adv_req = AdvisoryQuestionRequest(question="How can I improve soil fertility?")
    adv_res = get_advisory(adv_req)
    assert len(adv_res.actions) > 0
    print(f"  [OK] Advisory Summary: {adv_res.summary}")
    print(f"  [OK] Top Action: {adv_res.actions[0].title}")

    # 7. Sustainable / Regenerative API
    print("\n[7/7] Testing Regenerative Agriculture API...")
    regen_res = get_regenerative_practices()
    assert len(regen_res.practices) > 0
    print(f"  [OK] Regenerative Practices retrieved: {len(regen_res.practices)} practices.")
    print(f"  [OK] Practice #1: {regen_res.practices[0].practice} - {regen_res.practices[0].benefit}")

    print("\n" + "=" * 70)
    print("ALL 7 END-TO-END FLOW APIS VERIFIED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    run_e2e_tests()
