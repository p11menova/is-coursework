import apiClient from './client';

export const sourcesAPI = {
  getAllSources: async () => {
    const response = await apiClient.get('/sources');
    return response.data;
  },

  subscribeToSource: async (sourceId) => {
    const response = await apiClient.post(`/sources/${sourceId}/subscribe`);
    return response.data;
  },

  unsubscribeFromSource: async (sourceId) => {
    const response = await apiClient.delete(`/sources/${sourceId}/subscribe`);
    return response.data;
  },
};

