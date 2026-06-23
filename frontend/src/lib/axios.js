import axios from 'axios';
import { useAuthStore } from '../features/auth/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Get token directly from localStorage if Zustand persist is used
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth-storage", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;