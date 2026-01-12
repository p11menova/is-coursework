import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { newsAPI } from '../api/news';
import './CategoryPage.css';

interface Article {
  newsId: number;
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  publishedDate: string;
  sourceName: string;
  categoryName: string;
  isRead: boolean;
}

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!categoryName) return;
      
      try {
        setLoading(true);
        const response = await newsAPI.getNewsByCategory(categoryName, page, 20);
        const newArticles = response.content || [];
        setArticles(prev => page === 0 ? newArticles : [...prev, ...newArticles]);
        setHasMore(!response.last);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryName, page]);

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

        {loading && page === 0 ? (
          <div className="loading">Загрузка статей...</div>
        ) : articles.length === 0 ? (
          <div className="no-articles">Нет новостей в этой категории</div>
        ) : (
          <div className="articles-container">
            {articles.map((article) => (
              <div key={article.newsId} className="article-preview">
                <div className="article-content">
                  {article.imageUrl && article.imageUrl.startsWith('http') ? (
                     <img src={article.imageUrl} alt={article.sourceName} className="article-logo" onError={(e) => {
                       e.currentTarget.style.display = 'none';
                     }} />
                   ) : null}
                  <div className="article-text">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-body">{article.content.substring(0, 500) + (article.content.length > 500 ? '...' : '')}</p>
                    <div className="article-meta">
                      <span className="article-source">{article.sourceName}</span>
                      <span className="article-date">{new Date(article.publishedDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <a 
                      href={article.url} 
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
            {hasMore && (
              <button 
                onClick={() => setPage(prev => prev + 1)} 
                className="load-more-button"
                disabled={loading}
              >
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
