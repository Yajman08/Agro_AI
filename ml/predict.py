import pandas as pd
import joblib

from pathlib import Path


# ============================================================
# 1. PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "crop_yield_model.pkl"
)


# ============================================================
# 2. CHECK MODEL
# ============================================================

print("=" * 60)
print("Agro_AI - Crop Yield Prediction")
print("=" * 60)

if not MODEL_PATH.exists():
    print("\nERROR: Trained model not found!")
    print("Expected location:")
    print(MODEL_PATH)
    raise FileNotFoundError(MODEL_PATH)


# ============================================================
# 3. LOAD MODEL
# ============================================================

print("\nLoading trained model...")

model = joblib.load(MODEL_PATH)

print("Model loaded successfully!")


# ============================================================
# 4. GET USER INPUT
# ============================================================

print("\nEnter crop information")
print("-" * 30)

country = input("Country: ").strip()

crop = input("Crop: ").strip()

year = int(
    input("Year: ")
)

area_harvested_ha = float(
    input("Area harvested (hectares): ")
)

production_tonnes = float(
    input("Production (tonnes): ")
)


# ============================================================
# 5. CREATE INPUT DATAFRAME
# ============================================================

input_data = pd.DataFrame({
    "country": [country],
    "crop": [crop],
    "year": [year],
    "area_harvested_ha": [area_harvested_ha],
    "production_tonnes": [production_tonnes]
})


# ============================================================
# 6. PREDICT YIELD
# ============================================================

prediction = model.predict(
    input_data
)[0]


# ============================================================
# 7. DISPLAY RESULT
# ============================================================

print("\n" + "=" * 60)
print("CROP YIELD PREDICTION")
print("=" * 60)

print(f"Country: {country}")
print(f"Crop: {crop}")
print(f"Year: {year}")
print(f"Area harvested: {area_harvested_ha:.2f} ha")
print(f"Production: {production_tonnes:.2f} tonnes")

print(
    f"\nPredicted Yield: {prediction:.2f} hg/ha"
)

print("=" * 60)
print("Prediction completed successfully!")
print("=" * 60)