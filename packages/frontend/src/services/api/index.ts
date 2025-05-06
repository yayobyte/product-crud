import axios from 'axios';
import { getToken } from '../auth/authService';

// Get the API base URL from environment variables or use the default
const baseURL =
  import.meta.env.VITE_API_URL ||
  'https://backend-5t8eol3t9-yayobytes-projects.vercel.app';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle specific error status codes
    if (response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Pass the error to the calling code
    return Promise.reject(error);
  }
);

export default api;
