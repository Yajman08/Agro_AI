from pathlib import Path
import pandas as pd
import re

# ============================================================
# AGRO_AI - DISEASE ADVISORY SYSTEM
# Uses the cleaned disease knowledge dataset
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

DISEASE_FILE = (
    BASE_DIR
    / "data"
    / "Processed"
    / "disease"
    / "disease_knowledge_dataset_cleaned.csv"
)


# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading disease knowledge dataset...")

try:
    disease_df = pd.read_csv(DISEASE_FILE)

except FileNotFoundError:
    print("\nDisease dataset not found!")
    print("Expected file:")
    print(DISEASE_FILE)
    raise SystemExit


print(
    "Disease dataset loaded:",
    disease_df.shape
)


# ============================================================
# CLEAN TEXT COLUMNS
# ============================================================

text_columns = [
    "crop",
    "disease",
    "pathogen_or_cause",
    "symptoms",
    "favorable_conditions",
    "prevention",
    "management",
    "organic_management",
    "chemical_management",
    "severity",
    "source",
    "source_url",
]

for column in text_columns:

    if column in disease_df.columns:

        disease_df[column] = (
            disease_df[column]
            .fillna("Information not available")
            .astype(str)
            .str.strip()
        )


# ============================================================
# NORMALIZE TEXT FOR SEARCH
# ============================================================

def normalize_text(text):

    text = str(text).lower().strip()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text


disease_df["crop_search"] = (
    disease_df["crop"]
    .apply(normalize_text)
)

disease_df["disease_search"] = (
    disease_df["disease"]
    .apply(normalize_text)
)


# ============================================================
# SHOW AVAILABLE CROPS
# ============================================================

def show_available_crops():

    crops = sorted(
        disease_df["crop"]
        .drop_duplicates()
        .tolist()
    )

    print("\nAvailable crops in disease dataset:")

    for crop in crops:

        print(
            f"- {crop}"
        )


# ============================================================
# FIND CROP
# ============================================================

def find_crop(user_crop):

    search_crop = normalize_text(
        user_crop
    )

    # Exact match
    exact = disease_df[
        disease_df["crop_search"]
        == search_crop
    ]

    if not exact.empty:
        return exact

    # Partial match
    partial = disease_df[
        disease_df["crop_search"]
        .str.contains(
            search_crop,
            na=False
        )
    ]

    return partial


# ============================================================
# FIND DISEASE
# ============================================================

def find_disease(
    crop_records,
    user_disease
):

    search_disease = normalize_text(
        user_disease
    )

    # Exact match
    exact = crop_records[
        crop_records["disease_search"]
        == search_disease
    ]

    if not exact.empty:
        return exact

    # Partial match
    partial = crop_records[
        crop_records["disease_search"]
        .str.contains(
            search_disease,
            na=False
        )
    ]

    return partial


# ============================================================
# DISPLAY DISEASE INFORMATION
# ============================================================

def display_disease_info(record):

    print("\n" + "=" * 70)
    print("              DISEASE INFORMATION")
    print("=" * 70)

    print(
        f"\nCrop       : {record['crop']}"
    )

    print(
        f"Disease    : {record['disease']}"
    )

    print(
        f"Severity   : {record['severity']}"
    )

    print(
        f"\nPathogen / Cause:"
    )

    print(
        record["pathogen_or_cause"]
    )

    print(
        f"\nSymptoms:"
    )

    print(
        record["symptoms"]
    )

    print(
        f"\nFavorable Conditions:"
    )

    print(
        record["favorable_conditions"]
    )

    print(
        "\n" + "-" * 70
    )

    print(
        "PREVENTION"
    )

    print(
        record["prevention"]
    )

    print(
        "\nMANAGEMENT"
    )

    print(
        record["management"]
    )

    print(
        "\nORGANIC MANAGEMENT"
    )

    print(
        record["organic_management"]
    )

    print(
        "\nCHEMICAL MANAGEMENT"
    )

    print(
        record["chemical_management"]
    )

    print(
        "\nSOURCE:"
    )

    print(
        record["source"]
    )

    print(
        "\nSOURCE URL:"
    )

    print(
        record["source_url"]
    )

    print(
        "\n" + "=" * 70
    )


# ============================================================
# SHOW DISEASES FOR A CROP
# ============================================================

def show_crop_diseases(crop_records):

    print(
        "\nDiseases available for this crop:"
    )

    diseases = (
        crop_records["disease"]
        .drop_duplicates()
        .tolist()
    )

    for index, disease in enumerate(
        diseases,
        start=1
    ):

        print(
            f"{index}. {disease}"
        )

    return diseases


# ============================================================
# MAIN PROGRAM
# ============================================================

if __name__ == "__main__":

    print("\n" + "=" * 70)

    print(
        "             AGRO_AI - DISEASE ADVISORY SYSTEM"
    )

    print("=" * 70)

    print(
        "\nThis system provides disease information "
        "and advisory using the cleaned disease dataset."
    )


    try:

        # ----------------------------------------------------
        # SHOW AVAILABLE CROPS
        # ----------------------------------------------------

        show_available_crops()


        # ----------------------------------------------------
        # GET CROP INPUT
        # ----------------------------------------------------

        print(
            "\nEnter crop name."
        )

        user_crop = input(
            "Crop: "
        ).strip()


        crop_records = find_crop(
            user_crop
        )


        if crop_records.empty:

            print(
                "\nCrop not found in the disease dataset."
            )

            print(
                "Please enter a crop from the available list."
            )

            raise SystemExit


        # ----------------------------------------------------
        # SHOW DISEASES
        # ----------------------------------------------------

        diseases = show_crop_diseases(
            crop_records
        )


        # ----------------------------------------------------
        # GET DISEASE INPUT
        # ----------------------------------------------------

        print(
            "\nEnter the disease name."
        )

        user_disease = input(
            "Disease: "
        ).strip()


        disease_records = find_disease(
            crop_records,
            user_disease
        )


        if disease_records.empty:

            print(
                "\nDisease not found for this crop."
            )

            print(
                "Please check the disease name "
                "from the list above."
            )

            raise SystemExit


        # ----------------------------------------------------
        # DISPLAY FIRST MATCH
        # ----------------------------------------------------

        record = disease_records.iloc[0]

        display_disease_info(
            record
        )


        print(
            "\nDisease advisory completed successfully!"
        )


    except KeyboardInterrupt:

        print(
            "\n\nProgram stopped by user."
        )


    except Exception as error:

        print(
            "\nUnexpected error:"
        )

        print(error)