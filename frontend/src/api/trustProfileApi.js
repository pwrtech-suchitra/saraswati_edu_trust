import axiosClient from './axiosClient';

export const trustProfileApi = {
  /**
   * Get active SECT Trust profile and statutory coordinates
   */
  async getProfile() {
    return await axiosClient.get('/profile');
  },

  /**
   * Get the 4 core activity pillars and 27 mandates
   */
  async getActivityPillars() {
    return await axiosClient.get('/trust/activities');
  },

  /**
   * Get Mission Sustainable India details, 5Ps, and highlights
   */
  async getMissionSustainableIndia() {
    return await axiosClient.get('/trust/mission-sustainable-india');
  },

  /**
   * Admin: Update trust profile
   */
  async updateProfile(profileData) {
    return await axiosClient.put('/trust/profile', profileData);
  }
};
