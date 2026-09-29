import api from './api';

export const dashboardService = {
  async getDashboard() {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Unable to load your soil intelligence data.' };
    }
  },
};