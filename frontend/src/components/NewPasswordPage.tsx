import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { authAPI } from '../api/auth';
import './NewPasswordPage.css';

const NewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    const savedCode = localStorage.getItem('resetCode');
    if (!savedEmail || !savedCode) {
      navigate('/forgot-password');
    } else {
      setEmail(savedEmail);
      setCode(savedCode);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    
    setLoading(true);
    
    try {
      await authAPI.resetPassword(email, code, newPassword);
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка сброса пароля. Проверьте код.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-password-page">
      <Header />
      <div className="new-password-content">
        <div className="new-password-container">
          <div className="new-password-wrapper">
            <div className="new-password-header">
              <h1 className="new-password-title">Новый пароль</h1>
              <p className="new-password-subtitle">Введите новый пароль для вашего аккаунта</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <form className="new-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">Новый пароль</label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-input"
                  placeholder="Введите новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Подтвердите новый пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить пароль'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
