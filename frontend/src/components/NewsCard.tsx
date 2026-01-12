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
        <div className="category-image">
          <img 
            src={`/images/categories/${category.toLowerCase().replace(/\s+/g, '-')}.png`}
            alt={category}
            onError={(e) => {
              console.log('Image failed to load for category:', category);
              console.log('Image path:', `/images/categories/${category.toLowerCase().replace(/\s+/g, '-')}.png`);
              // Fallback to color block if image not found
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          />
          <div 
            className="color-block fallback" 
            style={{ backgroundColor: color }}
          ></div>
        </div>
        <p className="news-summary">{summary}</p>
      </div>
    </div>
  );
};

export default NewsCard;
