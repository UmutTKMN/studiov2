import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/profile'), // profile endpoint'ini kullan
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default authService;
