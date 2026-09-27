from pathlib import Path
import pandas as pd
import numpy as np
import re

# ============================================================
# AGRO_AI - CROP RECOMMENDATION SYSTEM
# Soil + Crop Yield + Crop Calendar + NDVI
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

SOIL_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "Soil"
    / "soil_dataset_india_clean.csv"
)

CROP_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "Crop"
    / "crop_yield_dataset_india_clean.csv"
)

CALENDAR_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "Soil Calender"
    / "sacks_crop_calendar_india_clean.csv"
)

NDVI_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "satellite"
    / "brics_modis_ndvi_india_clean.csv"
)


# ============================================================
# LOAD DATASETS
# ============================================================

print("\nLoading datasets...")

soil_df = pd.read_csv(SOIL_FILE)
crop_df = pd.read_csv(CROP_FILE)
calendar_df = pd.read_csv(CALENDAR_FILE)
ndvi_df = pd.read_csv(NDVI_FILE)

print("Soil dataset loaded:", soil_df.shape)
print("Crop yield dataset loaded:", crop_df.shape)
print("Crop calendar loaded:", calendar_df.shape)
print("NDVI dataset loaded:", ndvi_df.shape)


# ============================================================
# CLEAN DATA
# ============================================================

soil_df = soil_df.replace([np.inf, -np.inf], np.nan)
crop_df = crop_df.replace([np.inf, -np.inf], np.nan)
calendar_df = calendar_df.replace([np.inf, -np.inf], np.nan)
ndvi_df = ndvi_df.replace([np.inf, -np.inf], np.nan)


# ------------------------------------------------------------
# Convert numeric columns
# ------------------------------------------------------------

soil_numeric = [
    "latitude",
    "longitude",
    "soil_ph",
    "organic_carbon",
    "sand",
    "silt",
    "clay",
    "nitrogen",
]

for col in soil_numeric:
    if col in soil_df.columns:
        soil_df[col] = pd.to_numeric(
            soil_df[col],
            errors="coerce"
        )


crop_numeric = [
    "year",
    "area_harvested_ha",
    "production_tonnes",
    "yield_hg_per_ha",
]

for col in crop_numeric:
    if col in crop_df.columns:
        crop_df[col] = pd.to_numeric(
            crop_df[col],
            errors="coerce"
        )


calendar_numeric = [
    "latitude",
    "longitude",
    "planting_start_day",
    "planting_end_day",
    "harvest_start_day",
    "harvest_end_day",
    "planting_start_month",
    "planting_end_month",
    "harvest_start_month",
    "harvest_end_month",
]

for col in calendar_numeric:
    if col in calendar_df.columns:
        calendar_df[col] = pd.to_numeric(
            calendar_df[col],
            errors="coerce"
        )


ndvi_df["latitude"] = pd.to_numeric(
    ndvi_df["latitude"],
    errors="coerce"
)

ndvi_df["longitude"] = pd.to_numeric(
    ndvi_df["longitude"],
    errors="coerce"
)

ndvi_df["ndvi"] = pd.to_numeric(
    ndvi_df["ndvi"],
    errors="coerce"
)


# ------------------------------------------------------------
# Remove invalid rows
# ------------------------------------------------------------

soil_df = soil_df.dropna(
    subset=[
        "latitude",
        "longitude",
        "soil_ph",
        "nitrogen",
    ]
)

crop_df = crop_df.dropna(
    subset=[
        "crop",
        "year",
        "yield_hg_per_ha",
    ]
)

calendar_df = calendar_df.dropna(
    subset=[
        "crop",
        "planting_start_month",
        "planting_end_month",
    ]
)

ndvi_df = ndvi_df.dropna(
    subset=[
        "latitude",
        "longitude",
        "ndvi",
    ]
)


# ============================================================
# NORMALIZE CROP NAMES
# ============================================================

def normalize_crop_name(name):
    """
    Converts different spellings/formats of the same crop
    into a common name for duplicate removal.
    """

    name = str(name).strip().lower()

    # Remove punctuation
    name = re.sub(r"[^a-z0-9\s]", " ", name)

    # Remove extra spaces
    name = re.sub(r"\s+", " ", name).strip()

    # Known duplicate/variant names
    aliases = {
        "sugar crops primary": "sugar cane",
        "sugarcane": "sugar cane",
        "sugar cane": "sugar cane",
    }

    if name in aliases:
        return aliases[name]

    return name


# Keep original crop name for display
crop_df["original_crop"] = crop_df["crop"].astype(str)

calendar_df["original_crop"] = calendar_df["crop"].astype(str)

crop_df["crop_clean"] = crop_df["crop"].apply(
    normalize_crop_name
)

