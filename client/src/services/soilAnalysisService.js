import api from './api';

export const soilAnalysisService = {
  async submitAnalysis(payload) {
    try {
      const response = await api.post('/soil-analysis', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Soil analysis submission failed' };
    }
  },

  async getAnalyses() {
    try {
      const response = await api.get('/soil-analysis');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load soil analyses' };
    }
  },

  async getAnalysisById(id) {
    try {
      const response = await api.get(`/soil-analysis/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load soil analysis' };
    }
  },
};
