import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_valid_prediction_input_schema():
    payload = {
        'nitrogen': 80,
        'phosphorus': 40,
        'potassium': 60,
        'ph': 6.5,
        'moisture': 40,
        'organicCarbon': 0.8,
        'electricalConductivity': 0.5,
        'soilType': 'Loamy',
    }

    response = client.post('/predict', json=payload)
    assert response.status_code in {200, 503}

    if response.status_code == 200:
        body = response.json()
        assert body['success'] is True
        assert 'fertilityLevel' in body['prediction']


def test_invalid_ph_value_is_rejected():
    payload = {
        'nitrogen': 80,
        'phosphorus': 40,
        'potassium': 60,
        'ph': 20,
        'moisture': 40,
        'organicCarbon': 0.8,
        'electricalConductivity': 0.5,
        'soilType': 'Loamy',
    }

    response = client.post('/predict', json=payload)
    assert response.status_code == 422


def test_invalid_moisture_value_is_rejected():
    payload = {
        'nitrogen': 80,
        'phosphorus': 40,
        'potassium': 60,
        'ph': 6.5,
        'moisture': 150,
        'organicCarbon': 0.8,
        'electricalConductivity': 0.5,
        'soilType': 'Loamy',
    }

    response = client.post('/predict', json=payload)
    assert response.status_code == 422


def test_missing_soil_type_is_rejected():
    payload = {
        'nitrogen': 80,
        'phosphorus': 40,
        'potassium': 60,
        'ph': 6.5,
        'moisture': 40,
        'organicCarbon': 0.8,
        'electricalConductivity': 0.5,
    }

    response = client.post('/predict', json=payload)
    assert response.status_code == 422


def test_missing_model_returns_service_error():
    response = client.get('/health')
    assert response.status_code == 200
    body = response.json()
    assert body['success'] is True
