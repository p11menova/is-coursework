import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { authAPI } from '../api/auth';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authAPI.login(login, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        userId: response.userId,
        login: response.login,
        email: response.email,
      }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте логин и пароль.');
    } finally {
      setLoading(false);
    }
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
                <label htmlFor="login" className="form-label">Логин</label>
                <input
                  type="text"
                  id="login"
                  className="form-input"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}

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

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
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
