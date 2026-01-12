import apiClient from './client';

export const authAPI = {
  register: async (login, email, password) => {
    const response = await apiClient.post('/auth/register', {
      login,
      email,
      password,
    });
    return response.data;
  },

  login: async (login, password) => {
    const response = await apiClient.post('/auth/login', {
      login,
      password,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  },
};

