import apiClient from './client';

export const newsAPI = {
  getNews: async (page = 0, size = 20) => {
    const response = await apiClient.get('/news', {
      params: { page, size },
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/news/categories');
    return response.data;
  },

  getNewsByCategory: async (categoryName, page = 0, size = 20) => {
    const response = await apiClient.get(`/news/category/${categoryName}`, {
      params: { page, size },
    });
    return response.data;
  },

  markAsRead: async (newsId) => {
    const response = await apiClient.post(`/news/${newsId}/read`);
    return response.data;
  },
};

