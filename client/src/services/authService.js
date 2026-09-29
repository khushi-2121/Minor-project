import api from './api.js';

export const authService = {
  async register(name, email, password, region = '') {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        region,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch user' };
    }
  },

  async getProfileSummary() {
    try {
      const response = await api.get('/auth/profile-summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load profile statistics' };
    }
  },

  async updateProfile(name, region = '') {
    try {
      const response = await api.put('/auth/profile', {
        name,
        region,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to change password' };
    }
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Logout failed' };
    }
  },
};