calendar_df["crop_clean"] = calendar_df["crop"].apply(
    normalize_crop_name
)


# ============================================================
# NDVI INFORMATION
# ============================================================

average_ndvi = ndvi_df["ndvi"].mean()

print("\nAverage NDVI:", round(average_ndvi, 4))


# ============================================================
# CROP PERFORMANCE
# ============================================================

crop_performance = (
    crop_df
    .groupby("crop_clean")
    .agg(
        average_yield=(
            "yield_hg_per_ha",
            "mean"
        ),
        number_of_records=(
            "yield_hg_per_ha",
            "count"
        ),
        display_crop=(
            "original_crop",
            "first"
        ),
    )
    .reset_index()
)


# ============================================================
# YIELD SCORE
# ============================================================

minimum_yield = crop_performance[
    "average_yield"
].min()

maximum_yield = crop_performance[
    "average_yield"
].max()


if maximum_yield > minimum_yield:

    crop_performance["yield_score"] = (
        crop_performance["average_yield"]
        - minimum_yield
    ) / (
        maximum_yield
        - minimum_yield
    )

else:

    crop_performance["yield_score"] = 1.0


# ============================================================
# CROP CALENDAR
# ============================================================

calendar_crop = (
    calendar_df
    .groupby("crop_clean")
    .agg(
        planting_start_month=(
            "planting_start_month",
            "min"
        ),
        planting_end_month=(
            "planting_end_month",
            "max"
        ),
        harvest_start_month=(
            "harvest_start_month",
            "min"
        ),
        harvest_end_month=(
            "harvest_end_month",
            "max"
        ),
    )
    .reset_index()
)


# ============================================================
# MERGE CROP PERFORMANCE + CALENDAR
# ============================================================

recommendation_df = crop_performance.merge(
    calendar_crop,
    on="crop_clean",
    how="left"
)


# ============================================================
# MONTH CHECK
# ============================================================

def month_in_range(
    month,
    start_month,
    end_month
):

    if pd.isna(start_month) or pd.isna(end_month):
        return False

    month = int(month)
    start_month = int(start_month)
    end_month = int(end_month)

    # Normal range
    if start_month <= end_month:

        return (
            start_month
            <= month
            <= end_month
        )

    # Range crossing December
    return (
        month >= start_month
        or month <= end_month
    )


# ============================================================
# SOIL SCORE
# ============================================================

def calculate_soil_score(soil):

    score = 0.0
    total = 0.0

    # --------------------------------------------------------
    # Soil pH
    # --------------------------------------------------------

    if not pd.isna(soil["soil_ph"]):

        ph = float(soil["soil_ph"])

        if 6.0 <= ph <= 7.5:
            score += 1.0

        elif 5.5 <= ph <= 8.0:
            score += 0.7

        else:
            score += 0.4

        total += 1.0


    # --------------------------------------------------------
    # Nitrogen
    # --------------------------------------------------------

    if not pd.isna(soil["nitrogen"]):

        nitrogen = float(
            soil["nitrogen"]
        )

        if nitrogen >= 2.0:
            score += 1.0

        elif nitrogen >= 1.0:
            score += 0.7

        else:
            score += 0.4

        total += 1.0


    # --------------------------------------------------------
    # Organic Carbon
    # --------------------------------------------------------

    if not pd.isna(soil["organic_carbon"]):

        carbon = float(
            soil["organic_carbon"]
        )

        if carbon >= 1.0:
            score += 1.0

        elif carbon >= 0.5:
            score += 0.7

        else:
            score += 0.4

        total += 1.0


    if total == 0:
        return 0.5

    return score / total


# ============================================================
# CROP RECOMMENDATION FUNCTION
# ============================================================

