import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { authAPI } from '../api/auth';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.register(login, email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        userId: response.userId,
        login: response.login,
        email: response.email,
      }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-page">
      <Header />
      <div className="register-content">
        <div className="register-container">
          <div className="register-wrapper">
            <div className="register-header">
              <h1 className="register-title">Регистрация</h1>
              <p className="register-subtitle">Создайте новый аккаунт</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <form className="register-form" onSubmit={handleRegister}>
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
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="register-button" disabled={loading}>
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
              
              <div className="login-link-container">
                <span className="login-link-text">Уже есть аккаунт?</span>
                <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                  Войти
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
