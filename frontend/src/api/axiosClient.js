import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Access Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sect_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Error unwrapping & 401 handling
axiosClient.interceptors.response.use(
  (response) => {
    // Return standard backend data envelope
    return response.data;
  },
  (error) => {
    // Check for 401 Unauthorized (Expired / Invalid token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sect_token');
      localStorage.removeItem('sect_user');
      window.dispatchEvent(new Event('sect_auth_expired'));
    }

    // Standardize error message according to Section 12 API Contract
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    customError.errors = error.response?.data?.errors || [];
    customError.isNetworkError = !error.response;

    return Promise.reject(customError);
  }
);

export default axiosClient;
