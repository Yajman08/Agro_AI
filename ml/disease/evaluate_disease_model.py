import json
from pathlib import Path

import numpy as np
import tensorflow as tf


ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = (
    ROOT
    / "data"
    / "india"
    / "disease"
    / "PlantVillage-Dataset"
    / "raw"
    / "color"
)

MODEL_PATH = ROOT / "ml" / "disease" / "disease_model.keras"
CLASS_PATH = ROOT / "ml" / "disease" / "class_names.json"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32


print("Loading model...")

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

with open(CLASS_PATH, "r", encoding="utf-8") as f:
    class_names = json.load(f)


print(f"Classes: {len(class_names)}")


# Same validation split used during training
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.20,
    subset="validation",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=False,
)


# ---------------------------------------------------------
# Evaluate
# ---------------------------------------------------------

correct = 0
total = 0

class_total = np.zeros(len(class_names), dtype=int)
class_correct = np.zeros(len(class_names), dtype=int)

confusion = np.zeros(
    (len(class_names), len(class_names)),
    dtype=int
)


for images, labels in val_ds:

    predictions = model.predict(
        images,
        verbose=0
    )

    predicted_labels = np.argmax(
        predictions,
        axis=1
    )

    labels_np = labels.numpy()

    for actual, predicted in zip(
        labels_np,
        predicted_labels
    ):

        actual = int(actual)
        predicted = int(predicted)

        total += 1

        class_total[actual] += 1

        confusion[actual][predicted] += 1

        if actual == predicted:
            correct += 1
            class_correct[actual] += 1


# ---------------------------------------------------------
# Results
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("OVERALL VALIDATION")
print("=" * 70)

print(f"Total images: {total}")
print(f"Correct:      {correct}")
print(f"Accuracy:     {correct / total * 100:.2f}%")


print("\n" + "=" * 70)
print("PER-CLASS ACCURACY")
print("=" * 70)

for i, name in enumerate(class_names):

    if class_total[i] > 0:
        accuracy = (
            class_correct[i]
            / class_total[i]
            * 100
        )
    else:
        accuracy = 0

    print(
        f"{i:02d} | "
        f"{accuracy:6.2f}% | "
        f"{class_correct[i]:4d}/{class_total[i]:4d} | "
        f"{name}"
    )


# ---------------------------------------------------------
# Most common predictions
# ---------------------------------------------------------

predicted_counts = confusion.sum(axis=0)

print("\n" + "=" * 70)
print("MOST PREDICTED CLASSES")
print("=" * 70)

top_indices = np.argsort(
    predicted_counts
)[::-1][:10]

for i in top_indices:

    print(
        f"{predicted_counts[i]:5d} predictions -> "
        f"{class_names[i]}"
    )


# ---------------------------------------------------------
# Confusion examples
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("MOST CONFUSED CLASSES")
print("=" * 70)

pairs = []

for actual in range(len(class_names)):

    for predicted in range(len(class_names)):

        if actual != predicted:

            count = confusion[actual][predicted]

            if count > 0:

                pairs.append(
                    (
                        count,
                        class_names[actual],
                        class_names[predicted]
                    )
                )


pairs.sort(reverse=True)

for count, actual, predicted in pairs[:20]:

    print(
        f"{count:4d} | "
        f"{actual} -> {predicted}"
    )