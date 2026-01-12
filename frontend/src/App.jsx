import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import NewsGrid from './components/NewsGrid';
import SourcesPage from './components/SourcesPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import NewPasswordPage from './components/NewPasswordPage';
import CategoryPage from './components/CategoryPage';
import RegisterPage from './components/RegisterPage';
import { newsAPI } from './api/news';
import './App.css';

// Защищенный роут
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true)
      const data = await newsAPI.getCategories();
      setCategories(data)
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Перезагружаем категории при возврате на главную страницу
  useEffect(() => {
    const handleFocus = () => {
      if (window.location.pathname === '/') {
        fetchCategories()
      }
    }
    window.addEventListener('focus', handleFocus)
    
    // Слушаем событие обновления источников
    const handleSourcesUpdated = () => {
      if (window.location.pathname === '/') {
        fetchCategories()
      }
    }
    window.addEventListener('sourcesUpdated', handleSourcesUpdated)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('sourcesUpdated', handleSourcesUpdated)
    }
  }, [])

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
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
                    <NewsGrid categories={categories} />
                  )}
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/sources" element={
            <ProtectedRoute>
              <SourcesPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/category/:categoryName" element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
