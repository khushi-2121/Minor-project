import api from './api';

const request = async (method, path, params) => {
  try {
    const response = await api.request({ method, url: path, params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Unable to load admin data.' };
  }
};

export const adminService = {
  getDashboard: () => request('get', '/admin/dashboard'),
  getUsers: (params) => request('get', '/admin/users', params),
  getUser: (id) => request('get', `/admin/users/${id}`),
  getAnalyses: (params) => request('get', '/admin/soil-analyses', params),
  getReports: () => request('get', '/admin/reports'),
  getAnalytics: () => request('get', '/admin/analytics'),
  getFertilizers: () => request('get', '/admin/fertilizers'),
  getCrops: () => request('get', '/admin/crops'),
  getSettings: () => request('get', '/admin/settings'),
};
