import axiosClient from './axiosClient';

export const adminApi = {
  /**
   * Get overview stats for admin dashboard directly from database
   */
  async getDashboardStats() {
    return await axiosClient.get('/admin/stats');
  },

  /**
   * Get all registered users directly from database (Admin only)
   */
  async getUsers(params = {}) {
    return await axiosClient.get('/admin/users', { params });
  },

  /**
   * Update user role in database
   */
  async updateUserRole(userId, newRole) {
    return await axiosClient.put(`/admin/users/${userId}/role`, { role: newRole });
  },

  /**
   * Get all public inquiries received from database
   */
  async getInquiries(params = {}) {
    return await axiosClient.get('/admin/inquiries', { params });
  },

  /**
   * Update inquiry status in database
   */
  async updateInquiryStatus(inquiryId, statusData) {
    return await axiosClient.put(`/admin/inquiries/${inquiryId}/status`, statusData);
  },

  /**
   * Get financial / 80G tax summary reports from database
   */
  async getReports(params = {}) {
    return await axiosClient.get('/reports/donations', { params });
  }
};
