import React from 'react';
import NewsCard from './NewsCard';
import './NewsGrid.css';

interface NewsItem {
  id: number;
  category: string;
  summary: string;
  color: string;
}

interface NewsGridProps {
  news: NewsItem[];
}

const NewsGrid: React.FC<NewsGridProps> = ({ news }) => {
  return (
    <div className="news-grid">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          category={item.category}
          summary={item.summary}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default NewsGrid;
