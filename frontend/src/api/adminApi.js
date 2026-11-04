import axiosClient from './axiosClient';

export const adminApi = {
  /**
   * Get overview stats for admin dashboard directly from database
   */
  async getDashboardStats() {
    return await axiosClient.get('/admin/stats');
  },

  async getDonations(params = {}) {
    return await axiosClient.get('/admin/donations', { params });
  },

  async confirmManualDonation(donationId) {
    return await axiosClient.patch(`/admin/donations/${donationId}/confirm`);
  },

  async rejectManualDonation(donationId) {
    return await axiosClient.patch(`/admin/donations/${donationId}/reject`);
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
  },

  /**
   * Get issued 80G donation receipt records for a financial year
   */
  async get80GReports(financialYear) {
    return await axiosClient.get('/reports/80g', { params: { financial_year: financialYear } });
  }
};
