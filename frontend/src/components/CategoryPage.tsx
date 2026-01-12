import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import './CategoryPage.css';

interface Article {
  id: number;
  title: string;
  content: string;
  source: string;
  color: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Поездка в Египет",
    content: "Я недавно вернулся из поездки в Египет и хочу поделиться своими впечатлениями. Это была моя первая поездка в эту страну, и я был поражен её красотой и богатой историей. Мы посетили пирамиды Гизы, храмы Луксора и плавали по Нилу. Египет - это место, где каждый камень рассказывает историю.\n\nВо время поездки мы остановились в небольшом бюджетном отеле недалеко от центра Каира. Несмотря на скромные условия, персонал был очень дружелюбным и всегда готов помочь. Завтраки включали традиционные египетские блюда, которые были очень вкусными.\n\nОсобенно запомнился поход на рынок Хан эль-Халили. Там можно купить всё что угодно - от специй до сувениров. Атмосфера на рынке невероятная - шум, запахи, люди со всего мира. Я обязательно вернусь в Египет снова!",
    source: "https://example.com/egypt-trip",
    color: "#2D5016"
  },
  {
    id: 2,
    title: "Поездка в Египет",
    content: "Я недавно вернулся из поездки в Египет и хочу поделиться своими впечатлениями. Это была моя первая поездка в эту страну, и я был поражен её красотой и богатой историей. Мы посетили пирамиды Гизы, храмы Луксора и плавали по Нилу. Египет - это место, где каждый камень рассказывает историю.\n\nВо время поездки мы остановились в небольшом бюджетном отеле недалеко от центра Каира. Несмотря на скромные условия, персонал был очень дружелюбным и всегда готов помочь. Завтраки включали традиционные египетские блюда, которые были очень вкусными.\n\nОсобенно запомнился поход на рынок Хан эль-Халили. Там можно купить всё что угодно - от специй до сувениров. Атмосфера на рынке невероятная - шум, запахи, люди со всего мира. Я обязательно вернусь в Египет снова!",
    source: "https://example.com/egypt-trip",
    color: "#1E3A8A"
  }
];

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setArticles(mockArticles);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className="category-page">
      <Header />
      <div className="category-content">
        <div className="back-button">
          <button onClick={handleBackToMain} className="back-link">
            Вернуться на главную страницу
          </button>
        </div>
        
        <div className="category-header">
          <h1 className="category-title">{decodeURIComponent(categoryName || '')}</h1>
        </div>

        {loading ? (
          <div className="loading">Загрузка статей...</div>
        ) : (
          <div className="articles-container">
            {articles.map((article) => (
              <div key={article.id} className="article-preview">
                <div className="article-content">
                  <div 
                    className="article-image-placeholder" 
                    style={{ backgroundColor: article.color }}
                  ></div>
                  <div className="article-text">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-body">{article.content}</p>
                    <a 
                      href={article.source} 
                      className="source-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Читать в оригинальном источнике
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
