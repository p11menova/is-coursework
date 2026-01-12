import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { sourcesAPI } from '../api/sources';
import { templatesAPI } from '../api/templates';
import './SourcesPage.css';

interface Source {
  sourceId: number;
  name: string;
  url: string;
  categoryName: string;
  isSubscribed: boolean;
}

interface Template {
  templateId: number;
  name: string;
  description?: string;
  categoryName?: string;
  sourceNames: string[];
}

// Удалено - используется API
/*const mockSources: Source[] = [
  { 
    id: 1, 
    name: "Хабр", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 24L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2Z" fill="#667eea"/>
        <path d="M9 11L7 13L9 15L11 13L9 11Z" fill="white"/>
        <path d="M15 11L13 13L15 15L17 13L15 11Z" fill="white"/>
        <path d="M12 8L10 10L12 12L14 10L12 8Z" fill="white"/>
        <path d="M12 14L10 16L12 18L14 16L12 14Z" fill="white"/>
      </svg>
    )
  },
  { 
    id: 2, 
    name: "Лента", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="2" fill="#667eea"/>
        <rect x="3" y="8" width="18" height="2" fill="#764ba2"/>
        <rect x="3" y="12" width="18" height="2" fill="#667eea"/>
        <rect x="3" y="16" width="18" height="2" fill="#764ba2"/>
        <rect x="3" y="20" width="12" height="2" fill="#667eea"/>
      </svg>
    )
  },
  { 
    id: 3, 
    name: "РИА Новости", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#667eea"/>
        <path d="M12 6V12L16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2" fill="white"/>
      </svg>
    )
  },
  { 
    id: 4, 
    name: "BBC", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#667eea"/>
        <rect x="4" y="6" width="16" height="12" rx="1" fill="white"/>
        <rect x="6" y="8" width="12" height="8" fill="#764ba2"/>
        <path d="M8 10H16V14H8V10Z" fill="white"/>
        <circle cx="10" cy="12" r="1" fill="#667eea"/>
        <circle cx="14" cy="12" r="1" fill="#667eea"/>
      </svg>
    )
  },
  { 
    id: 5, 
    name: "Дром", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 11L19 11L16 8M19 11L16 14" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="16" r="4" fill="#764ba2"/>
        <circle cx="8" cy="16" r="2" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="#764ba2"/>
        <circle cx="16" cy="16" r="2" fill="white"/>
      </svg>
    )
  },
  { 
    id: 6, 
    name: "Колеса", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#667eea"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
        <circle cx="12" cy="12" r="2" fill="#764ba2"/>
        <path d="M12 4V6M12 18V20M4 12H6M18 12H20" stroke="#667eea" strokeWidth="2"/>
      </svg>
    )
  }
];

const mockTemplates: Template[] = [
  {
    id: 1,
    name: "Айти",
    sources: ["Хабр"],
    color: "#2D5016"
  },
  {
    id: 2,
    name: "Политика",
    sources: ["Лента", "РИА Новости", "BBC"],
    color: "#1E3A8A"
  },
  {
    id: 3,
    name: "Автолюбители",
    sources: ["Дром", "Колеса"],
    color: "#C8553D"
  }
];

const availableSources = [
  "Meduza",
  "Forbes Russia",
  "Российская газета",
  "Известия",
  "Московский комсомолец",
  "Коммерсантъ",
  "Ведомости",
  "ТАСС",
  "Интерфакс",
  "Lenta.ru"
];

const templateSources = [
  "Хабр",
  "Лента",
  "РИА Новости",
  "BBC",
  "Дром",
  "Колеса",
  "РБК",
  "Коммерсантъ", 
  "Ведомости",
  "ТАСС",
  "Интерфакс",
  "Lenta.ru",
  "Meduza",
  "Forbes Russia",
  "Российская газета",
  "Известия",
  "Московский комсомолец"
];

const predefinedTemplates = [
  { 
    name: "Айти", 
    color: "#2D5016",
    sources: ["Хабр"]
  },
  { 
    name: "Политика", 
    color: "#1E3A8A",
    sources: ["Лента", "РИА Новости", "BBC"]
  },
  { 
    name: "Автолюбители", 
    color: "#C8553D",
    sources: ["Дром", "Колеса"]
  },
  { 
    name: "Бизнес", 
    color: "#8B4513",
    sources: ["РБК", "Коммерсантъ", "Ведомости"]
  },
  { 
    name: "Наука", 
    color: "#4B0082",
    sources: ["РИА Новости", "Lenta.ru", "Meduza"]
  },
  { 
    name: "Спорт", 
    color: "#2F4F4F",
    sources: ["Российская газета", "Известия", "Московский комсомолец"]
  },
  { 
    name: "Культура", 
    color: "#8B0000",
    sources: ["Известия", "Московский комсомолец", "ТАСС"]
  },
  { 
    name: "Технологии", 
    color: "#F1C40F",
    sources: ["Хабр", "Lenta.ru", "Meduza"]
  }
];

/*const getTemplateIcon = (templateName: string) => {
  switch(templateName) {
    case "Айти":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#667eea"/>
          <path d="M8 8H16M8 12H16M8 16H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "Политика":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V12C3 16.5 5.23 20.68 8.62 23.15L12 24L15.38 23.15C18.77 20.68 21 16.5 21 12V7L12 2Z" fill="#1E3A8A"/>
          <path d="M9 11L7 13L9 15L11 13L9 11Z" fill="white"/>
          <path d="M15 11L13 13L15 15L17 13L15 11Z" fill="white"/>
        </svg>
      );
    case "Автолюбители":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 11L19 11L16 8M19 11L16 14" stroke="#C8553D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8" cy="16" r="4" fill="#C8553D"/>
          <circle cx="8" cy="16" r="2" fill="white"/>
          <circle cx="16" cy="16" r="4" fill="#C8553D"/>
          <circle cx="16" cy="16" r="2" fill="white"/>
        </svg>
      );
    case "Бизнес":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#8B4513"/>
          <path d="M8 8H16M8 12H16M8 16H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "Наука":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#4B0082"/>
          <path d="M12 6V12L16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
      );
    case "Спорт":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#2F4F4F"/>
          <path d="M12 6V12L16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
      );
    case "Культура":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V12C3 16.5 5.23 20.68 8.62 23.15L12 24L15.38 23.15C18.77 20.68 21 16.5 21 12V7L12 2Z" fill="#8B0000"/>
          <path d="M9 9L9 15M12 9L12 15M15 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "Технологии":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#F1C40F"/>
          <path d="M8 8H16M8 12H16M8 16H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="8" r="2" fill="white"/>
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#667eea"/>
          <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
  }
};*/

