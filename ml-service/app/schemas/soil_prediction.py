from typing import Literal

from pydantic import BaseModel, Field, field_validator


class SoilPredictionInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=500)
    phosphorus: float = Field(..., ge=0, le=500)
    potassium: float = Field(..., ge=0, le=500)
    ph: float = Field(..., ge=0, le=14)
    moisture: float = Field(..., ge=0, le=100)
    organicCarbon: float = Field(..., ge=0, le=10)
    electricalConductivity: float = Field(..., ge=0, le=10)
    soilType: str = Field(..., min_length=2, max_length=50)

    @field_validator("soilType")
    @classmethod
    def normalize_soil_type(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("soilType cannot be empty")
        return normalized.title()


class PredictionResult(BaseModel):
    fertilityLevel: Literal["Low", "Medium", "High"] | str
    confidence: float = Field(..., ge=0, le=1)
