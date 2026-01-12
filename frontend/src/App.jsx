import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import NewsGrid from './components/NewsGrid';
import SourcesPage from './components/SourcesPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import NewPasswordPage from './components/NewPasswordPage';
import CategoryPage from './components/CategoryPage';
import RegisterPage from './components/RegisterPage';
import './App.css';

const mockNewsData = [
  {
    id: 1,
    category: "Название категории",
    summary: "Коротко о главном в 2 предложения",
    color: "#2D5016" // Темно-зеленый
  },
  {
    id: 2,
    category: "Название категории", 
    summary: "Коротко о главном в 2 предложения",
    color: "#C8553D" // Светло-красный
  },
  {
    id: 3,
    category: "Название категории",
    summary: "Коротко о главном в 2 предложения", 
    color: "#2D5016" // Темно-зеленый
  },
  {
    id: 4,
    category: "Название категории",
    summary: "Коротко о главном в 2 предложения",
    color: "#3498DB" // Синий
  },
  {
    id: 5,
    category: "Название категории",
    summary: "Коротко о главном в 2 предложения",
    color: "#F1C40F" // Желтый
  },
  {
    id: 6,
    category: "Название категории",
    summary: "Коротко о главном в 2 предложения",
    color: "#8B0000" // Темно-красный
  }
]

function App() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // В будущем здесь будет реальный API вызов
        // const response = await fetch('/api/news')
        // const data = await response.json()
        
        setNews(mockNewsData)
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <div className="app">
              <Header />
              <main className="main-content">
                <div className="sources-link">
                  <Link to="/sources" className="sources-link-text">
                    Изменить список источников
                  </Link>
                </div>
                {loading ? (
                  <div className="loading">Загрузка новостей...</div>
                ) : (
                  <NewsGrid news={news} />
                )}
              </main>
            </div>
          } />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