const getSourceColor = (sourceName: string): string => {
  const colors: { [key: string]: string } = {
    "Хабр": "#65A3D9",
    "Лента": "#F35C25",
    "РИА Новости": "#1E50A2",
    "BBC": "#B9001D",
    "Дром": "#FF6B00",
    "Колеса": "#0066CC",
    "РБК": "#E53935",
    "Коммерсантъ": "#1B3F8B",
    "Ведомости": "#00A651",
    "ТАСС": "#0039A6",
    "Интерфакс": "#0055A4",
    "Lenta.ru": "#F35C25",
    "Meduza": "#FF6600",
    "Forbes Russia": "#0078D4",
    "Российская газета": "#C41230",
    "Известия": "#003D7A",
    "Московский комсомолец": "#ED1C24"
  };
  
  return colors[sourceName] || "#667eea";
};

const SourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<Source[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sourcesData, templatesData] = await Promise.all([
          sourcesAPI.getAllSources(),
          templatesAPI.getAllTemplates()
        ]);
        setSources(sourcesData);
        setTemplates(templatesData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleToggleSource = async (sourceId: number, isSubscribed: boolean) => {
    try {
      if (isSubscribed) {
        await sourcesAPI.unsubscribeFromSource(sourceId);
      } else {
        await sourcesAPI.subscribeToSource(sourceId);
      }
      // Обновляем список источников
      const data = await sourcesAPI.getAllSources();
      setSources(data);
      // Обновляем главную страницу через событие - с небольшой задержкой для гарантии
      setTimeout(() => {
        window.dispatchEvent(new Event('sourcesUpdated'));
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка изменения подписки');
    }
  };

  const handleApplyTemplate = async (templateId: number) => {
    try {
      await templatesAPI.applyTemplate(templateId);
      // Обновляем список источников
      const data = await sourcesAPI.getAllSources();
      setSources(data);
      // Обновляем главную страницу через событие - с небольшой задержкой для гарантии
      setTimeout(() => {
        window.dispatchEvent(new Event('sourcesUpdated'));
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка применения шаблона');
    }
  };

  const subscribedSources = sources.filter(s => s.isSubscribed);
  const availableSources = sources.filter(s => !s.isSubscribed);
  
  // Проверяем, какие шаблоны применены (все источники шаблона подписаны)
  const getTemplateStatus = (template: Template): 'applied' | 'partial' | 'none' => {
    const templateSourceNames = new Set(template.sourceNames);
    const subscribedSourceNames = new Set(subscribedSources.map(s => s.name));
    
    const subscribedCount = template.sourceNames.filter(name => subscribedSourceNames.has(name)).length;
    
    if (subscribedCount === 0) return 'none';
    if (subscribedCount === template.sourceNames.length) return 'applied';
    return 'partial';
  };

  return (
    <div className="sources-page">
      <Header />
      <div className="sources-content">
        <div className="back-button">
          <button onClick={handleBackToMain} className="back-link">
            Вернуться на главную страницу
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Sources Section */}
        <div className="sources-section">
          <div className="section-header">
            <h1 className="section-title">Ваши источники</h1>
          </div>

          {loading ? (
            <div className="loading">Загрузка источников...</div>
          ) : (
            <>
              <div className="sources-list">
                {subscribedSources.map((source) => (
                  <div key={source.sourceId} className="source-item">
                    <div className="source-info">
                      <span className="source-name" style={{ color: getSourceColor(source.name) }}>{source.name}</span>
                      <span className="source-category">{source.categoryName}</span>
                    </div>
                    <button 
                      className="delete-button"
                      onClick={() => handleToggleSource(source.sourceId, true)}
                      title="Отписаться"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6L14 14M6 14L14 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="section-header">
                <h2 className="section-title">Шаблоны источников</h2>
                <p style={{ color: '#4A5568', fontSize: '16px', marginTop: '10px' }}>
                  Выберите готовый набор источников для быстрой настройки
                </p>
              </div>

              <div className="templates-list">
                {templates.map((template) => {
                  const status = getTemplateStatus(template);
                  const isApplied = status === 'applied';
                  const isPartial = status === 'partial';
                  
                  return (
                    <div 
                      key={template.templateId} 
                      className={`template-item ${isApplied ? 'template-applied' : ''} ${isPartial ? 'template-partial' : ''}`}
                    >
                      <div className="template-info">
                        <div className="template-header">
                          <span className="template-name">{template.name}</span>
                          {isApplied && (
                            <span className="template-badge" style={{ 
                              marginLeft: '10px',
                              padding: '4px 8px',
                              backgroundColor: '#48BB78',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              ✓ Применен
                            </span>
                          )}
                          {isPartial && (
                            <span className="template-badge" style={{ 
                              marginLeft: '10px',
                              padding: '4px 8px',
                              backgroundColor: '#ED8936',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              Частично
                            </span>
                          )}
                        </div>
                        {template.description && (
                          <div style={{ fontSize: '14px', color: '#4A5568', marginBottom: '8px' }}>
                            {template.description}
                          </div>
                        )}
                        <div className="template-sources">
                          <strong>Источники:</strong> {template.sourceNames.join(', ')}
                        </div>
                      </div>
                      <button 
                        className={`add-button ${isApplied ? 'applied-button' : ''}`}
                        onClick={() => handleApplyTemplate(template.templateId)}
                        title={isApplied ? "Шаблон уже применен" : "Применить шаблон"}
                        disabled={isApplied}
                      >
                        {isApplied ? '✓' : '✓'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="section-header" style={{ marginTop: '40px' }}>
                <h2 className="section-title">Доступные источники</h2>
                <p style={{ color: '#4A5568', fontSize: '16px', marginTop: '10px' }}>
                  Или выберите источники по отдельности
                </p>
              </div>

              <div className="sources-list">
                {availableSources.map((source) => (
                  <div key={source.sourceId} className="source-item">
                    <div className="source-info">
                      <span className="source-name" style={{ color: getSourceColor(source.name) }}>{source.name}</span>
                      <span className="source-category">{source.categoryName}</span>
                    </div>
                    <button 
                      className="add-button"
                      onClick={() => handleToggleSource(source.sourceId, false)}
                      title="Подписаться"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
