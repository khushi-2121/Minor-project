from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "raw"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def generate_dataset(rows: int = 2500) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    soil_types = ["Loamy", "Clay", "Sandy", "Silty", "Black", "Red"]
    fertility_levels = ["Low", "Medium", "High"]

    records: list[dict[str, float | str]] = []

    for _ in range(rows):
        soil_type = rng.choice(soil_types)
        fertility = rng.choice(fertility_levels, p=[0.28, 0.42, 0.30])

        if fertility == "Low":
            nitrogen = rng.normal(26, 11)
            phosphorus = rng.normal(18, 8)
            potassium = rng.normal(21, 10)
            ph = rng.normal(5.1, 0.7)
            moisture = rng.normal(30, 10)
            organic_carbon = rng.normal(0.52, 0.24)
            ec = rng.normal(0.42, 0.18)
        elif fertility == "Medium":
            nitrogen = rng.normal(52, 16)
            phosphorus = rng.normal(33, 11)
            potassium = rng.normal(44, 12)
            ph = rng.normal(6.4, 0.8)
            moisture = rng.normal(46, 12)
            organic_carbon = rng.normal(0.95, 0.3)
            ec = rng.normal(0.82, 0.22)
        else:
            nitrogen = rng.normal(83, 20)
            phosphorus = rng.normal(54, 14)
            potassium = rng.normal(68, 16)
            ph = rng.normal(6.9, 0.9)
            moisture = rng.normal(62, 13)
            organic_carbon = rng.normal(1.7, 0.42)
            ec = rng.normal(1.25, 0.28)

        if soil_type == "Sandy":
            moisture *= 0.9
            organic_carbon *= 0.8
            nitrogen *= 0.86
        elif soil_type == "Clay":
            moisture *= 1.12
            organic_carbon *= 1.14
            nitrogen *= 0.96
        elif soil_type == "Black":
            organic_carbon *= 1.2
            potassium *= 1.1
        elif soil_type == "Red":
            ph *= 0.96
            phosphorus *= 1.06

        records.append(
            {
                "nitrogen": float(np.clip(nitrogen, 0, 200)),
                "phosphorus": float(np.clip(phosphorus, 0, 120)),
                "potassium": float(np.clip(potassium, 0, 180)),
                "ph": float(np.clip(ph, 3.5, 9.5)),
                "moisture": float(np.clip(moisture, 5, 90)),
                "organicCarbon": float(np.clip(organic_carbon, 0.1, 3.5)),
                "electricalConductivity": float(np.clip(ec, 0.1, 2.5)),
                "soilType": soil_type,
                "fertilityLevel": fertility,
            }
        )

    df = pd.DataFrame(records)
    return df[
        [
            "nitrogen",
            "phosphorus",
            "potassium",
            "ph",
            "moisture",
            "organicCarbon",
            "electricalConductivity",
            "soilType",
            "fertilityLevel",
        ]
    ]


if __name__ == "__main__":
    dataset = generate_dataset()
    output_path = DATA_DIR / "soil_fertility_dataset.csv"
    dataset.to_csv(output_path, index=False)
    print(f"Generated dataset with {len(dataset)} rows at {output_path}")
    print(dataset["fertilityLevel"].value_counts().to_dict())
