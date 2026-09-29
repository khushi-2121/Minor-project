from fastapi import FastAPI, HTTPException

from app.schemas.soil_prediction import SoilPredictionInput
from app.services.prediction_service import PredictionService

app = FastAPI(title='AgriSense AI ML Service')
prediction_service = PredictionService()


@app.get('/health')
def health_check():
    return {
        'success': True,
        'message': 'AgriSense AI ML service is running',
        'modelReady': prediction_service.model_path.exists(),
    }


@app.post('/predict')
def predict_soil_fertility(payload: SoilPredictionInput):
    try:
        prediction = prediction_service.predict(payload)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                'success': False,
                'message': str(exc),
            },
        ) from exc

    return {
        'success': True,
        'prediction': prediction,
        'model': {
            'name': 'RandomForestClassifier',
            'version': '1.0.0',
        },
    }
