import axios from 'axios';
import { useStore } from '@/store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    useStore.getState().setIsLoading(true);
    return config;
  },
  (error) => {
    useStore.getState().setIsLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    useStore.getState().setIsLoading(false);
    return response;
  },
  (error) => {
    useStore.getState().setIsLoading(false);
    useStore.getState().setError(error.response?.data?.message || 'An error occurred');
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api; 