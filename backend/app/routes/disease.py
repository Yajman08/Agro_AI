from pathlib import Path
import sys
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile

# ---------------------------------------------------------
# Project root
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[3]

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.disease.predict_disease import predict_disease


router = APIRouter(
    prefix="/api",
    tags=["Disease Detection"]
)


# ---------------------------------------------------------
# Disease detection
# ---------------------------------------------------------

@router.post("/disease-detection")
async def disease_detection(
    image: UploadFile = File(...)
):
    """
    Detect plant disease from an uploaded leaf image.
    """

    # Validate file type
    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, JPEG, PNG, or WEBP image."
        )

    try:
        # Read uploaded image
        image_bytes = await image.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )

        # Create temporary image
        suffix = Path(image.filename or "image.jpg").suffix

        if suffix.lower() not in {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }:
            suffix = ".jpg"

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_file.write(image_bytes)
            temp_path = temp_file.name

        # Run ML model
        prediction = predict_disease(temp_path)

        # Delete temporary image
        Path(temp_path).unlink(missing_ok=True)

        disease_name = prediction["disease"]
        confidence = prediction["confidencePct"]

        # Convert PlantVillage class name
        display_disease = (
            disease_name
            .replace("___", " - ")
            .replace("_", " ")
        )

        # Healthy prediction
        is_healthy = (
            disease_name.lower().endswith("healthy")
        )

        if is_healthy:
            observed = [
                "No disease pattern detected by the image classifier."
            ]

            actions = [
                "Continue regular crop monitoring.",
                "Maintain proper irrigation and nutrition.",
            ]

            prevention = [
                "Inspect leaves regularly.",
                "Maintain good field hygiene.",
                "Avoid excessive moisture on leaves.",
            ]

        else:
            observed = [
                f"Image classifier detected {display_disease}."
            ]

            actions = [
                "Inspect nearby plants for similar symptoms.",
                "Remove severely affected leaves if appropriate.",
                "Follow crop-specific disease management practices.",
            ]

            prevention = [
                "Monitor surrounding plants regularly.",
                "Maintain field sanitation.",
                "Avoid conditions that encourage disease spread.",
            ]

        return {
            "disease": None if is_healthy else display_disease,
            "confidencePct": confidence,
            "observed": observed,
            "actions": actions,
            "prevention": prevention,
            "isHealthy": is_healthy,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Disease detection failed: {str(exc)}"
        )