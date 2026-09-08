import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Login user or admin
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      return response;
    } catch (error) {
      // Fallback demo credentials if backend is in active development
      if (error.isNetworkError || error.status === 404) {
        if (credentials.email === 'admin@sect.org' && credentials.password === 'admin123') {
          return {
            success: true,
            message: 'Admin demo login successful',
            data: {
              token: 'demo-admin-jwt-token',
              user: {
                id: 'usr-admin-01',
                name: 'SECT Administrator',
                email: 'admin@sect.org',
                role: 'ADMIN'
              }
            }
          };
        }
        if (credentials.email && credentials.password) {
          return {
            success: true,
            message: 'User demo login successful',
            data: {
              token: 'demo-user-jwt-token',
              user: {
                id: 'usr-donor-02',
                name: 'Mrinmayee Patron',
                email: credentials.email,
                role: 'MEMBER'
              }
            }
          };
        }
      }
      throw error;
    }
  },

  /**
   * Register new donor / member
   * @param {{ name: string, email: string, password: string, phone?: string }} data
   */
  async register(data) {
    try {
      const response = await axiosClient.post('/auth/register', data);
      return response;
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        return {
          success: true,
          message: 'Demo registration successful! Please login.',
          data: {
            user: {
              id: 'usr-' + Date.now(),
              name: data.name,
              email: data.email,
              role: 'MEMBER'
            }
          }
        };
      }
      throw error;
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile() {
    try {
      const response = await axiosClient.get('/auth/profile');
      return response;
    } catch (error) {
      const storedUser = localStorage.getItem('sect_user');
      if (storedUser) {
        return {
          success: true,
          data: JSON.parse(storedUser)
        };
      }
      throw error;
    }
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
