import api from './api';

export const recommendationService = {
  /**
   * Get all recommendations
   */
  async getRecommendations() {
    try {
      const response = await api.get('/recommendations');
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to load recommendations',
        }
      );
    }
  },

  /**
   * Get fertilizer recommendations
   */
  async getFertilizerRecommendations() {
    try {
      const response = await api.get('/recommendations/fertilizer');
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to load fertilizer recommendations',
        }
      );
    }
  },

  /**
   * Get crop recommendations
   */
  async getCropRecommendations() {
    try {
      const response = await api.get('/recommendations/crops');
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to load crop recommendations',
        }
      );
    }
  },

  /**
   * Get soil improvement recommendations
   */
  async getSoilImprovementRecommendations() {
    try {
      const response = await api.get('/recommendations/soil-improvement');
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to load soil improvement recommendations',
        }
      );
    }
  },
};
