import React from 'react';
import NewsCard from './NewsCard';
import './NewsGrid.css';

interface CategoryNews {
  categoryName: string;
  summary: string;
  latestNewsDate?: string;
}

interface NewsGridProps {
  categories: CategoryNews[];
}

const colors = ['#2D5016', '#C8553D', '#3498DB', '#F1C40F', '#8B0000', '#9B59B6', '#E67E22'];

const NewsGrid: React.FC<NewsGridProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return <div className="no-news">Нет новостей. Подпишитесь на источники на странице источников.</div>;
  }

  return (
    <div className="news-grid">
      {categories.map((item, index) => (
        <NewsCard
          key={item.categoryName}
          category={item.categoryName}
          summary={item.summary}
          color={colors[index % colors.length]}
        />
      ))}
    </div>
  );
};

export default NewsGrid;
