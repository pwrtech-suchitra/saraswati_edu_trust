import axiosClient from './axiosClient';

export const donationApi = {
  /**
   * Create donation order on backend database
   * Initiates order on payment gateway adapter & creates pending record in DB
   */
  async createOrder(payload) {
    return await axiosClient.post('/donations/create-order', payload);
  },

  /**
   * Authoritative backend verification of payment signature
   * Stores payment transaction and generates 80G receipt in database
   */
  async verifyPayment(verificationData) {
    return await axiosClient.post('/donations/verify', verificationData);
  },

  /**
   * Get user's personal donation history from database
   */
  async getMyDonations() {
    return await axiosClient.get('/donations/my-donations');
  },

  /**
   * Get 80G receipt by donation ID or receipt number from database
   */
  async getReceipt(id) {
    return await axiosClient.get(`/donations/${id}/receipt`);
  }
};
