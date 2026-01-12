import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './SourcesPage.css';

interface Source {
  id: number;
  name: string;
  icon: React.ReactNode;
}

interface Template {
  id: number;
  name: string;
  sources: string[];
  color: string;
}

const mockSources: Source[] = [
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

const getTemplateIcon = (templateName: string) => {
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
};

const SourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [showAllSources, setShowAllSources] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleDeleteSource = (id: number) => {
    setSources(sources.filter(source => source.id !== id));
  };

  const handleAddSource = () => {
    if (selectedSource && !sources.find(s => s.name === selectedSource)) {
      const newSource: Source = {
        id: Date.now(),
        name: selectedSource,
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#667eea"/>
            <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      };
      setSources([...sources, newSource]);
      setSelectedSource("");
      setIsSourceDropdownOpen(false);
    }
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleAddTemplate = () => {
    if (selectedTemplate) {
      const templateConfig = predefinedTemplates.find(t => t.name === selectedTemplate);
      
      if (templateConfig && !templates.find(t => t.name === selectedTemplate)) {
        const newTemplate: Template = {
          id: Date.now(),
          name: selectedTemplate,
          sources: templateConfig.sources,
          color: templateConfig.color
        };

        setTemplates([...templates, newTemplate]);
        setSelectedTemplate("");
        setIsTemplateDropdownOpen(false);
      }
    }
  };

  const displayedSources = showAllSources ? sources : sources.slice(0, 3);
  const displayedTemplates = showAllTemplates ? templates : templates.slice(0, 3);

  return (
    <div className="sources-page">
      <Header />
      <div className="sources-content">
        <div className="back-button">
          <button onClick={handleBackToMain} className="back-link">
            Вернуться на главную страницу
          </button>
        </div>
        
        {/* Sources Section */}
        <div className="sources-section">
          <div className="section-header">
            <h1 className="section-title">Ваши источники</h1>
          </div>

          <div className="sources-list">
            {displayedSources.map((source) => (
              <div key={source.id} className="source-item">
                <div className="source-info">
                  <span className="source-icon">{source.icon}</span>
                  <span className="source-name">{source.name}</span>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteSource(source.id)}
                  title="Удалить источник"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L14 14M6 14L14 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {sources.length > 3 && (
            <button 
              className="show-all-button"
              onClick={() => setShowAllSources(!showAllSources)}
            >
              {showAllSources ? "Скрыть" : "Показать полностью"}
            </button>
          )}

          <div className="add-source-section">
            <h2 className="add-source-title">Добавить новый источник</h2>
            <div className="add-source-form">
              <div className="dropdown-container">
                <button 
                  className="dropdown-button"
                  onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                >
                  {selectedSource || "Выберите источник"}
                  <svg 
                    className={`dropdown-arrow ${isSourceDropdownOpen ? 'open' : ''}`}
                    width="12" height="8" viewBox="0 0 12 8" fill="none"
                  >
                    <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {isSourceDropdownOpen && (
                  <div className="dropdown-menu">
                    {availableSources.map((source) => (
                      <div 
                        key={source}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedSource(source);
                          setIsSourceDropdownOpen(false);
                        }}
                      >
                        {source}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                className="add-button"
                onClick={handleAddSource}
                disabled={!selectedSource}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="templates-section">
          <div className="section-header">
            <h1 className="section-title">Ваши шаблоны</h1>
          </div>

          <div className="templates-list">
            {displayedTemplates.map((template) => (
              <div key={template.id} className="template-item">
                <div className="template-info">
                  <div className="template-header">
                    {getTemplateIcon(template.name)}
                    <span className="template-name">{template.name}</span>
                  </div>
                  <div className="template-sources">
                    {template.sources.join(", ")}
                  </div>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteTemplate(template.id)}
                  title="Удалить шаблон"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L14 14M6 14L14 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {templates.length > 3 && (
            <button 
              className="show-all-button"
              onClick={() => setShowAllTemplates(!showAllTemplates)}
            >
              {showAllTemplates ? "Скрыть" : "Показать полностью"}
            </button>
          )}

          <div className="add-template-section">
            <h2 className="add-template-title">Добавить новый шаблон</h2>
            <div className="add-template-form">
              <div className="form-row">
                <div className="dropdown-container">
                  <button 
                    className="dropdown-button"
                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                  >
                    {selectedTemplate || "Выберите шаблон"}
                    <svg 
                      className={`dropdown-arrow ${isTemplateDropdownOpen ? 'open' : ''}`}
                      width="12" height="8" viewBox="0 0 12 8" fill="none"
                    >
                      <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {isTemplateDropdownOpen && (
                    <div className="dropdown-menu">
                      {predefinedTemplates
                        .filter(template => !templates.find(t => t.name === template.name))
                        .map((template) => (
                        <div 
                          key={template.name}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedTemplate(template.name);
                            setIsTemplateDropdownOpen(false);
                          }}
                        >
                          {template.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  className="add-button"
                  onClick={handleAddTemplate}
                  disabled={!selectedTemplate}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
