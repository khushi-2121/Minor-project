import api from './api';

export const reportService = {
  async getReports() {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load reports' };
    }
  },

  async getReportById(id) {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load report' };
    }
  },

  async downloadReport(id) {
    try {
      const response = await api.get(`/reports/${id}/pdf`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agrisense-report-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Unable to generate your report. Please try again.' };
    }
  },
};
