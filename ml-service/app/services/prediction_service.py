from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd

from app.schemas.soil_prediction import SoilPredictionInput


class PredictionService:
    def __init__(self) -> None:
        self.root_dir = Path(__file__).resolve().parents[2]
        self.model_path = self.root_dir / "model" / "trained_model.pkl"
        self.metadata_path = self.root_dir / "model" / "metadata.json"
        self.model = None

    def load_model(self):
        if self.model is not None:
            return self.model

        if not self.model_path.exists():
            raise FileNotFoundError(
                "No trained model artifact exists yet. Please add a real dataset and run training/train.py."
            )

        self.model = joblib.load(self.model_path)
        return self.model

    def predict(self, payload: SoilPredictionInput):
        model = self.load_model()

        feature_order = [
            "nitrogen",
            "phosphorus",
            "potassium",
            "ph",
            "moisture",
            "organicCarbon",
            "electricalConductivity",
            "soilType",
        ]

        row = payload.model_dump()
        frame = pd.DataFrame([row], columns=feature_order)

        prediction = model.predict(frame)[0]
        confidence = 1.0

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(frame)[0]
            confidence = float(max(probabilities))

        return {
            "fertilityLevel": str(prediction),
            "confidence": round(confidence, 4),
        }
