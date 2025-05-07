import axios from 'axios';

// Use environment variable for API base URL, fallback to localhost for development
// Make sure to set VITE_API_BASE_URL in your Vercel deployment environment for the frontend.
// Example: VITE_API_BASE_URL=https://your-backend-service.vercel.app/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: To attach JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Optional, for global error handling or token refresh logic
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      // window.location.href = '/login';
      console.error(
        'Unauthorized request or token expired:',
        error.response.data
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
