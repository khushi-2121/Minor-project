# AgriSense AI ML Service

## Objective

This service provides the machine learning foundation for AgriSense AI soil fertility prediction. The goal is to classify soil fertility into:

- Low Fertility
- Medium Fertility
- High Fertility

The ML service remains independent from the Node.js backend and is designed so future modules can consume prediction results for fertilizer recommendations, crop suggestions, soil improvement guidance, and a future farming assistant chatbot.

## Current status

Model training is pending dataset integration. No real agricultural dataset has been added to the project yet, so this phase prepares the full training pipeline, model architecture, and prediction contract for a real dataset to be supplied by the user.

## Dataset requirements

A real soil dataset is required before training is possible. The dataset must include at least the following columns:

- nitrogen
- phosphorus
- potassium
- ph
- moisture
- organicCarbon
- electricalConductivity
- soilType
- fertilityLevel

### Expected target variable

- fertilityLevel

Allowed values should be categorical labels such as:

- Low
- Medium
- High

### Dataset location

The project expects the dataset to be placed in a real data folder, such as:

- `ml-service/data/raw/`
- `ml-service/data/processed/`

## Required machine learning workflow

The service is structured around:

- data loading
- preprocessing
- training
- evaluation
- model persistence
- prediction API

This ensures the same preprocessing and feature engineering are used during both training and inference.

## Features used

- nitrogen
- phosphorus
- potassium
- ph
- moisture
- organicCarbon
- electricalConductivity
- soilType

## Preprocessing plan

The training pipeline will use a `ColumnTransformer` with:

- numeric pipeline for continuous numeric features
- one-hot encoding for categorical variable `soilType`
- missing-value handling
- optional scaling of numerical features where appropriate

The same preprocessing object will be reused during prediction so no logic is duplicated.

## Models evaluated

At minimum the pipeline will compare:

- Logistic Regression
- Decision Tree
- Random Forest
- Gradient Boosting

The model comparison is based on:

- accuracy
- precision
- recall
- F1-score
- confusion matrix
- classification report

When the dataset is imbalanced, macro-average metrics and balanced accuracy are also considered.

## Selected model

The selected model depends on the real dataset after evaluation. This project does not claim a trained model or metric values until training has been completed on a valid dataset.

## Model versioning

Saved model artifacts will reside in:

- `ml-service/model/trained_model.pkl`
- `ml-service/model/metadata.json`

Metadata includes:

- model name
- model version
- training date
- feature names
- target name
- evaluation metrics

## Training and evaluation commands

From the project root:

```bash
cd ml-service
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
python training/train.py
python training/evaluate.py
```

## Running the prediction service

```bash
cd ml-service
.venv\Scripts\activate    # Windows
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Then call:

```bash
curl http://localhost:8000/health
```

## Prediction API

### Request example

```json
{
  "nitrogen": 80,
  "phosphorus": 40,
  "potassium": 60,
  "ph": 6.5,
  "moisture": 40,
  "organicCarbon": 0.8,
  "electricalConductivity": 0.5,
  "soilType": "Loamy"
}
```

### Response example

```json
{
  "success": true,
  "prediction": {
    "fertilityLevel": "Medium",
    "confidence": 0.87
  },
  "model": {
    "name": "RandomForest",
    "version": "1.0"
  }
}
```

## Important rules

- No fake predictions
- No random confidence values
- No fabricated metrics
- No rule-based shortcuts replacing the trained model
- The main prediction system must use a real trained model from the saved artifact
- This phase is intentionally limited to the ML foundation and API contract

## Future architecture for chatbot context

The future chatbot will be able to consume structured outputs such as:

```json
{
  "soilAnalysis": {},
  "fertilityPrediction": {},
  "soilHealthScore": {},
  "nutrientStatus": {},
  "fertilizerRecommendation": {},
  "cropRecommendations": {},
  "improvementPlan": {}
}
```

This design keeps the prediction service modular for future reasoning features without creating the chatbot yet.

## Future explainability

For later phases, the project can use explainability methods such as:

- feature importance
- permutation importance
- SHAP

These will help explain why a specific fertility class was predicted.

## Dataset action required

A real soil fertility dataset must be added before model training can be completed. The dataset must include the required features and target variable listed above. Once the dataset is available, the training pipeline in `training/train.py` can be executed and the model can be saved in `model/`.
