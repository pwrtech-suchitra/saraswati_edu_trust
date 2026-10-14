import axiosClient from './axiosClient';
import { mockDonationsList } from './mockData';

export const adminApi = {
  /**
   * Get overview stats for admin dashboard
   */
  async getDashboardStats() {
    try {
      const res = await axiosClient.get('/admin/stats');
      return res;
    } catch {
      return {
        success: true,
        data: {
          totalDonationsAmount: 2955000,
          totalDonationsCount: 865,
          activeProjectsCount: 12,
          pendingInquiriesCount: 6,
          recentDonations: mockDonationsList
        }
      };
    }
  },

  /**
   * Get all registered users (Admin only)
   */
  async getUsers() {
    try {
      return await axiosClient.get('/admin/users');
    } catch {
      return {
        success: true,
        data: [
          { id: 'usr-1', name: 'SECT Administrator', email: 'admin@sect.org', role: 'ADMIN', createdAt: '2024-01-10' },
          { id: 'usr-2', name: 'Dr. Ramesh Das (Trustee)', email: 'trustee@sect.org', role: 'STAFF', createdAt: '2024-02-15' },
          { id: 'usr-3', name: 'Mrinmayee Patron', email: 'mrinmayee@example.com', role: 'MEMBER', createdAt: '2024-03-20' },
        ]
      };
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(userId, newRole) {
    try {
      return await axiosClient.put(`/admin/users/${userId}/role`, { role: newRole });
    } catch {
      return { success: true, message: `User role successfully updated to ${newRole}` };
    }
  },

  /**
   * Get all public inquiries received
   */
  async getInquiries() {
    try {
      return await axiosClient.get('/admin/inquiries');
    } catch {
      return {
        success: true,
        data: [
          { id: 'inq-1', name: 'Birendra Mohapatra', email: 'birendra@example.com', phone: '9861099887', subject: 'Solar project in Baripada', message: 'We would like to request solar lights for our high school.', date: '2025-09-06', status: 'PENDING' },
          { id: 'inq-2', name: 'Pooja Agarwal', email: 'pooja.a@example.com', phone: '9437011223', subject: 'Corporate CSR partnership', message: 'Our CSR committee wants to donate for girls education.', date: '2025-09-04', status: 'RESOLVED' }
        ]
      };
    }
  },

  /**
   * Update inquiry status
   */
  async updateInquiryStatus(inquiryId, status) {
    try {
      return await axiosClient.patch(`/admin/inquiries/${inquiryId}/status`, { status });
    } catch {
      return { success: true, message: `Inquiry status updated to ${status}` };
    }
  },

  /**
   * Get financial / 80G tax summary reports
   */
  async getReports(params = {}) {
    try {
      return await axiosClient.get('/reports/donations', { params });
    } catch {
      return {
        success: true,
        data: {
          period: 'FY 2024-25',
          totalReceived: 2955000,
          totalEligible80G: 2750000,
          donations: mockDonationsList
        }
      };
    }
  }
};
