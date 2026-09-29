import api from './api';

export const aiService = {
  async chat(message) {
    try {
      const response = await api.post('/ai/chat', { message });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'AI Assistant is currently unavailable.' };
    }
  },
};
