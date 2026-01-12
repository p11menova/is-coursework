import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewsCard.css';

interface NewsCardProps {
  category: string;
  summary: string;
  color: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ category, summary, color }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <div className="news-card" onClick={handleCardClick}>
      <div className="news-card-content">
        <div className="category-header">
          <h3 className="category-title">{category}</h3>
        </div>
        <div 
          className="color-block" 
          style={{ backgroundColor: color }}
        ></div>
        <p className="news-summary">{summary}</p>
      </div>
    </div>
  );
};

export default NewsCard;
