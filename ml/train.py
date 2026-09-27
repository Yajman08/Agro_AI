import pandas as pd
import numpy as np
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score


# ============================================================
# 1. PROJECT PATHS
# ============================================================

# Project root = Agro_AI
BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = (
    BASE_DIR
    / "data"
    / "Processed"
    / "Crop"
    / "crop_yield_dataset_india_clean.csv"
)

MODEL_DIR = BASE_DIR / "ml" / "models"

MODEL_PATH = MODEL_DIR / "crop_yield_model.pkl"


# ============================================================
# 2. CHECK DATASET
# ============================================================

print("=" * 60)
print("Agro_AI - Crop Yield Prediction")
print("=" * 60)

print("\nChecking dataset...")

if not DATA_PATH.exists():
    print("\nERROR: Dataset not found!")
    print("Expected location:")
    print(DATA_PATH)
    raise FileNotFoundError(DATA_PATH)

print("Dataset found:")
print(DATA_PATH)


# ============================================================
# 3. LOAD DATASET
# ============================================================

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print("Original dataset shape:", df.shape)


# ============================================================
# 4. CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
    "country",
    "crop",
    "year",
    "area_harvested_ha",
    "production_tonnes",
    "yield_hg_per_ha"
]

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    print("\nERROR: Required columns are missing:")
    print(missing_columns)
    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )

print("\nAll required columns are present.")


# ============================================================
# 5. CLEAN COLUMN NAMES
# ============================================================

df.columns = df.columns.str.strip()


# ============================================================
# 6. CONVERT NUMERIC COLUMNS
# ============================================================

numeric_columns = [
    "year",
    "area_harvested_ha",
    "production_tonnes",
    "yield_hg_per_ha"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(
        df[column],
        errors="coerce"
    )


# ============================================================
# 7. REPLACE INFINITE VALUES
# ============================================================

df.replace(
    [np.inf, -np.inf],
    np.nan,
    inplace=True
)


# ============================================================
# 8. SHOW MISSING VALUES
# ============================================================

print("\nMissing values before cleaning:")
print(df[required_columns].isnull().sum())


# ============================================================
# 9. REMOVE ROWS WITH MISSING TARGET
# ============================================================

before = len(df)

df = df.dropna(
    subset=["yield_hg_per_ha"]
)

after = len(df)

print(
    f"\nRemoved {before - after} rows "
    "with missing target values."
)

if len(df) == 0:
    raise ValueError(
        "No valid rows remain after removing missing target values."
    )


# ============================================================
# 10. DEFINE FEATURES AND TARGET
# ============================================================

X = df[
    [
        "country",
        "crop",
        "year",
        "area_harvested_ha",
        "production_tonnes"
    ]
]

y = df["yield_hg_per_ha"]


print("\nFeatures:")
print(X.columns.tolist())

print("\nTarget:")
print("yield_hg_per_ha")


# ============================================================
# 11. FEATURE TYPES
# ============================================================

categorical_features = [
    "country",
    "crop"
]

numeric_features = [
    "year",
    "area_harvested_ha",
    "production_tonnes"
]


# ============================================================
# 12. CATEGORICAL PREPROCESSING
# ============================================================

categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="most_frequent"
            )
        ),
        (
            "encoder",
            OneHotEncoder(
                handle_unknown="ignore"
            )
        )
    ]
)


# ============================================================
# 13. NUMERIC PREPROCESSING
# ============================================================

numeric_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="median"
            )
        )
    ]
)


# ============================================================
# 14. COMBINE PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            categorical_pipeline,
            categorical_features
        ),
        (
            "numeric",
            numeric_pipeline,
            numeric_features
        )
    ]
)


# ============================================================
# 15. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print("\nDataset split:")
print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 16. RANDOM FOREST MODEL
# ============================================================

regressor = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)


# ============================================================
# 17. COMPLETE ML PIPELINE
# ============================================================

model = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "regressor",
            regressor
        )
    ]
)


# ============================================================
# 18. TRAIN MODEL
# ============================================================

print("\n" + "=" * 60)
print("Training Random Forest model...")
print("=" * 60)

model.fit(
    X_train,
    y_train
)

print("Training completed successfully!")


# ============================================================
# 19. MAKE PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

y_pred = model.predict(X_test)


# ============================================================
# 20. EVALUATE MODEL
# ============================================================

mae = mean_absolute_error(
    y_test,
    y_pred
)

r2 = r2_score(
    y_test,
    y_pred
)


print("\n" + "=" * 60)
print("MODEL EVALUATION")
print("=" * 60)

print(
    f"Mean Absolute Error (MAE): {mae:.2f}"
)

print(
    f"R2 Score: {r2:.4f}"
)


# ============================================================
# 21. SAVE MODEL
# ============================================================

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)

joblib.dump(
    model,
    MODEL_PATH
)


# ============================================================
# 22. VERIFY MODEL FILE
# ============================================================

if MODEL_PATH.exists():

    print("\n" + "=" * 60)
    print("MODEL SAVED SUCCESSFULLY")
    print("=" * 60)

    print("Model:")
    print(MODEL_PATH)

    print(
        f"\nModel size: "
        f"{MODEL_PATH.stat().st_size / 1024:.2f} KB"
    )

else:

    raise FileNotFoundError(
        "Model file was not created."
    )


# ============================================================
# 23. SAMPLE PREDICTION
# ============================================================

print("\nSample prediction:")

sample = X_test.iloc[[0]]

sample_prediction = model.predict(
    sample
)[0]

print(
    f"Actual yield: "
    f"{y_test.iloc[0]:.2f} hg/ha"
)

print(
    f"Predicted yield: "
    f"{sample_prediction:.2f} hg/ha"
)


# ============================================================
# 24. DONE
# ============================================================

print("\n" + "=" * 60)
print("TRAINING COMPLETE")
print("=" * 60)