import json
import math
import random
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ============================================================
# CONFIG
# ============================================================

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

MODEL_DIR = ROOT / "ml" / "disease"

MODEL_PATH = MODEL_DIR / "disease_model.keras"
CLASS_PATH = MODEL_DIR / "class_names.json"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

VALIDATION_RATIO = 0.20
SEED = 42

EPOCHS = 6


# ============================================================
# REPRODUCIBILITY
# ============================================================

random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)


# ============================================================
# CHECK DATASET
# ============================================================

if not DATA_DIR.exists():
    raise FileNotFoundError(
        f"Dataset not found:\n{DATA_DIR}"
    )


print("=" * 70)
print("AgriNexus AI - Disease Detection Training")
print("=" * 70)

print("\nTensorFlow:", tf.__version__)
print("Dataset:", DATA_DIR)


# ============================================================
# FIND CLASSES
# ============================================================

class_dirs = sorted(
    [
        p for p in DATA_DIR.iterdir()
        if p.is_dir()
    ]
)

class_names = [
    p.name for p in class_dirs
]

num_classes = len(class_names)

print("\nNumber of classes:", num_classes)

if num_classes != 38:
    print(
        "WARNING: Expected 38 classes, "
        f"but found {num_classes}."
    )


# ============================================================
# STRATIFIED TRAIN / VALIDATION SPLIT
# ============================================================

train_paths = []
train_labels = []

val_paths = []
val_labels = []

print("\nCreating stratified 80/20 split...")
print("-" * 70)

for class_index, class_dir in enumerate(class_dirs):

    image_files = [
        p for p in class_dir.iterdir()
        if p.is_file()
        and p.suffix.lower() in {
            ".jpg",
            ".jpeg",
            ".png"
        }
    ]

    random.shuffle(image_files)

    split_index = int(
        len(image_files)
        * (1 - VALIDATION_RATIO)
    )

    class_train = image_files[:split_index]
    class_val = image_files[split_index:]

    train_paths.extend(
        [str(p) for p in class_train]
    )

    train_labels.extend(
        [class_index] * len(class_train)
    )

    val_paths.extend(
        [str(p) for p in class_val]
    )

    val_labels.extend(
        [class_index] * len(class_val)
    )

    print(
        f"{class_index:02d} | "
        f"{len(image_files):5d} total | "
        f"{len(class_train):5d} train | "
        f"{len(class_val):5d} val | "
        f"{class_dir.name}"
    )


print("-" * 70)

print("\nTotal training images:", len(train_paths))
print("Total validation images:", len(val_paths))


# ============================================================
# SHUFFLE TRAINING DATA
# ============================================================

train_data = list(
    zip(train_paths, train_labels)
)

random.shuffle(train_data)

train_paths, train_labels = zip(
    *train_data
)

train_paths = list(train_paths)
train_labels = list(train_labels)


# ============================================================
# SAVE CLASS NAMES
# ============================================================

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)

with open(
    CLASS_PATH,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        class_names,
        f,
        indent=2,
        ensure_ascii=False
    )


# ============================================================
# TF DATA PIPELINE
# ============================================================

def load_image(path, label):

    image = tf.io.read_file(path)

    image = tf.io.decode_image(
        image,
        channels=3,
        expand_animations=False
    )

    image.set_shape(
        [None, None, 3]
    )

    image = tf.image.resize(
        image,
        IMG_SIZE
    )

    image = tf.cast(
        image,
        tf.float32
    )

    return image, label


train_ds = tf.data.Dataset.from_tensor_slices(
    (
        train_paths,
        train_labels
    )
)

train_ds = train_ds.shuffle(
    buffer_size=min(
        len(train_paths),
        10000
    ),
    seed=SEED
)

train_ds = train_ds.map(
    load_image,
    num_parallel_calls=tf.data.AUTOTUNE
)

train_ds = train_ds.batch(
    BATCH_SIZE
)

train_ds = train_ds.prefetch(
    tf.data.AUTOTUNE
)


