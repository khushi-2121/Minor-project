import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || (process.env.NODE_ENV === 'production' ? null : 'http://localhost:8000');
const ML_TIMEOUT = 30000; // 30 seconds

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: ML_TIMEOUT,
});

/**
 * Send soil data to the ML service for fertility prediction.
 * @param {Object} soilData - Soil parameters
 * @returns {Object} Prediction result with fertilityLevel, confidence, etc.
 * @throws {Error} If ML service is unavailable or returns invalid data
 */
export const predictSoilFertility = async (soilData) => {
  try {
    if (!ML_SERVICE_URL) {
      throw new Error('ML_SERVICE_URL is not configured.');
    }

    // Prepare payload matching ML service schema
    const payload = {
      nitrogen: soilData.nitrogen,
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      ph: soilData.ph,
      moisture: soilData.moisture,
      organicCarbon: soilData.organicCarbon,
      electricalConductivity: soilData.electricalConductivity,
      soilType: soilData.soilType,
    };

    const response = await mlClient.post('/predict', payload);

    // Validate response structure
    if (!response.data || !response.data.success) {
      throw new Error('Invalid ML service response: success flag is false');
    }

    if (!response.data.prediction) {
      throw new Error('Invalid ML service response: missing prediction field');
    }

    const { prediction, model } = response.data;

    // Validate prediction fields
    if (!prediction.fertilityLevel) {
      throw new Error('ML service did not return a fertility level');
    }

    // Return structured prediction
    return {
      fertilityLevel: prediction.fertilityLevel,
      confidence: prediction.confidence || null,
      modelName: model?.name || 'Unknown',
      modelVersion: model?.version || 'Unknown',
      predictedAt: new Date(),
    };
  } catch (error) {
    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      throw new Error('ML service is not available. Please ensure the FastAPI service is running on ML_SERVICE_URL.');
    }

    if (error.code === 'ENOTFOUND') {
      throw new Error('ML service URL is invalid or unreachable.');
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error('ML service request timed out. The service may be overloaded or unresponsive.');
    }

    if (error.response?.status === 422) {
      throw new Error('Invalid soil data format sent to ML service.');
    }

    if (error.response?.status === 503) {
      const message = error.response?.data?.detail?.message || 'ML service temporarily unavailable (no model trained yet)';
      throw new Error(message);
    }

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }

    // Re-throw with context
    throw new Error(error.message || 'ML service prediction failed');
  }
};

/**
 * Check if the ML service is healthy and ready
 * @returns {boolean} True if the ML service is running
 */
export const checkMLServiceHealth = async () => {
  try {
    const response = await mlClient.get('/health');
    return response.data?.success === true;
  } catch (error) {
    return false;
  }
};
