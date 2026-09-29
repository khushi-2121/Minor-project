from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
MODEL_DIR = ROOT / "model"
MODEL_DIR.mkdir(exist_ok=True)


FEATURE_COLUMNS = [
    "nitrogen",
    "phosphorus",
    "potassium",
    "ph",
    "moisture",
    "organicCarbon",
    "electricalConductivity",
    "soilType",
]
TARGET_COLUMN = "fertilityLevel"


def load_dataset():
    csv_path = DATA_DIR / "raw" / "soil_fertility_dataset.csv"
    if not csv_path.exists():
        raise FileNotFoundError(
            "No dataset found at ml-service/data/raw/soil_fertility_dataset.csv. "
            "Add a real soil fertility dataset before training."
        )

    frame = pd.read_csv(csv_path)
    required = FEATURE_COLUMNS + [TARGET_COLUMN]
    missing = [column for column in required if column not in frame.columns]
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")

    return frame


def build_pipeline():
    numeric_features = [
        "nitrogen",
        "phosphorus",
        "potassium",
        "ph",
        "moisture",
        "organicCarbon",
        "electricalConductivity",
    ]
    categorical_features = ["soilType"]

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", numeric_transformer, numeric_features),
            ("categorical", categorical_transformer, categorical_features),
        ]
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced",
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )


def train_and_save():
    frame = load_dataset()
    X = frame[FEATURE_COLUMNS]
    y = frame[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model_pipeline = build_pipeline()
    model_pipeline.fit(X_train, y_train)

    predictions = model_pipeline.predict(X_test)
    metrics = {
        "accuracy": accuracy_score(y_test, predictions),
        "precision": precision_score(y_test, predictions, average="macro", zero_division=0),
        "recall": recall_score(y_test, predictions, average="macro", zero_division=0),
        "f1": f1_score(y_test, predictions, average="macro", zero_division=0),
        "confusion_matrix": confusion_matrix(y_test, predictions).tolist(),
        "classification_report": classification_report(y_test, predictions, output_dict=True),
    }

    model_path = MODEL_DIR / "trained_model.pkl"
    metadata_path = MODEL_DIR / "metadata.json"
    joblib.dump(model_pipeline, model_path)

    metadata = {
        "model_name": "RandomForestClassifier",
        "model_version": "1.0.0",
        "training_date": datetime.now(timezone.utc).isoformat(),
        "feature_columns": FEATURE_COLUMNS,
        "target_column": TARGET_COLUMN,
        "metrics": metrics,
    }

    with metadata_path.open("w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=2)

    return model_pipeline, metadata


if __name__ == "__main__":
    train_and_save()
    print("Training complete. Model saved to ml-service/model/trained_model.pkl")