def recommend_crops(
    latitude,
    longitude,
    month,
    top_n=5
):

    print("\nFinding nearest soil information...")


    # ========================================================
    # FIND NEAREST SOIL LOCATION
    # ========================================================

    soil_df["distance"] = (
        (soil_df["latitude"] - latitude) ** 2
        +
        (soil_df["longitude"] - longitude) ** 2
    )

    nearest_soil = soil_df.loc[
        soil_df["distance"].idxmin()
    ].copy()


    soil_score = calculate_soil_score(
        nearest_soil
    )


    print(
        "Nearest soil location:",
        round(
            nearest_soil["latitude"],
            4
        ),
        round(
            nearest_soil["longitude"],
            4
        )
    )

    print(
        "Soil suitability score:",
        round(soil_score, 3)
    )


    # ========================================================
    # FIND LOCAL NDVI
    # ========================================================

    ndvi_df["distance"] = (
        (ndvi_df["latitude"] - latitude) ** 2
        +
        (ndvi_df["longitude"] - longitude) ** 2
    )


    nearest_ndvi_records = (
        ndvi_df
        .nsmallest(
            20,
            "distance"
        )
    )


    local_ndvi = (
        nearest_ndvi_records["ndvi"]
        .mean()
    )


    if pd.isna(local_ndvi):

        local_ndvi = average_ndvi


    # ========================================================
    # NDVI SCORE
    # ========================================================

    if local_ndvi >= 0.6:

        ndvi_score = 1.0

    elif local_ndvi >= 0.3:

        ndvi_score = 0.75

    elif local_ndvi >= 0:

        ndvi_score = 0.5

    else:

        ndvi_score = 0.25


    print(
        "Local NDVI:",
        round(local_ndvi, 4)
    )

    print(
        "NDVI score:",
        round(ndvi_score, 3)
    )


    # ========================================================
    # CALCULATE CROP SCORES
    # ========================================================

    results = []


    for _, row in recommendation_df.iterrows():

        crop = row["crop_clean"]

        display_crop = row["display_crop"]

        yield_score = float(
            row["yield_score"]
        )


        # ----------------------------------------------------
        # Crop Calendar Score
        # ----------------------------------------------------

        planting_ok = month_in_range(
            month,
            row["planting_start_month"],
            row["planting_end_month"]
        )


        if planting_ok:

            calendar_score = 1.0

        elif pd.isna(
            row["planting_start_month"]
        ):

            calendar_score = 0.5

        else:

            calendar_score = 0.3


        # ----------------------------------------------------
        # Final Weighted Score
        # ----------------------------------------------------

        final_score = (

            0.40 * yield_score

            +

            0.25 * soil_score

            +

            0.20 * calendar_score

            +

            0.15 * ndvi_score
        )


        results.append({

            "crop": crop,

            "display_crop": display_crop,

            "yield_score": yield_score,

            "soil_score": soil_score,

            "calendar_score": calendar_score,

            "ndvi_score": ndvi_score,

            "recommendation_score": final_score,

            "average_yield": row[
                "average_yield"
            ],

            "records": row[
                "number_of_records"
            ],
        })


    # ========================================================
    # CREATE RESULT DATAFRAME
    # ========================================================

    result_df = pd.DataFrame(
        results
    )


    # ========================================================
    # REMOVE DUPLICATE CROPS
    # ========================================================

    result_df = (
        result_df
        .sort_values(
            "recommendation_score",
            ascending=False
        )
        .drop_duplicates(
            subset=["crop"]
        )
    )


    # ========================================================
    # TOP N
    # ========================================================

    result_df = result_df.head(
        top_n
    )


    return result_df


# ============================================================
# MAIN PROGRAM
# ============================================================

if __name__ == "__main__":

    print("\n" + "=" * 60)

    print(
        "       AGRO_AI - CROP RECOMMENDATION SYSTEM"
    )

    print("=" * 60)


    print("\nEnter farm information")


    try:

        latitude = float(
            input(
                "Enter latitude: "
            )
        )


        longitude = float(
            input(
                "Enter longitude: "
            )
        )


        month = int(
            input(
                "Enter current month (1-12): "
            )
        )


        if month < 1 or month > 12:

            raise ValueError(
                "Month must be between 1 and 12."
            )


        recommendations = recommend_crops(
            latitude,
            longitude,
            month,
            top_n=5
        )


        # ====================================================
        # FINAL OUTPUT
        # ====================================================

        print("\n" + "=" * 60)

        print(
            "TOP 5 CROP RECOMMENDATIONS"
        )

        print("=" * 60)


        for rank, (_, row) in enumerate(
            recommendations.iterrows(),
            start=1
        ):

            score = (
                row["recommendation_score"]
                * 100
            )


            print(
                f"\n{rank}. "
                f"{row['display_crop']}"
            )

            print(
                f"   Recommendation Score : "
                f"{score:.2f}%"
            )

            print(
                f"   Historical Yield      : "
                f"{row['average_yield']:.2f} hg/ha"
            )

            print(
                f"   Yield Score           : "
                f"{row['yield_score']:.2f}"
            )

            print(
                f"   Soil Score            : "
                f"{row['soil_score']:.2f}"
            )

            print(
                f"   Calendar Score        : "
                f"{row['calendar_score']:.2f}"
            )

            print(
                f"   NDVI Score            : "
                f"{row['ndvi_score']:.2f}"
            )


        print("\n" + "=" * 60)

        print(
            "Recommendation completed successfully!"
        )

        print("=" * 60)


    except ValueError as error:

        print(
            "\nInput Error:",
            error
        )


    except FileNotFoundError as error:

        print(
            "\nDataset file not found:"
        )

        print(error)


    except Exception as error:

        print(
            "\nUnexpected error:"
        )

        print(error)