import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Login user or admin
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    return await axiosClient.post('/auth/login', credentials);
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await axiosClient.post('/auth/logout');
    } catch {
      // Clean up locally regardless
    } finally {
      localStorage.removeItem('sect_token');
      localStorage.removeItem('sect_user');
    }
  }
};
