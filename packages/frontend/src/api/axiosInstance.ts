import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
      console.error(
        'Unauthorized request or token expired:',
        error.response.data
      );
      // Dispatch a custom event to be caught by a React component
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
