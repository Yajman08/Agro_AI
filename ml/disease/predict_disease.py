import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.utils import load_img, img_to_array


PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = PROJECT_ROOT / "ml" / "disease" / "disease_model.keras"
CLASS_NAMES_PATH = PROJECT_ROOT / "ml" / "disease" / "class_names.json"

IMAGE_SIZE = (224, 224)


# Load model
model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

# Load class names
with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
    class_names = json.load(f)


def predict_disease(image_path: str) -> dict:
    """
    Predict plant disease from a leaf image.
    """

    image = load_img(
        image_path,
        target_size=IMAGE_SIZE
    )

    image_array = img_to_array(image)

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    image_array = preprocess_input(
        image_array
    )

    predictions = model.predict(
        image_array,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(predictions)
    )

    confidence = float(
        predictions[predicted_index]
    )

    disease = class_names[predicted_index]

    return {
        "disease": disease,
        "confidencePct": round(
            confidence * 100,
            2
        ),
    }


if __name__ == "__main__":

    import sys

    if len(sys.argv) < 2:
        print(
            "Usage: python ml/disease/predict_disease.py <image_path>"
        )
        raise SystemExit(1)

    image_path = sys.argv[1]

    result = predict_disease(image_path)

    print("\nDisease Prediction")
    print("------------------")
    print(f"Disease: {result['disease']}")
    print(f"Confidence: {result['confidencePct']}%")