import axios from 'axios';
import { authHelpers } from './authHelpers';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = authHelpers.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si 401 (non autorisé), supprimer le token et rediriger vers login
    if (error?.response?.status === 401) {
      authHelpers.removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    const message =
      error?.response?.data?.error ||
      error?.message ||
      'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
