import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации
    console.log('Login attempt:', { email, password });
    // Временно переходим на главную страницу
    navigate('/');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-content">
        <div className="login-container">
          <div className="login-wrapper">
            <div className="login-header">
              <h1 className="login-title">Вход в аккаунт</h1>
              <p className="login-subtitle">Введите свои данные для входа</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Пароль</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-button">
                Войти
              </button>
              
              <div className="forgot-password-container">
                <a href="#" className="forgot-password" onClick={handleForgotPassword}>Забыли пароль?</a>
              </div>
              
              <div className="signup-container">
                <span className="signup-text">Нет аккаунта?</span>
                <a href="#" className="signup-link" onClick={handleRegister}>Зарегистрироваться</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
