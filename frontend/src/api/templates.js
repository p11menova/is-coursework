import apiClient from './client';

export const templatesAPI = {
  getAllTemplates: async () => {
    const response = await apiClient.get('/templates');
    return response.data;
  },

  applyTemplate: async (templateId) => {
    // Применяем шаблон - подписываемся на все источники шаблона
    const templates = await templatesAPI.getAllTemplates();
    const template = templates.find(t => t.templateId === templateId);
    if (!template) {
      throw new Error('Шаблон не найден');
    }
    
    // Получаем все источники
    const { sourcesAPI } = await import('./sources');
    const sources = await sourcesAPI.getAllSources();
    
    // Подписываемся на все источники шаблона
    const sourceIds = sources
      .filter(s => template.sourceNames.includes(s.name))
      .map(s => s.sourceId);
    
    for (const sourceId of sourceIds) {
      try {
        await sourcesAPI.subscribeToSource(sourceId);
      } catch (e) {
        // Игнорируем ошибки, если уже подписан
      }
    }
    
    return { success: true };
  },
};