val_ds = tf.data.Dataset.from_tensor_slices(
    (
        val_paths,
        val_labels
    )
)

val_ds = val_ds.map(
    load_image,
    num_parallel_calls=tf.data.AUTOTUNE
)

val_ds = val_ds.batch(
    BATCH_SIZE
)

val_ds = val_ds.prefetch(
    tf.data.AUTOTUNE
)


# ============================================================
# CLASS WEIGHTS
# ============================================================

class_counts = np.bincount(
    train_labels,
    minlength=num_classes
)

max_count = class_counts.max()

class_weights = {}

for i, count in enumerate(class_counts):

    # Square-root weighting prevents very large
    # weights for smaller classes.
    weight = math.sqrt(
        max_count / max(count, 1)
    )

    # Keep weights reasonable.
    weight = min(weight, 3.0)

    class_weights[i] = weight


print("\nClass weights:")
for i, weight in class_weights.items():

    print(
        f"{class_names[i]:55s} "
        f"{weight:.2f}"
    )


# ============================================================
# DATA AUGMENTATION
# ============================================================

augmentation = keras.Sequential(
    [
        layers.RandomFlip(
            "horizontal"
        ),

        layers.RandomRotation(
            0.08
        ),

        layers.RandomZoom(
            0.10
        ),

        layers.RandomTranslation(
            height_factor=0.05,
            width_factor=0.05
        ),

        layers.RandomContrast(
            0.10
        ),
    ],
    name="augmentation"
)


# ============================================================
# MOBILENETV2
# ============================================================

print("\nLoading MobileNetV2...")

base_model = MobileNetV2(
    input_shape=IMG_SIZE + (3,),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False


# ============================================================
# MODEL
# ============================================================

inputs = keras.Input(
    shape=IMG_SIZE + (3,)
)

x = augmentation(inputs)

x = preprocess_input(x)

x = base_model(
    x,
    training=False
)

x = layers.GlobalAveragePooling2D()(x)

x = layers.BatchNormalization()(x)

x = layers.Dropout(
    0.30
)(x)

outputs = layers.Dense(
    num_classes,
    activation="softmax"
)(x)

model = keras.Model(
    inputs,
    outputs
)


# ============================================================
# COMPILE
# ============================================================

model.compile(
    optimizer=keras.optimizers.Adam(
        learning_rate=1e-3
    ),

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]
)


# ============================================================
# MODEL SUMMARY
# ============================================================

model.summary()


# ============================================================
# CALLBACKS
# ============================================================

callbacks = [

    keras.callbacks.ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        mode="max",
        save_best_only=True,
        verbose=1
    ),

    keras.callbacks.EarlyStopping(
        monitor="val_accuracy",
        mode="max",
        patience=2,
        restore_best_weights=True,
        verbose=1
    )
]


# ============================================================
# TRAIN
# ============================================================

print("\n")
print("=" * 70)
print("STARTING TRAINING")
print("=" * 70)

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=callbacks
)


# ============================================================
# LOAD BEST MODEL
# ============================================================

print("\nLoading best checkpoint...")

best_model = keras.models.load_model(
    MODEL_PATH,
    compile=False
)


# ============================================================
# FINAL EVALUATION
# ============================================================

print("\nEvaluating model...")

best_model.compile(
    loss="sparse_categorical_crossentropy",
    metrics=[
        "accuracy"
    ]
)

loss, accuracy = best_model.evaluate(
    val_ds,
    verbose=1
)


print("\n")
print("=" * 70)
print("FINAL RESULT")
print("=" * 70)

print(
    f"Validation Accuracy: "
    f"{accuracy * 100:.2f}%"
)

print(
    f"Validation Loss: "
    f"{loss:.4f}"
)


# ============================================================
# SAVE WITHOUT OPTIMIZER
# ============================================================

best_model.save(
    MODEL_PATH,
    include_optimizer=False
)


print("\nModel saved:")
print(MODEL_PATH)

print("\nClass names saved:")
print(CLASS_PATH)

print("\nTRAINING COMPLETE")